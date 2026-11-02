/*
 * Red: conecta los dispositivos de los jugadores sin servidor propio (PeerJS, WebRTC).
 *
 *  - El que crea la partida es el ANFITRIÓN: su navegador guarda el estado completo, valida las
 *    acciones y envía a cada jugador solo lo que le corresponde (MOTOR.vistaPara).
 *  - Los demás son CLIENTES: se conectan con el código de 4 letras y solo reciben su vista.
 *
 * Importante: si el anfitrión cierra la pestaña la partida se detiene, pero puede reanudarla
 * volviendo a abrir la web en el mismo navegador (el estado se guarda en su dispositivo).
 */
const RED = (() => {
  const PREFIJO = 'mbc-';
  const LETRAS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';          // sin I ni O para no confundirlas con 1 y 0
  const claveGuardado = codigo => 'mbc_partida_' + codigo;

  const codigoNuevo = () => Array.from({ length: 4 }, () => LETRAS[Math.floor(Math.random() * LETRAS.length)]).join('');
  const limpiarCodigo = s => String(s || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);

  function cargarScript(src) {
    return new Promise((ok, ko) => {
      const s = document.createElement('script');
      s.src = src; s.onload = ok; s.onerror = () => ko(new Error('No se pudo cargar ' + src));
      document.head.appendChild(s);
    });
  }

  /* ===================== ANFITRIÓN ===================== */
  class Anfitrion {
    constructor({ codigo, perfil, onVista, onError, onResultado, onRed }) {
      Object.assign(this, { codigo, perfil, onVista, onError, onResultado, onRed });
      this.conns = new Map();       // id de jugador -> conexión
      this.peer = null; this.cerrado = false;
    }

    async iniciar(reanudar) {
      if (typeof SECRETOS === 'undefined') await cargarScript('secretos.js');    // solo el anfitrión descarga las tarjetas
      if (reanudar) {
        try { this.G = JSON.parse(localStorage.getItem(claveGuardado(this.codigo))); } catch (e) { this.G = null; }
        if (!this.G) throw new Error('No hay ninguna partida guardada con ese código en este dispositivo.');
        this.G.jugadores.forEach(j => { j.conectado = (j.id === this.perfil.id); });
      } else {
        this.G = MOTOR.nuevaPartida(this.codigo);
      }
      MOTOR.unir(this.G, this.perfil, true);
      await this.abrirPeer();
      this.cambio();
    }

    abrirPeer(intento = 0) {
      return new Promise((ok, ko) => {
        const p = new Peer(PREFIJO + this.codigo, { debug: 0 });
        this.peer = p;
        p.on('open', () => { this.onRed('ok'); ok(); });
        p.on('connection', c => this.alConectar(c));
        p.on('disconnected', () => { if (!this.cerrado) { this.onRed('reconectando'); try { p.reconnect(); } catch (e) {} } });
        p.on('error', e => {
          if (e.type === 'unavailable-id') {      // el identificador puede tardar unos segundos en liberarse tras recargar
            p.destroy();
            if (intento < 8) setTimeout(() => this.abrirPeer(intento + 1).then(ok, ko), 2500);
            else ko(new Error('Ese código de sala ya está en uso. Prueba con otro.'));
          } else if (!p.open) ko(new Error('No se pudo conectar con el servicio de conexión (' + e.type + ').'));
          else this.onError('Error de red: ' + e.type);
        });
      });
    }

    alConectar(conn) {
      conn.on('data', m => this.recibir(conn, m));
      conn.on('close', () => this.alCerrar(conn));
      conn.on('error', () => this.alCerrar(conn));
    }

    recibir(conn, m) {
      if (!m || typeof m !== 'object') return;
      if (m.t === 'unirse') {
        const r = MOTOR.unir(this.G, { id: String(m.id), nombre: m.nombre, avatar: m.avatar }, false);
        if (r.error) { conn.send({ t: 'error', msg: r.error, fatal: true }); return; }
        conn._jid = String(m.id);
        const previa = this.conns.get(conn._jid);
        this.conns.set(conn._jid, conn);
        if (previa && previa !== conn) { try { previa.close(); } catch (e) {} }
        this.cambio();
      } else if (m.t === 'accion' && conn._jid) {
        const r = this.ejecutar(conn._jid, m.msg || {});
        if (r.error) conn.send({ t: 'error', msg: r.error });
        else if (r.resultado) conn.send({ t: 'resultado', resultado: r.resultado, animal: (m.msg || {}).animal });
      }
    }

    alCerrar(conn) {
      const id = conn._jid;
      if (!id || this.conns.get(id) !== conn) return;
      this.conns.delete(id);
      MOTOR.salir(this.G, id);
      this.cambio();
    }

    ejecutar(id, msg) {
      const r = msg.a === 'iniciar' ? MOTOR.iniciar(this.G, id) : MOTOR.accion(this.G, id, msg);
      if (r.ok) this.cambio();
      return r;
    }

    /* acción del propio anfitrión (juega como uno más) */
    enviar(msg) {
      const r = this.ejecutar(this.perfil.id, msg);
      if (r.error) this.onError(r.error);
      else if (r.resultado) this.onResultado(r.resultado, msg.animal);
    }

    cambio() {
      try { localStorage.setItem(claveGuardado(this.codigo), JSON.stringify(this.G)); } catch (e) {}
      this.conns.forEach((c, id) => { if (c.open) c.send({ t: 'vista', vista: MOTOR.vistaPara(this.G, id) }); });
      this.onVista(MOTOR.vistaPara(this.G, this.perfil.id));
    }

    cerrar(borrar) {
      this.cerrado = true;
      this.conns.forEach(c => { try { c.close(); } catch (e) {} });
      try { this.peer.destroy(); } catch (e) {}
      if (borrar) localStorage.removeItem(claveGuardado(this.codigo));
    }
  }

  /* ===================== CLIENTE ===================== */
  class Cliente {
    constructor({ codigo, perfil, onVista, onError, onResultado, onRed }) {
      Object.assign(this, { codigo, perfil, onVista, onError, onResultado, onRed });
      this.peer = null; this.conn = null; this.cerrado = false; this.fatal = false; this.reintentos = 0;
    }

    iniciar() {
      return new Promise((ok, ko) => {
        this.primera = { ok, ko };
        this.abrir();
      });
    }

    abrir() {
      if (this.cerrado) return;
      this.onRed('conectando');
      const p = new Peer({ debug: 0 });
      this.peer = p;
      p.on('open', () => this.conectar());
      p.on('error', e => {
        if (e.type === 'peer-unavailable') this.fallo('No hay ninguna partida con el código ' + this.codigo + ', o el anfitrión no está conectado.', false);
        else if (!p.open) this.fallo('No se pudo conectar con el servicio de conexión (' + e.type + ').', false);
      });
    }

    conectar() {
      const c = this.peer.connect(PREFIJO + this.codigo, { reliable: true, serialization: 'json' });
      this.conn = c;
      const limite = setTimeout(() => { if (!c.open) { try { c.close(); } catch (e) {} this.fallo('Se ha agotado el tiempo de conexión con el anfitrión.', false); } }, 20000);
      c.on('open', () => {
        clearTimeout(limite); this.reintentos = 0;
        c.send({ t: 'unirse', id: this.perfil.id, nombre: this.perfil.nombre, avatar: this.perfil.avatar });
        this.onRed('ok');
      });
      c.on('data', m => {
        if (!m) return;
        if (m.t === 'vista') { if (this.primera) { this.primera.ok(); this.primera = null; } this.onVista(m.vista); }
        else if (m.t === 'error') { if (m.fatal) { this.fatal = true; this.fallo(m.msg, true); } else this.onError(m.msg); }
        else if (m.t === 'resultado') this.onResultado(m.resultado, m.animal);
      });
      c.on('close', () => { clearTimeout(limite); if (!this.cerrado && !this.fatal) this.fallo('Se ha perdido la conexión con el anfitrión.', false); });
    }

    fallo(msg, definitivo) {
      if (this.cerrado) return;
      if (this.primera) { const k = this.primera.ko; this.primera = null; this.cerrar(); k(new Error(msg)); return; }
      if (definitivo) { this.onError(msg); return; }
      this.onRed('perdida');
      if (this.reintentos++ < 40) {          // reintenta durante unos minutos (por ejemplo si el anfitrión recarga la página)
        try { this.peer.destroy(); } catch (e) {}
        setTimeout(() => this.abrir(), 3000);
      } else this.onError(msg);
    }

    enviar(msg) {
      if (this.conn && this.conn.open) this.conn.send({ t: 'accion', msg });
      else this.onError('Sin conexión con el anfitrión.');
    }

    cerrar() {
      this.cerrado = true;
      try { this.conn && this.conn.close(); } catch (e) {}
      try { this.peer && this.peer.destroy(); } catch (e) {}
    }
  }

  return { Anfitrion, Cliente, codigoNuevo, limpiarCodigo, claveGuardado };
})();

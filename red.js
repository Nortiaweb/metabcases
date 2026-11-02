/*
 * Red: habla con el servidor de partidas (API de AWS). No hay conexión directa entre jugadores.
 *
 *  - El que crea la sala es el ANFITRIÓN. Solo él puede empezar la partida.
 *  - Los demás se unen con el código de 4 letras.
 *  - Cada navegador pregunta el estado de su sala cada 2 segundos y recibe solo su vista
 *    (cartas descubiertas y notas privadas nunca salen de su propio dispositivo).
 *  - Las soluciones y las reglas viven en el servidor. Este archivo no las contiene.
 */
const RED = (() => {
  const API = 'https://ph7r8xdq1c.execute-api.eu-north-1.amazonaws.com';
  const INTERVALO = 2000;
  const LETRAS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';          // sin I ni O para no confundirlas con 1 y 0
  const claveGuardado = codigo => 'mbc_partida_' + codigo;

  const codigoNuevo = () => Array.from({ length: 4 }, () => LETRAS[Math.floor(Math.random() * LETRAS.length)]).join('');
  const limpiarCodigo = s => String(s || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);

  async function llamar(metodo, ruta, cuerpo) {
    const r = await fetch(API + ruta, {
      method: metodo,
      headers: { 'content-type': 'application/json' },
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    });
    let datos = {};
    try { datos = await r.json(); } catch (e) { /* respuesta sin cuerpo */ }
    return { status: r.status, datos };
  }

  class Sesion {
    constructor({ codigo, perfil, onVista, onError, onResultado, onRed }) {
      Object.assign(this, { codigo, perfil, onVista, onError, onResultado, onRed });
      this.ultimoJson = ''; this.timer = null; this.ocupado = false; this.cerrado = false;
    }

    empezarSondeo() {
      this.onRed('ok');
      this.sondear();
      this.timer = setInterval(() => this.sondear(), INTERVALO);
    }

    async sondear() {
      if (this.cerrado || this.ocupado) return;
      this.ocupado = true;
      try {
        const r = await fetch(`${API}/salas/${this.codigo}/vista?jugadorId=${encodeURIComponent(this.perfil.id)}`);
        if (r.status === 404) { this.onError('La partida ya no existe.'); this.cerrar(false); return; }
        if (!r.ok) throw new Error('HTTP ' + r.status);
        this.aplicar(await r.json());
        this.onRed('ok');
      } catch (e) {
        this.onRed('perdida');
      } finally {
        this.ocupado = false;
      }
    }

    aplicar(vista) {
      const json = JSON.stringify(vista);
      if (json === this.ultimoJson) return;          // sin cambios: no volver a pintar la pantalla
      this.ultimoJson = json;
      try { localStorage.setItem(claveGuardado(this.codigo), json); } catch (e) {}
      this.onVista(vista);
    }

    async enviar(msg) {
      const esInicio = msg.a === 'iniciar';
      const ruta = esInicio ? `/salas/${this.codigo}/iniciar` : `/salas/${this.codigo}/accion`;
      const cuerpo = esInicio ? { jugadorId: this.perfil.id } : { jugadorId: this.perfil.id, accion: msg };
      try {
        const { status, datos } = await llamar('POST', ruta, cuerpo);
        if (status !== 200) { this.onError(datos.error || 'No se pudo completar la acción.'); return; }
        if (datos.vista) this.aplicar(datos.vista);
        if (datos.resultado) this.onResultado(datos.resultado, msg.animal);
      } catch (e) {
        this.onError('Sin conexión con el servidor. Inténtalo de nuevo.');
      }
    }

    cerrar(borrar) {
      this.cerrado = true;
      clearInterval(this.timer);
      if (borrar) { try { localStorage.removeItem(claveGuardado(this.codigo)); } catch (e) {} }
    }
  }

  /* ===================== ANFITRIÓN ===================== */
  class Anfitrion extends Sesion {
    async iniciar(reanudar) {
      if (reanudar) {
        const { status, datos } = await llamar('GET', `/salas/${this.codigo}/vista?jugadorId=${encodeURIComponent(this.perfil.id)}`);
        if (status !== 200) throw new Error('No hay ninguna partida guardada con ese código.');
        this.aplicar(datos);
      } else {
        const { status, datos } = await llamar('POST', '/salas', {
          codigo: this.codigo, id: this.perfil.id, nombre: this.perfil.nombre, avatar: this.perfil.avatar,
        });
        if (status !== 201) throw new Error(datos.error || 'No se pudo crear la sala.');
        this.aplicar(datos.vista);
      }
      this.empezarSondeo();
    }
  }

  /* ===================== CLIENTE ===================== */
  class Cliente extends Sesion {
    async iniciar() {
      const { status, datos } = await llamar('POST', `/salas/${this.codigo}/unir`, {
        id: this.perfil.id, nombre: this.perfil.nombre, avatar: this.perfil.avatar,
      });
      if (status !== 200) throw new Error(datos.error || 'No se pudo entrar en la sala.');
      this.aplicar(datos.vista);
      this.empezarSondeo();
    }
  }

  return { Anfitrion, Cliente, codigoNuevo, limpiarCodigo, claveGuardado };
})();

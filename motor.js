/*
 * Motor del juego: reglas y estado. No toca la pantalla ni la red.
 *
 * Quien crea la partida (el anfitrión) guarda el estado completo G y valida todas las acciones.
 * A cada jugador solo le envía su "vista" (vistaPara), que incluye únicamente las tarjetas que
 * ese jugador ha descubierto. Las notas del cuaderno nunca salen del dispositivo de cada uno.
 */
const AVATARES = ['👩‍⚕️', '👨‍⚕️', '🧑‍⚕️', '👩🏽‍⚕️', '👨🏾‍⚕️', '🧑🏻‍⚕️', '🧑‍🌾', '🦸'];
const COLORES  = ['#4f8a3c', '#b8412f', '#2e7fb0', '#c98a12', '#8a4fa8', '#1d8f8a'];

const MOTOR = (() => {
  const C = CASOS[0];
  const SALAS = {}, SALA_EN = {}, PUERTA = {};
  C.salas.forEach(s => {
    SALAS[s.id] = s;
    const [r0, c0, h, w] = s.rect;
    for (let r = r0; r < r0 + h; r++) for (let c = c0; c < c0 + w; c++) SALA_EN[r + ',' + c] = s.id;
    s.puertas.forEach(([r, c]) => PUERTA[r + ',' + c] = s.id);
  });
  const ANIMALES = C.animales.map(a => a.id);
  const MAX_JUG = C.mapa.inicio.length;
  const PENALIZACION = 2;               // turnos que pierde quien falla una acusación

  const rnd6 = () => 1 + Math.floor(Math.random() * 6);
  const vivo = (G, id) => G.jugadores.find(j => j.id === id);
  const nomAn = id => C.animales.find(a => a.id === id);
  const deAn = a => a.nombre.toLowerCase().replace(/^el /, 'del ').replace(/^la /, 'de la ');   // "de el caballo" -> "del caballo"

  function log(G, txt) { G.registro.unshift({ txt, ts: Date.now() }); if (G.registro.length > 80) G.registro.length = 80; }

  /* ---------------- creación y lobby ---------------- */
  function nuevaPartida(codigo) {
    return { v: 1, codigo, caso: C.id, fase: 'lobby', jugadores: [], turno: 0, turnoFase: 'inicio', animalFinal: null,
             dados: null, pasos: 0, seqDados: 0, seqCarta: 0, registro: [], ganador: null, final: null };
  }

  function unir(G, { id, nombre, avatar }, esAnfitrion) {
    const ya = vivo(G, id);
    if (ya) { ya.conectado = true; return { ok: true, rejoin: true }; }
    if (G.fase !== 'lobby') return { error: 'La partida ya ha empezado.' };
    if (G.jugadores.length >= MAX_JUG) return { error: 'La sala está llena (máximo ' + MAX_JUG + ' veterinarios).' };
    const usados = G.jugadores.map(j => j.color);
    const color = COLORES.find(c => !usados.includes(c)) || COLORES[0];
    const nom = String(nombre || '').trim().slice(0, 20) || ('Veterinario ' + (G.jugadores.length + 1));
    const av = AVATARES.includes(avatar) ? avatar : AVATARES[G.jugadores.length % AVATARES.length];
    G.jugadores.push({
      id, nombre: nom, avatar: av, color, conectado: true, anfitrion: !!esAnfitrion,
      pos: {}, resueltos: {}, penal: 0,
      priv: { archivo: [], mazo: { oveja: {}, caballo: {} }, cartaNueva: null }
    });
    log(G, `👋 ${nom} se ha unido a la partida.`);
    return { ok: true };
  }

  function salir(G, id) {   // en el lobby se borra; en juego solo se marca como desconectado
    const j = vivo(G, id); if (!j) return;
    if (G.fase === 'lobby' && !j.anfitrion) G.jugadores = G.jugadores.filter(x => x.id !== id);
    else j.conectado = false;
  }

  function iniciar(G, id) {
    const j = vivo(G, id);
    if (!j || !j.anfitrion) return { error: 'Solo el anfitrión puede empezar la partida.' };
    if (G.fase !== 'lobby') return { error: 'La partida ya ha empezado.' };
    if (G.jugadores.filter(x => x.conectado).length < 2) return { error: 'Hacen falta al menos 2 veterinarios.' };
    G.jugadores = G.jugadores.filter(x => x.conectado);
    G.jugadores.forEach((p, i) => {
      const [r, c] = C.mapa.inicio[i];
      C.animales.forEach(a => { p.pos[a.id] = { tipo: 'celda', r, c }; p.resueltos[a.id] = false; });
    });
    G.fase = 'juego'; G.turno = 0; G.turnoFase = 'inicio';
    log(G, '🚜 ¡Empieza la partida! Gana quien resuelva antes los dos casos.');
    return { ok: true };
  }

  /* ---------------- movimiento ---------------- */
  const caminable = (r, c) => r >= 0 && c >= 0 && r < C.mapa.filas && c < C.mapa.columnas && !SALA_EN[r + ',' + c];

  /* A qué casillas y salas llega una ficha con "pasos" pasos. Se usa en el anfitrión (validar) y en pantalla (iluminar). */
  function calcularAlcance(pos, pasos) {
    const dist = new Map(), cola = [];
    if (pos.tipo === 'celda') { dist.set(pos.r + ',' + pos.c, 0); cola.push([pos.r, pos.c]); }
    else if (pasos >= 1) SALAS[pos.id].puertas.forEach(([r, c]) => { dist.set(r + ',' + c, 1); cola.push([r, c]); });   // salir cuesta 1 paso
    for (let i = 0; i < cola.length; i++) {
      const [r, c] = cola[i], d = dist.get(r + ',' + c);
      if (d >= pasos) continue;
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => {
        const nr = r + dr, nc = c + dc, k = nr + ',' + nc;
        if (caminable(nr, nc) && !dist.has(k)) { dist.set(k, d + 1); cola.push([nr, nc]); }
      });
    }
    const salas = new Set();
    dist.forEach((d, k) => {
      const sala = PUERTA[k];
      if (sala && d + 1 <= pasos && !(pos.tipo === 'sala' && pos.id === sala)) salas.add(sala);   // entrar cuesta 1 paso
    });
    if (pos.tipo === 'celda') dist.delete(pos.r + ',' + pos.c);
    return { celdas: dist, salas };
  }

  /* ---------------- turnos ---------------- */
  function avanzarTurno(G) {
    const n = G.jugadores.length;
    for (let k = 0; k < n; k++) {
      G.turno = (G.turno + 1) % n;
      const j = G.jugadores[G.turno];
      if (!j.conectado) { log(G, `📴 ${j.nombre} está desconectado: se salta su turno.`); continue; }
      if (j.penal > 0) { j.penal--; log(G, `⏳ ${j.nombre} pierde el turno por su acusación fallida.`); continue; }
      break;
    }
    G.turnoFase = 'inicio'; G.dados = null; G.pasos = 0; G.animalFinal = null;
  }

  function finTrasAccion(G, j, animal) {
    const p = j.pos[animal], s = p.tipo === 'sala' ? SALAS[p.id] : null;
    if (s && s.acusar && !j.resueltos[animal]) { G.turnoFase = 'final'; G.animalFinal = animal; }
    else avanzarTurno(G);
  }

  /* ---------------- tarjetas (privadas) ---------------- */
  function robarTarjeta(G, j, animal, salaId) {
    const lista = ((SECRETOS[G.caso].tarjetas[animal] || {})[salaId]) || [];
    const mz = j.priv.mazo[animal], i = mz[salaId] || 0, sala = SALAS[salaId];
    G.seqCarta++;
    if (i >= lista.length) {
      j.priv.cartaNueva = { seq: G.seqCarta, animal, sala: salaId, tarjeta: null };
      log(G, `${nomAn(animal).emoji} ${j.nombre} registra ${sala.nombre} (${nomAn(animal).nombre.toLowerCase()}) y no encuentra nada nuevo.`);
      return;
    }
    const t = lista[i]; mz[salaId] = i + 1;
    j.priv.archivo.unshift({ animal, sala: salaId, tarjeta: t });
    j.priv.cartaNueva = { seq: G.seqCarta, animal, sala: salaId, tarjeta: t };
    log(G, `${nomAn(animal).emoji} ${j.nombre} descubre una tarjeta en ${sala.icono} ${sala.nombre} (${nomAn(animal).nombre.toLowerCase()}).`);
  }

  /* ---------------- acciones de los jugadores ---------------- */
  function accion(G, id, m) {
    const j = vivo(G, id);
    if (!j) return { error: 'No estás en esta partida.' };
    if (G.fase !== 'juego') return { error: 'La partida no está en marcha.' };
    if (G.jugadores[G.turno].id !== id) return { error: 'No es tu turno.' };
    const animal = m.animal;
    if (['mover', 'investigar', 'pasadizo', 'acusar'].includes(m.a) && !ANIMALES.includes(animal)) return { error: 'Animal desconocido.' };

    switch (m.a) {
      case 'dados': {
        if (G.turnoFase !== 'inicio') return { error: 'Ya has tirado los dados.' };
        G.dados = [rnd6(), rnd6()]; G.pasos = G.dados[0] + G.dados[1]; G.seqDados++; G.turnoFase = 'mover';
        log(G, `🎲 ${j.nombre} saca ${G.dados[0]} + ${G.dados[1]} = ${G.pasos}.`);
        return { ok: true };
      }
      case 'mover': {
        if (G.turnoFase !== 'mover') return { error: 'Primero tira los dados.' };
        const d = m.destino || {}, al = calcularAlcance(j.pos[animal], G.pasos);
        if (d.tipo === 'celda') {
          if (!al.celdas.has(d.r + ',' + d.c)) return { error: 'No llegas hasta esa casilla.' };
          j.pos[animal] = { tipo: 'celda', r: d.r, c: d.c };
          log(G, `${nomAn(animal).emoji} ${j.nombre} avanza por el tablero ${animal === 'oveja' ? 'de la oveja' : 'del caballo'}.`);
          finTrasAccion(G, j, animal);
        } else if (d.tipo === 'sala') {
          if (!al.salas.has(d.id)) return { error: 'No llegas hasta esa sala.' };
          j.pos[animal] = { tipo: 'sala', id: d.id };
          robarTarjeta(G, j, animal, d.id);
          finTrasAccion(G, j, animal);
        } else return { error: 'Destino no válido.' };
        return { ok: true };
      }
      case 'quedarse': {
        if (G.turnoFase !== 'mover') return { error: 'No procede.' };
        avanzarTurno(G); return { ok: true };
      }
      case 'investigar': {
        if (G.turnoFase !== 'inicio') return { error: 'Ya has tirado los dados.' };
        const p = j.pos[animal];
        if (p.tipo !== 'sala') return { error: 'Tienes que estar dentro de una sala.' };
        robarTarjeta(G, j, animal, p.id); finTrasAccion(G, j, animal); return { ok: true };
      }
      case 'pasadizo': {
        if (G.turnoFase !== 'inicio') return { error: 'Ya has tirado los dados.' };
        const p = j.pos[animal], s = p.tipo === 'sala' ? SALAS[p.id] : null;
        if (!s || !s.pasadizo) return { error: 'Aquí no hay pasadizo.' };
        j.pos[animal] = { tipo: 'sala', id: s.pasadizo };
        robarTarjeta(G, j, animal, s.pasadizo); finTrasAccion(G, j, animal); return { ok: true };
      }
      case 'terminar': {
        if (!['inicio', 'final'].includes(G.turnoFase)) return { error: 'No procede.' };
        avanzarTurno(G); return { ok: true };
      }
      case 'acusar': {
        if (!['inicio', 'final'].includes(G.turnoFase)) return { error: 'No puedes acusar ahora.' };
        const p = j.pos[animal], s = p.tipo === 'sala' ? SALAS[p.id] : null;
        if (!s || !s.acusar) return { error: 'Solo se puede acusar desde la Clínica veterinaria de ese tablero.' };
        if (j.resueltos[animal]) return { error: 'Ya has resuelto este caso.' };
        const sel = m.sel || {}, op = C.opciones;
        if (!op.causas.some(x => x.id === sel.causa) || !op.enzimas.some(x => x.id === sel.enzima) || !op.origenes.includes(sel.origen))
          return { error: 'Acusación incompleta.' };
        const sol = SECRETOS[G.caso].solucion[animal], an = nomAn(animal);
        if (sel.causa === sol.causa && sel.enzima === sol.enzima && sel.origen === sol.origen) {
          j.resueltos[animal] = true;
          log(G, `✅ ¡${j.nombre} ha resuelto el caso ${deAn(an)}!`);
          if (ANIMALES.every(a => j.resueltos[a])) {
            G.fase = 'fin'; G.ganador = j.id;
            G.final = { solucion: SECRETOS[G.caso].solucion, explicacion: SECRETOS[G.caso].explicacion };
            log(G, `🏆 ${j.nombre} gana la partida.`);
            return { ok: true, resultado: 'gana' };
          }
          avanzarTurno(G);
          return { ok: true, resultado: 'acierta' };
        }
        j.penal = PENALIZACION;
        log(G, `❌ ${j.nombre} acusa por ${an.nombre.toLowerCase()} y falla: pierde ${PENALIZACION} turnos.`);
        avanzarTurno(G);
        return { ok: true, resultado: 'falla' };
      }
      default: return { error: 'Acción desconocida.' };
    }
  }

  /* ---------------- lo que ve cada jugador ---------------- */
  function restantes(G, j) {
    const out = {};
    ANIMALES.forEach(a => {
      out[a] = {};
      C.salas.forEach(s => {
        const total = (((SECRETOS[G.caso].tarjetas[a] || {})[s.id]) || []).length;
        out[a][s.id] = total - (j.priv.mazo[a][s.id] || 0);
      });
    });
    return out;
  }

  function vistaPara(G, id) {
    const yo = vivo(G, id);
    return {
      codigo: G.codigo, fase: G.fase, yoId: id, esAnfitrion: !!(yo && yo.anfitrion),
      jugadores: G.jugadores.map(j => ({ id: j.id, nombre: j.nombre, avatar: j.avatar, color: j.color, conectado: j.conectado,
        anfitrion: j.anfitrion, pos: j.pos, resueltos: j.resueltos, penal: j.penal })),
      turno: G.turno, turnoFase: G.turnoFase, animalFinal: G.animalFinal,
      dados: G.dados, pasos: G.pasos, seqDados: G.seqDados,
      registro: G.registro.slice(0, 40), ganador: G.ganador, final: G.final,
      yo: (yo && G.fase !== 'lobby') ? { archivo: yo.priv.archivo, cartaNueva: yo.priv.cartaNueva, restantes: restantes(G, yo) } : null
    };
  }

  return { C, SALAS, SALA_EN, PUERTA, ANIMALES, MAX_JUG, nuevaPartida, unir, salir, iniciar, accion, avanzarTurno,
           calcularAlcance, vistaPara };
})();

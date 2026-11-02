/* Interfaz de la partida: dos tableros (uno por animal), turno, tarjetas privadas y cuaderno privado. */
const TIPOS_TARJ = { pista: '🔎 Pista', ayuda: '🧰 Ayuda', descarte: '✅ Descarte' };
const CARAS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };

Object.assign(UI, {
  yo() { return UI.V.jugadores.find(j => j.id === UI.V.yoId); },
  esMiTurno() { const v = UI.V; return v.fase === 'juego' && v.jugadores[v.turno] && v.jugadores[v.turno].id === v.yoId; },
  animal(id) { return C.animales.find(a => a.id === id); },
  de(an) { return an.nombre.toLowerCase().replace(/^el /, 'del ').replace(/^la /, 'de la '); },   // "de el caballo" -> "del caballo"

  /* ================= bucle principal de pintado ================= */
  renderJuego() {
    const v = UI.V;
    $('juCodigo').textContent = 'Sala ' + v.codigo;
    if (UI.seqAnimada === null) UI.seqAnimada = v.seqDados;                    // al reconectar no se vuelve a animar
    if (v.dados && v.seqDados > UI.seqAnimada && !UI.animando) UI.animarDados();
    if (UI.turnoPrevio !== null && UI.turnoPrevio !== v.turno && UI.esMiTurno()) { sonidos.turno(); UI.aviso('🎲 ¡Es tu turno!', 2200); }
    UI.turnoPrevio = v.turno;
    UI.pintarBarra(); UI.pintarTurno(); UI.pintarRegistro(); UI.pintarTableros();
    UI.construirPrivados(); UI.actualizarArchivos();
    UI.revisarCarta(); UI.revisarFin();
  },

  animarDados() {
    UI.animando = true; let n = 0;
    const iv = setInterval(() => {
      UI.dadoTmp = [1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)];
      sonidos.dado(); UI.pintarTurno();
      if (++n >= 9) {
        clearInterval(iv); UI.animando = false; UI.dadoTmp = null; UI.seqAnimada = UI.V.seqDados;
        UI.pintarTurno(); UI.pintarTableros();
      }
    }, 90);
  },

  /* ================= jugadores y turno ================= */
  pintarBarra() {
    const v = UI.V;
    $('juJugadores').innerHTML = v.jugadores.map((j, i) => `
      <span class="jugador ${i === v.turno && v.fase === 'juego' ? 'activo' : ''} ${j.id === v.yoId ? 'yo' : ''} ${j.conectado ? '' : 'fuera'}">
        <span class="avatar" style="--c:${j.color}">${esc(j.avatar)}</span>
        <span>${esc(j.nombre)}${j.id === v.yoId ? ' (tú)' : ''}</span>
        <span class="prog" title="Casos resueltos">${C.animales.map(a => a.emoji + (j.resueltos[a.id] ? '✅' : '▫️')).join(' ')}</span>
        ${j.penal > 0 ? `<span class="pena" title="Turnos que perderá">⏳${j.penal}</span>` : ''}
      </span>`).join('');
  },

  dadoHtml(n, rueda) {
    return `<div class="dado ${rueda ? 'rueda' : ''}" aria-label="Dado: ${n}">${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<i class="${CARAS[n].includes(i) ? 'on' : ''}"></i>`).join('')}</div>`;
  },

  pintarTurno() {
    const v = UI.V, j = v.jugadores[v.turno], mio = UI.esMiTurno();
    const dados = UI.animando && UI.dadoTmp ? UI.dadoTmp : v.dados;
    let msg = '', acc = '';
    if (v.fase === 'fin') msg = 'La partida ha terminado.';
    else if (UI.animando) msg = 'Rodando los dados…';
    else if (!mio) msg = `Es el turno de <b>${esc(j.nombre)}</b>. Mientras esperas, repasa tus tarjetas y tus notas.`;
    else if (v.turnoFase === 'inicio') {
      msg = 'Es <b>tu turno</b>. Tira los dados y mueve tu ficha en <b>uno</b> de los dos tableros, o investiga la sala en la que estés.';
      acc = `<button class="btn ancho" onclick="UI.enviar({a:'dados'})">🎲 Tirar los dados</button>
             <button class="btn claro ancho" onclick="UI.enviar({a:'terminar'})">⏭ Pasar turno</button>`;
    } else if (v.turnoFase === 'mover') {
      msg = `Has sacado <b>${v.pasos}</b>. Toca una casilla iluminada o una sala resaltada, en el tablero de la oveja o en el del caballo.`;
      acc = `<button class="btn claro ancho" onclick="UI.enviar({a:'quedarse'})">⏭ Quedarme donde estoy</button>`;
    } else if (v.turnoFase === 'final') {
      const an = UI.animal(v.animalFinal);
      msg = `Estás en la Clínica del tablero ${an ? UI.de(an) : 'de ese animal'}. Puedes acusar desde allí (botón del tablero) o terminar el turno.`;
      acc = `<button class="btn claro ancho" onclick="UI.enviar({a:'terminar'})">⏭ Terminar turno</button>`;
    }
    $('panelTurno').innerHTML = `
      <div class="turno-de"><span class="avatar" style="--c:${j.color}">${esc(j.avatar)}</span>
        <div><small>Turno de</small><b>${esc(j.nombre)}${mio ? ' (¡tú!)' : ''}</b></div></div>
      ${dados ? `<div class="dados">${UI.dadoHtml(dados[0], UI.animando)}${UI.dadoHtml(dados[1], UI.animando)}</div>` : ''}
      <div class="msg">${msg}</div><div class="acciones">${acc}</div>`;
  },

  pintarRegistro() {
    $('registro').innerHTML = UI.V.registro.map(r => `<li>${esc(r.txt)}</li>`).join('');
  },

  /* ================= tableros ================= */
  pintarTableros() {
    const v = UI.V, yo = UI.yo(), m = C.mapa;
    const mover = UI.esMiTurno() && v.turnoFase === 'mover' && !UI.animando;
    $('tableros').innerHTML = C.animales.map(an => {
      const pos = yo.pos[an.id];
      const alc = mover && pos ? MOTOR.calcularAlcance(pos, v.pasos) : null;
      const sala = pos && pos.tipo === 'sala' ? SALAS[pos.id] : null;
      const fichas = filtro => v.jugadores.filter(j => j.pos[an.id] && filtro(j.pos[an.id]))
        .map(j => `<span class="ficha ${j.id === v.yoId ? 'mia' : ''} ${v.jugadores[v.turno].id === j.id && v.fase === 'juego' ? 'activa' : ''}" style="--c:${j.color}" title="${esc(j.nombre)}">${esc(j.avatar)}</span>`).join('');
      let h = '';
      for (let r = 0; r < m.filas; r++) for (let c = 0; c < m.columnas; c++) {
        const k = r + ',' + c;
        if (MOTOR.SALA_EN[k]) continue;
        const puerta = MOTOR.PUERTA[k], al = alc && alc.celdas.has(k);
        h += `<div class="celda ${puerta ? 'puerta' : ''} ${al ? 'alcance' : ''}" style="grid-row:${r + 1};grid-column:${c + 1}"
              ${puerta ? `data-ico="${esc(SALAS[puerta].icono)}"` : ''}
              ${al ? `data-accion="celda" data-animal="${an.id}" data-r="${r}" data-c="${c}" role="button" tabindex="0" aria-label="Moverse a esta casilla"` : ''}>
              ${fichas(p => p.tipo === 'celda' && p.r === r && p.c === c)}</div>`;
      }
      C.salas.forEach(s => {
        const [r, c, hh, ww] = s.rect, al = alc && alc.salas.has(s.id);
        const agotada = v.yo && v.yo.restantes[an.id][s.id] === 0;
        const fondo = s.imagen ? `background:linear-gradient(rgba(255,255,255,.62),rgba(255,255,255,.62)),url('${esc(s.imagen)}') center/cover, ${esc(s.color)};` : `background:${esc(s.color)};`;
        h += `<div class="sala ${al ? 'alcanzable' : ''} ${agotada ? 'agotada' : ''}" style="grid-row:${r + 1} / span ${hh};grid-column:${c + 1} / span ${ww};${fondo}"
              ${al ? `data-accion="sala" data-animal="${an.id}" data-id="${esc(s.id)}" role="button" tabindex="0" aria-label="Entrar en ${esc(s.nombre)}"` : ''}>
              ${s.pasadizo ? '<span class="pasadizo-m" title="Pasadizo secreto">🌀</span>' : ''}
              <span class="etiqueta"><span class="icono">${esc(s.icono)}</span><span class="nombre">${esc(s.nombre)}</span></span>
              <span class="fichas">${fichas(p => p.tipo === 'sala' && p.id === s.id)}</span></div>`;
      });

      // botones de acción de este tablero
      const mio = UI.esMiTurno(), resuelto = yo.resueltos[an.id];
      let btns = '';
      if (mio && sala) {
        if (v.turnoFase === 'inicio') {
          btns += `<button class="btn azul" data-btn="investigar" data-animal="${an.id}">🔎 Investigar aquí</button>`;
          if (sala.pasadizo) btns += `<button class="btn claro" data-btn="pasadizo" data-animal="${an.id}">🌀 Pasadizo: ${esc(SALAS[sala.pasadizo].icono)} ${esc(SALAS[sala.pasadizo].nombre)}</button>`;
        }
        if (sala.acusar && !resuelto && (v.turnoFase === 'inicio' || v.turnoFase === 'final'))
          btns += `<button class="btn rojo" data-btn="acusar" data-animal="${an.id}">⚖️ ¡Acusar por ${esc(an.nombre.toLowerCase())}!</button>`;
      }
      const donde = sala ? `Tu ficha: ${sala.icono} ${sala.nombre}` : 'Tu ficha está en el patio';
      return `<div class="col-animal-juego">
        <div class="cab-tablero"><h2>${esc(an.emoji)} Tablero ${esc(UI.de(an))}</h2>
          ${resuelto ? '<span class="resuelto">✅ Resuelto por ti</span>' : ''}<span class="donde">${esc(donde)}</span></div>
        <div class="tablero-marco ${an.id}"><div class="tablero" style="--cols:${m.columnas};--rows:${m.filas}" data-animal="${an.id}" role="application" aria-label="Tablero ${esc(UI.de(an))}">${h}</div></div>
        <div class="acciones-tablero">${btns}</div></div>`;
    }).join('');
  },

  clicTableros(e) {
    const t = e.target.closest('[data-accion],[data-btn]');
    if (!t || !UI.V) return;
    const animal = t.dataset.animal;
    if (t.dataset.accion === 'celda') UI.enviar({ a: 'mover', animal, destino: { tipo: 'celda', r: +t.dataset.r, c: +t.dataset.c } });
    else if (t.dataset.accion === 'sala') UI.enviar({ a: 'mover', animal, destino: { tipo: 'sala', id: t.dataset.id } });
    else if (t.dataset.btn === 'investigar') UI.enviar({ a: 'investigar', animal });
    else if (t.dataset.btn === 'pasadizo') UI.enviar({ a: 'pasadizo', animal });
    else if (t.dataset.btn === 'acusar') UI.abrirAcusacion(animal);
  },

  /* ================= zona privada: tarjetas y cuaderno ================= */
  claveNotas() { return 'mbc_notas_' + UI.V.codigo + '_' + UI.V.yoId; },
  leerNotas() { try { return JSON.parse(localStorage.getItem(UI.claveNotas()) || '{}'); } catch (e) { return {}; } },
  guardarNotas(n) { try { localStorage.setItem(UI.claveNotas(), JSON.stringify(n)); } catch (e) {} },

  construirPrivados() {       // se construye una sola vez para no borrar lo que se está escribiendo
    if (UI.privadosListos) return;
    UI.privadosListos = true;
    const notas = UI.leerNotas(); notas.t = notas.t || {}; notas.x = notas.x || {};
    const op = C.opciones;
    const origenes = op.origenes.map(id => ({ id, icono: SALAS[id].icono, texto: SALAS[id].nombre }));
    const grupo = (an, titulo, lista, cat) => `<div class="grupo"><span class="titulo">${titulo}</span>${lista.map(x => {
      const k = an + ':' + cat + ':' + x.id;
      return `<button class="opcion ${notas.t[k] ? 'tachada' : ''}" data-tachar="${esc(k)}">${esc(x.icono)} ${esc(x.texto)}</button>`;
    }).join('')}</div>`;
    $('privados').innerHTML = C.animales.map(an => `
      <div class="col-animal-juego privado">
        <h3>${esc(an.emoji)} ${esc(an.nombre)}</h3>
        <div class="panel"><h2>🗒️ Mis tarjetas</h2><ul class="archivo" id="arch-${an.id}"></ul></div>
        <div class="panel cuaderno"><h2>📓 Mi cuaderno</h2>
          <p class="ayuda">Toca una opción para tacharla. Solo tú lo ves.</p>
          ${grupo(an.id, 'Posibles causas', op.causas, 'causa')}${grupo(an.id, 'Posibles enzimas', op.enzimas, 'enzima')}${grupo(an.id, 'Posibles orígenes', origenes, 'origen')}
          <label class="campo" style="margin-top:8px"><span>✍️ Mis notas sobre ${esc(an.nombre.toLowerCase())}</span>
            <textarea class="notas-txt" id="txt-${an.id}" placeholder="Escribe aquí tus deducciones…">${esc(notas.x[an.id] || '')}</textarea></label>
        </div></div>`).join('');
    $('privados').onclick = e => {
      const b = e.target.closest('[data-tachar]'); if (!b) return;
      const n = UI.leerNotas(); n.t = n.t || {}; const k = b.dataset.tachar;
      n.t[k] = !n.t[k]; b.classList.toggle('tachada', !!n.t[k]); UI.guardarNotas(n); sonidos.clic();
    };
    C.animales.forEach(an => {
      $('txt-' + an.id).addEventListener('input', e => { const n = UI.leerNotas(); n.x = n.x || {}; n.x[an.id] = e.target.value; UI.guardarNotas(n); });
    });
    UI.ultimoArchivo = -1;
  },

  actualizarArchivos() {
    const arch = UI.V.yo ? UI.V.yo.archivo : [];
    if (arch.length === UI.ultimoArchivo) return;
    UI.ultimoArchivo = arch.length;
    C.animales.forEach(an => {
      const lista = arch.filter(a => a.animal === an.id);
      $('arch-' + an.id).innerHTML = lista.length ? lista.map(a => {
        const s = SALAS[a.sala], t = a.tarjeta;
        return `<li class="tarj-mini ${esc(t.tipo)}"><b>${esc(t.titulo)}</b><small>${esc(s.icono)} ${esc(s.nombre)}</small>${esc(t.texto)}
                ${t.lectura ? `<em>💡 ${esc(t.lectura)}</em>` : ''}</li>`;
      }).join('') : '<li class="ayuda">Todavía no has descubierto ninguna tarjeta en este tablero.</li>';
    });
  },

  /* ================= ventanas ================= */
  cerrarCapas() { $('capas').innerHTML = ''; },
  ventana(cab, claseCab, cuerpo, ancha) {
    const v = document.createElement('div');
    v.className = 'velo';
    v.innerHTML = `<div class="ventana ${ancha ? 'ancha' : ''}" role="dialog" aria-modal="true"><div class="cab ${claseCab}">${cab}</div><div class="cuerpo">${cuerpo}</div></div>`;
    $('capas').innerHTML = ''; $('capas').appendChild(v);
    const foco = v.querySelector('button.btn'); if (foco) foco.focus();
    return v;
  },

  verCaso() {
    UI.ventana('📋 ' + esc(C.titulo), 'azul',
      `<p style="margin-top:0;font-size:1.05rem">${esc(C.intro)}</p>
       ${C.animales.map(a => `<div class="animal" style="margin-bottom:10px"><img src="${esc(a.imagen)}" alt="" style="height:110px"><div><b>${esc(a.emoji)} ${esc(a.nombre)}</b><p>${esc(a.resumen)}</p></div></div>`).join('')}
       <div class="pie"><button class="btn" onclick="UI.cerrarCapas()">Cerrar</button></div>`);
  },

  /* ---- tarjeta recién descubierta (solo para quien la descubre) ---- */
  revisarCarta() {
    const cn = UI.V.yo && UI.V.yo.cartaNueva;
    if (!cn) { if (UI.cartaVista < 0) UI.cartaVista = 0; return; }       // partida nueva: aún no hay cartas
    if (UI.cartaVista < 0) { UI.cartaVista = cn.seq; sessionStorage.setItem('mbc_carta_' + UI.V.codigo, cn.seq); return; }   // primera conexión: no reabrir cartas antiguas
    if (cn.seq <= UI.cartaVista) return;
    UI.cartaVista = cn.seq; sessionStorage.setItem('mbc_carta_' + UI.V.codigo, cn.seq);
    const s = SALAS[cn.sala], an = UI.animal(cn.animal), t = cn.tarjeta;
    sonidos.carta();
    if (!t) {
      UI.ventana(`${esc(s.icono)} ${esc(s.nombre)} · ${esc(an.emoji)}`, '',
        `<p class="texto-tarjeta" style="text-align:center">Aquí ya no queda nada nuevo por descubrir en el tablero ${esc(UI.de(an))}.</p>
         <div class="pie"><button class="btn" onclick="UI.cerrarCapas()">Entendido</button></div>`);
      return;
    }
    UI.ventana(`${esc(s.icono)} ${esc(s.nombre)} · ${esc(an.emoji)} ${esc(an.nombre.toLowerCase())}`, t.tipo === 'ayuda' ? 'azul' : (t.tipo === 'descarte' ? 'verde' : 'amarillo'),
      `<div class="tarjeta-gira">
         <span class="insignia ${esc(t.tipo)}">${TIPOS_TARJ[t.tipo] || 'Tarjeta'}</span><span class="tag-privado">solo la ves tú</span>
         <h3 style="font-size:1.4rem;color:var(--marron);margin:8px 0">${esc(t.titulo)}</h3>
         ${t.imagen ? `<img class="foto" src="${esc(t.imagen)}" alt="">` : ''}
         <p class="texto-tarjeta">${esc(t.texto)}</p>
         ${t.lectura ? `<div class="lectura"><b>💡 Lectura:</b> ${esc(t.lectura)}</div>` : ''}
       </div><div class="pie"><button class="btn" onclick="UI.cerrarCapas()">📝 Apuntado</button></div>`);
  },

  /* ---- acusación por animal ---- */
  abrirAcusacion(animal) {
    const an = UI.animal(animal), notas = UI.leerNotas(), op = C.opciones;
    UI.acus = {};
    const origenes = op.origenes.map(id => ({ id, icono: SALAS[id].icono, texto: SALAS[id].nombre }));
    const grupo = (titulo, lista, cat) => `<div class="grupo-ac"><h4>${titulo}</h4><div class="elegibles">${lista.map(x =>
      `<button class="elegible ${(notas.t || {})[animal + ':' + cat + ':' + x.id] ? 'tachada' : ''}" data-cat="${cat}" data-id="${esc(x.id)}" onclick="UI.elegirAcus('${cat}','${esc(x.id)}')">${esc(x.icono)} ${esc(x.texto)}</button>`).join('')}</div></div>`;
    sonidos.clic();
    UI.ventana(`⚖️ Acusación: ${esc(an.emoji)} ${esc(an.nombre.toLowerCase())}`, 'rojo',
      `<p class="ayuda" style="margin-top:0">Elige una opción de cada grupo. Si aciertas, resuelves el caso ${esc(UI.de(an))}. Si fallas, <b>pierdes 2 turnos</b>.</p>
       ${grupo('¿Qué lo ha producido?', op.causas, 'causa')}${grupo('¿Qué enzima está bloqueada?', op.enzimas, 'enzima')}${grupo('¿Dónde se expuso?', origenes, 'origen')}
       <div class="pie"><button class="btn rojo" id="btnConfirmar" disabled onclick="UI.confirmarAcus('${animal}')">⚖️ ¡Acusar!</button>
       <button class="btn claro" onclick="UI.cerrarCapas()">Todavía no</button></div>`, true);
  },
  elegirAcus(cat, id) {
    UI.acus[cat] = id;
    document.querySelectorAll('.elegible[data-cat="' + cat + '"]').forEach(b => b.classList.toggle('on', b.dataset.id === id));
    $('btnConfirmar').disabled = !(UI.acus.causa && UI.acus.enzima && UI.acus.origen);
    sonidos.clic();
  },
  confirmarAcus(animal) { UI.cerrarCapas(); UI.enviar({ a: 'acusar', animal, sel: UI.acus }); },

  onResultado(res, animal) {
    const an = UI.animal(animal) || { nombre: 'el animal', emoji: '' };
    if (res === 'acierta') {
      sonidos.gana(); lluviaConfeti();
      UI.ventana('✅ ¡Correcto!', 'verde', `<div class="trofeo">🎯</div><p style="text-align:center;font-size:1.2rem">Has resuelto el caso <b>${esc(UI.de(an))}</b>. Ahora ve a por el otro.</p>
        <div class="pie"><button class="btn" onclick="UI.cerrarCapas()">¡A por el otro!</button></div>`);
    } else if (res === 'falla') {
      sonidos.mal();
      const v = UI.ventana('❌ Diagnóstico incorrecto', 'rojo', `<div class="trofeo" style="animation:none">😵</div>
        <p style="text-align:center;font-size:1.15rem">No era eso. Pierdes los próximos <b>2 turnos</b>. Aprovecha para repasar tus tarjetas.</p>
        <div class="pie"><button class="btn" onclick="UI.cerrarCapas()">Entendido</button></div>`);
      v.querySelector('.ventana').classList.add('sacudir');
    }
  },

  /* ---- final de la partida ---- */
  revisarFin() {
    const v = UI.V;
    if (v.fase !== 'fin' || UI.finMostrado) return;
    UI.finMostrado = true;
    const g = v.jugadores.find(j => j.id === v.ganador), yoGano = v.ganador === v.yoId, op = C.opciones;
    const nom = (lista, id) => { const x = lista.find(o => o.id === id); return x ? `${x.icono} ${x.texto}` : id; };
    const bloques = C.animales.map(a => {
      const s = v.final.solucion[a.id];
      return `<div class="solucion"><b>${esc(a.emoji)} ${esc(a.nombre)}</b><div class="fila">
        <span class="pieza">${esc(nom(op.causas, s.causa))}</span><span class="pieza">${esc(nom(op.enzimas, s.enzima))}</span>
        <span class="pieza">${esc(SALAS[s.origen].icono)} ${esc(SALAS[s.origen].nombre)}</span></div>
        <div class="explica">${esc(v.final.explicacion[a.id])}</div></div>`;
    }).join('');
    setTimeout(() => {
      UI.ventana(yoGano ? '🎉 ¡Has ganado!' : '🏁 Fin de la partida', yoGano ? 'verde' : 'azul',
        `<div class="trofeo">${yoGano ? '🏆' : '👏'}</div>
         <p style="text-align:center;font-size:1.3rem;margin:4px 0 12px">${yoGano ? '¡Enhorabuena, <b>' + esc(g.avatar + ' ' + g.nombre) + '</b>! Has resuelto los dos casos el primero.' : '<b>' + (g ? esc(g.avatar + ' ' + g.nombre) : '') + '</b> ha resuelto los dos casos el primero.'}</p>
         ${bloques}<div class="pie"><button class="btn" onclick="UI.salir(true)">🔁 Volver al inicio</button></div>`, true);
      if (yoGano) { sonidos.gana(); lluviaConfeti(); } else sonidos.turno();
    }, 700);
  }
});

function lluviaConfeti() {
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cols = ['#b8412f', '#4f8a3c', '#f4c542', '#2e7fb0', '#8a4fa8'];
  for (let i = 0; i < 70; i++) {
    const d = document.createElement('div');
    d.className = 'confeti';
    d.style.left = Math.random() * 100 + 'vw'; d.style.background = cols[i % cols.length];
    d.style.animationDuration = (2.2 + Math.random() * 2.2) + 's'; d.style.animationDelay = (Math.random() * 0.8) + 's';
    document.body.appendChild(d); setTimeout(() => d.remove(), 6000);
  }
}

window.addEventListener('DOMContentLoaded', () => { $('tableros').addEventListener('click', UI.clicTableros);
  $('tableros').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { const t = e.target.closest('[data-accion]'); if (t) { e.preventDefault(); UI.clicTableros(e); } } }); });

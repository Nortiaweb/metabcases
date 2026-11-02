/* Interfaz: pantallas de entrada, sala de espera, conexión y utilidades. La partida se pinta en ui-juego.js */
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const C = MOTOR.C;
const SALAS = MOTOR.SALAS;

/* ---------- sonido ---------- */
let sonidoOn = true, audioCtx = null;
function tono(freq, dur, inicio, tipo) {
  if (!sonidoOn) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = tipo || 'sine'; o.frequency.value = freq;
    const t = audioCtx.currentTime + (inicio || 0);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(t); o.stop(t + dur + 0.05);
  } catch (e) { /* sin audio no pasa nada */ }
}
const sonidos = {
  clic:  () => tono(660, 0.07, 0, 'triangle'),
  dado:  () => tono(300 + Math.random() * 300, 0.05, 0, 'square'),
  paso:  () => tono(440, 0.1, 0, 'triangle'),
  carta: () => { tono(523, 0.12, 0); tono(784, 0.18, 0.1); },
  turno: () => { tono(784, 0.12, 0); tono(988, 0.16, 0.12); },
  mal:   () => { tono(220, 0.25, 0, 'sawtooth'); tono(165, 0.35, 0.2, 'sawtooth'); },
  gana:  () => { [523, 659, 784, 1047].forEach((f, i) => tono(f, 0.22, i * 0.13, 'triangle')); }
};

/* ---------- estado de la interfaz ---------- */
const UI = {
  V: null,            // última vista recibida del anfitrión
  red: null,          // Anfitrion o Cliente
  rol: null,          // 'host' | 'cliente'
  perfil: null,       // { id, nombre, avatar }
  modo: 'crear',
  avatarIdx: 0,
  seqAnimada: null, cartaVista: 0, finMostrado: false, turnoPrevio: null, privadosListos: false,
  animando: false, dadoTmp: null
};

UI.alternarSonido = () => { sonidoOn = !sonidoOn; $('btnSonido').textContent = sonidoOn ? '🔊' : '🔇'; sonidos.clic(); };

UI.aviso = (msg, ms) => {
  document.querySelectorAll('.toast.simple').forEach(t => t.remove());
  const t = document.createElement('div');
  t.className = 'toast simple'; t.style.padding = '10px 20px'; t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), ms || 3500);
};

/* ---------- pantallas ---------- */
UI.mostrar = p => {
  ['Portada', 'Entrada', 'Lobby', 'Juego'].forEach(n => { $('p' + n).hidden = n.toLowerCase() !== p; });
  window.scrollTo(0, 0);
};

UI.ir = (p, modo) => {
  sonidos.clic();
  if (p === 'entrada') {
    UI.modo = modo; UI.prepararEntrada();
  }
  UI.mostrar(p);
};

/* ---------- entrada: nombre, personaje, código ---------- */
UI.prepararEntrada = () => {
  let prev = {};
  try { prev = JSON.parse(localStorage.getItem('mbc_perfil') || '{}'); } catch (e) {}
  if (prev.nombre && !$('entNombre').value) $('entNombre').value = prev.nombre;
  UI.avatarIdx = Math.max(0, AVATARES.indexOf(prev.avatar));
  UI.pintarAvatar();
  const crear = UI.modo === 'crear';
  $('entTitulo').textContent = crear ? '🚜 Crear partida' : '🔑 Unirme a una partida';
  $('entCodigoCampo').style.display = crear ? 'none' : 'block';
  $('entBoton').textContent = crear ? 'Crear la sala' : 'Entrar en la partida';
  $('entAyuda').textContent = crear
    ? 'Tu dispositivo hará de anfitrión: mantén esta pestaña abierta mientras dure la partida. Después te daremos un código para tus compañeros.'
    : 'Pídele el código de 4 letras al jugador que ha creado la partida.';
  const sala = new URLSearchParams(location.search).get('sala');
  if (!crear && sala && !$('entCodigo').value) $('entCodigo').value = RED.limpiarCodigo(sala);
  $('entError').style.display = 'none';
};
UI.pintarAvatar = () => { $('entAvatar').textContent = AVATARES[UI.avatarIdx % AVATARES.length]; $('entAvatar').style.setProperty('--c', COLORES[0]); };
UI.cambiarAvatar = () => { UI.avatarIdx = (UI.avatarIdx + 1) % AVATARES.length; UI.pintarAvatar(); sonidos.clic(); };

function idDeJugador() {
  let id = sessionStorage.getItem('mbc_id');
  if (!id) { id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4); sessionStorage.setItem('mbc_id', id); }
  return id;
}

UI.errorEntrada = msg => { const e = $('entError'); e.textContent = msg; e.style.display = 'block'; };

UI.entrar = async () => {
  const nombre = $('entNombre').value.trim();
  if (!nombre) { UI.errorEntrada('Escribe tu nombre.'); return; }
  const perfil = { id: idDeJugador(), nombre, avatar: AVATARES[UI.avatarIdx % AVATARES.length] };
  localStorage.setItem('mbc_perfil', JSON.stringify({ nombre, avatar: perfil.avatar }));
  const crear = UI.modo === 'crear';
  const codigo = crear ? RED.codigoNuevo() : RED.limpiarCodigo($('entCodigo').value);
  if (!crear && codigo.length !== 4) { UI.errorEntrada('El código tiene 4 letras.'); return; }
  const b = $('entBoton'); b.disabled = true; b.textContent = crear ? 'Creando la sala…' : 'Conectando…';
  $('entError').style.display = 'none';
  try {
    await UI.conectar(crear ? 'host' : 'cliente', codigo, perfil, false);
  } catch (e) {
    UI.errorEntrada(e.message || String(e));
    b.disabled = false; b.textContent = crear ? 'Crear la sala' : 'Entrar en la partida';
  }
};

/* ---------- conexión ---------- */
UI.conectar = async (rol, codigo, perfil, reanudar) => {
  UI.rol = rol; UI.perfil = perfil; UI.seqAnimada = null; UI.finMostrado = false; UI.turnoPrevio = null; UI.privadosListos = false;
  UI.cartaVista = parseInt(sessionStorage.getItem('mbc_carta_' + codigo) || '-1', 10);
  const cb = { codigo, perfil, onVista: UI.onVista, onError: m => UI.aviso(m), onResultado: UI.onResultado, onRed: UI.onRed };
  UI.red = rol === 'host' ? new RED.Anfitrion(cb) : new RED.Cliente(cb);
  await UI.red.iniciar(reanudar);
  sessionStorage.setItem('mbc_sesion', JSON.stringify({ rol, codigo, perfil }));
  if (rol === 'host') localStorage.setItem('mbc_host', JSON.stringify({ codigo, perfil }));
};

UI.enviar = msg => { if (UI.red) UI.red.enviar(msg); };

UI.onRed = estado => {
  const a = $('avisoRed');
  if (estado === 'ok') { a.hidden = true; return; }
  a.hidden = false;
  a.textContent = estado === 'perdida' ? '📡 Se ha perdido la conexión. Reintentando…'
                : estado === 'reconectando' ? '📡 Reconectando con el servicio de conexión…' : '📡 Conectando…';
};

UI.onVista = v => {
  UI.V = v;
  if (v.fase === 'lobby') { UI.mostrar('lobby'); UI.renderLobby(); }
  else { if ($('pJuego').hidden) UI.mostrar('juego'); UI.renderJuego(); }
};

/* ---------- sala de espera ---------- */
UI.renderLobby = () => {
  const v = UI.V;
  $('lobCodigo').textContent = v.codigo;
  $('lobJugadores').innerHTML = v.jugadores.map(j => `
    <li><span class="avatar" style="--c:${j.color}">${esc(j.avatar)}</span><b>${esc(j.nombre)}</b>
      ${j.id === v.yoId ? '<span class="chip-sala">tú</span>' : ''}
      <span class="etq">${j.anfitrion ? '👑 anfitrión · ' : ''}<span class="punto ${j.conectado ? '' : 'off'}"></span></span></li>`).join('');
  const n = v.jugadores.filter(j => j.conectado).length;
  $('lobAcciones').innerHTML = v.esAnfitrion
    ? `<button class="btn grande ancho" onclick="UI.enviar({a:'iniciar'})" ${n < 2 ? 'disabled' : ''}>🚜 Empezar la partida (${n}/${MOTOR.MAX_JUG})</button>
       ${n < 2 ? '<p class="ayuda espera" style="margin-top:10px">Hacen falta al menos 2 jugadores. Comparte el código o el enlace.</p>' : ''}`
    : '<p class="espera">⏳ Esperando a que el anfitrión empiece la partida…</p>';
};

UI.copiarEnlace = async () => {
  const url = location.origin + location.pathname + '?sala=' + UI.V.codigo;
  try { await navigator.clipboard.writeText(url); UI.aviso('Enlace copiado: ya puedes pegarlo en el chat.'); }
  catch (e) { window.prompt('Copia este enlace:', url); }
};

/* ---------- salir ---------- */
UI.salir = (sinPreguntar) => {
  const host = UI.rol === 'host';
  const fin = UI.V && UI.V.fase === 'fin';
  if (!sinPreguntar && !fin) {
    const msg = host ? 'Si sales, la partida se detiene para todos. Podrás reanudarla desde la portada si vuelves a abrir la web en este mismo navegador. ¿Salir?'
                     : '¿Salir de la partida? Tus compañeros seguirán jugando y se saltará tu turno.';
    if (!confirm(msg)) return;
  }
  UI.limpiarSesion(host && fin);
  location.href = location.pathname;      // vuelve a la portada con todo reiniciado
};

UI.limpiarSesion = borrarPartida => {
  try { UI.red && UI.red.cerrar(borrarPartida); } catch (e) {}
  sessionStorage.removeItem('mbc_sesion');
  if (borrarPartida) localStorage.removeItem('mbc_host');
};

/* ---------- arranque ---------- */
UI.arrancar = async () => {
  const params = new URLSearchParams(location.search);
  let sesion = null;
  try { sesion = JSON.parse(sessionStorage.getItem('mbc_sesion') || 'null'); } catch (e) {}
  if (sesion) {                               // recarga de la pestaña en mitad de la partida
    UI.mostrar('lobby'); $('lobCodigo').textContent = sesion.codigo;
    $('lobJugadores').innerHTML = '<li>Reconectando con la partida…</li>'; $('lobAcciones').innerHTML = '';
    try { await UI.conectar(sesion.rol, sesion.codigo, sesion.perfil, sesion.rol === 'host'); }
    catch (e) { UI.limpiarSesion(false); UI.mostrar('portada'); UI.aviso(e.message || String(e), 6000); }
    return;
  }
  if (params.get('sala')) { UI.modo = 'unir'; UI.prepararEntrada(); UI.mostrar('entrada'); return; }
  UI.mostrar('portada');
  UI.ofrecerReanudar();
};

UI.ofrecerReanudar = () => {                   // el anfitrión cerró la pestaña: puede retomar su partida guardada
  let h = null;
  try { h = JSON.parse(localStorage.getItem('mbc_host') || 'null'); } catch (e) {}
  if (!h || !localStorage.getItem(RED.claveGuardado(h.codigo))) return;
  let fase = 'juego';
  try { fase = JSON.parse(localStorage.getItem(RED.claveGuardado(h.codigo))).fase; } catch (e) {}
  if (fase === 'fin') return;
  const b = document.createElement('button');
  b.className = 'btn grande claro'; b.textContent = '↩ Reanudar mi partida (' + h.codigo + ')';
  b.onclick = async () => {
    b.disabled = true; b.textContent = 'Reanudando…';
    idDeJugadorFijar(h.perfil.id);
    try { await UI.conectar('host', h.codigo, h.perfil, true); }
    catch (e) { UI.aviso(e.message || String(e), 6000); b.disabled = false; b.textContent = '↩ Reanudar mi partida (' + h.codigo + ')'; }
  };
  document.querySelector('#pPortada .botones').appendChild(b);
};
function idDeJugadorFijar(id) { sessionStorage.setItem('mbc_id', id); }

window.addEventListener('DOMContentLoaded', () => UI.arrancar());

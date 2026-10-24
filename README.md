# Diagnóstico en la granja

Juego de mesa digital competitivo, tipo Cluedo, para estudiar bioquímica con casos clínicos de veterinaria.
Cada jugador entra desde su propio dispositivo, recorre la granja, descubre tarjetas con pistas y gana quien
resuelva antes los dos casos.

**Jugar:** <https://nortiaweb.github.io/metabcases/>

## Cómo se juega

1. Una persona pulsa **Crear partida** y recibe un código de 4 letras (y un enlace para invitar).
2. Los demás pulsan **Unirme con un código** (o abren el enlace) desde su móvil u ordenador.
3. Hay **dos tableros**, uno para la oveja y otro para el caballo: son dos casos distintos, cada uno con sus tarjetas y su cuaderno.
4. En tu turno tiras los dados y mueves tu ficha en **uno** de los dos tableros, o investigas la sala en la que estás.
5. Al entrar en una sala descubres una tarjeta que **solo ves tú**. Tus notas también son privadas.
6. Desde la **Clínica veterinaria** de cada tablero puedes acusar: qué lo ha producido, qué enzima está bloqueada y dónde se expuso. Si fallas, pierdes 2 turnos.
7. Gana quien resuelva primero los dos casos.

## Cómo está hecho

Web estática, sin servidor propio. Los dispositivos se conectan entre sí con [PeerJS](https://peerjs.com) (WebRTC).
El dispositivo de quien crea la partida hace de anfitrión, aplica las reglas y envía a cada jugador solo lo suyo.
Ver los límites de esta arquitectura en `SPECS.md` (apartado 11.1): el anfitrión podría hacer trampas, y algunas
redes de colegios o universidades bloquean la conexión directa.

## Ficheros

- `index.html`, `estilos.css`: página y estilos.
- `casos.js`: datos públicos del caso (plano, salas, opciones).
- `secretos.js`: tarjetas, soluciones y explicaciones (solo lo descarga el anfitrión).
- `motor.js`: reglas del juego. `red.js`: conexión. `ui.js` y `ui-juego.js`: pantallas.
- `SPECS.md`: **documento de especificaciones**, con preguntas abiertas para ir refinando.
- `CREDITOS.md`: autoría y licencias.
- `vendor/peerjs.min.js`: PeerJS 1.5.4 (licencia MIT).
- `img/`: imágenes.

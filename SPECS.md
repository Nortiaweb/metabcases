# Diagnóstico en la granja: documento de especificaciones

Documento vivo. Sirve para ir refinando el juego entre todos. Cada apartado indica su estado:

- **Decidido**: ya acordado.
- **Propuesta**: lo que hace la versión actual, pendiente de que lo confirmes o lo cambies.
- **Abierto**: pregunta sin resolver.

Versión del documento: 0.2 (24/10/2026). Versión del juego a la que corresponde: v0.3 (partida en red).

---

## 1. Idea general

Un juego de mesa digital competitivo tipo Cluedo para estudiar bioquímica con casos clínicos veterinarios.
Los jugadores son veterinarios que recorren una granja, entran en sus salas, recogen tarjetas con
pistas y ayudas, y tratan de descubrir antes que nadie qué les pasa a los animales del caso.

**Estado: Decidido**

- Ambientación: una granja. Los personajes de los jugadores son veterinarios.
- Es un juego **competitivo**: gana quien resuelva antes los casos.
- Cada jugador juega **desde su propio dispositivo**, todos en la misma partida.
- La información de cada jugador es **privada** (sus tarjetas y sus notas): nadie ve las de los demás.
- Se partirá de un caso inicial y se irán añadiendo casos con problemas distintos.
- Los casos están basados en los documentos de Bioquímica (EYFIII).
- No es un test: se avanza explorando, no contestando preguntas.

## 2. Objetivos y público

- Practicar el razonamiento metabólico (ciclo de Krebs, cadena respiratoria, inhibidores) de forma divertida.
- Público: estudiantes de Veterinaria, jugando en grupo desde sus móviles u ordenadores.
- Intuitivo: se entiende sin leer instrucciones.

**Estado: Propuesta**

## 3. Caso 1: "Dos animales con un problema energético"

Son **dos casos que ocurren a la vez pero son distintos**. Cada animal tiene su propio tablero, sus
propias tarjetas y su propio cuaderno de notas. Gana quien resuelva los dos antes.

| | Oveja | Caballo |
|---|---|---|
| Signos | Debilidad, temblores, respiración rápida, colapsos breves | Intolerancia al ejercicio, debilidad, marcha descoordinada, no camina hacia atrás |
| Exposición | Almacén agrícola cerrado | Cercado nuevo con leguminosas |
| Causa (tóxico) | Fluoroacetato | Malonato |
| Enzima bloqueada | Aconitasa | Succinato deshidrogenasa (complejo II) |
| Citrato / isocitrato | 520 % / 35 % | 105 % / 98 % |
| Succinato / fumarato | 45 % / 42 % | 410 % / 30 % |
| O₂ con piruvato + malato | 35 % | 78 % |
| O₂ con succinato | 92 % | 18 % |
| ATP tisular | 28 % | 32 % |

Datos comunes: glucemia y oxigenación arterial normales en los dos animales.

**Estado: Decidido** (datos del enunciado). Las pistas ambientales de las salas (huellas, testimonios del
ganadero, etc.) son licencia narrativa del juego y siempre deben ser coherentes con la solución.

## 4. Los tableros

### 4.1 Dos tableros, uno por animal

- Se muestran **a la vez**, uno al lado del otro (en el móvil, uno debajo del otro).
- Los dos tienen el mismo plano de granja, pero **cada uno tiene sus propias tarjetas**. Por ejemplo, la
  Clínica del tablero de la oveja da los análisis de la oveja y la del caballo, los del caballo.
- Cada jugador tiene **una ficha en cada tablero**, y las fichas de todos son visibles para todos.

**Estado: Decidido** (dos tableros al mismo nivel, con anotaciones distintas).

### 4.2 Plano (igual en los dos tableros)

18 columnas × 13 filas. Todo lo que no es sala es casilla de paso.

```
           columnas 0-17
fila  0    AAAAA..LLLL..EEEEE      A = Aprisco      L = Almacén agrícola   E = Establo
fila  1    AAAAA..LLLL..EEEEE
fila  2    AAAAA..LLLL..EEEEE
fila  3    AAAAA..LLLL..EEEEE
fila  4    ..................
fila  5    PPP....CCCC....RRR      P = Pozo         C = Clínica (laboratorio)  R = Archivo
fila  6    PPP....CCCC....RRR
fila  7    PPP....CCCC....RRR
fila  8    ..................
fila  9    HHHHH..VVVV..SSSSS      H = Casa del granjero   V = Cercado de leguminosas   S = Silo
fila 10    HHHHH..VVVV..SSSSS
fila 11    HHHHH..VVVV..SSSSS
fila 12    HHHHH..VVVV..SSSSS
```

**Estado: Propuesta**

### 4.3 Salas y tarjetas

| Sala | Para qué sirve | Tarjetas oveja | Tarjetas caballo |
|---|---|---|---|
| 🐑 Aprisco | Donde vive la oveja | 2 | 1 (descarte) |
| 🏚️ Almacén agrícola | Productos antiguos, cerrado habitualmente | 3 | 1 (descarte) |
| 🐴 Establo | Donde vive el caballo | 1 (descarte) | 3 |
| 💧 Pozo | Agua de la granja | 2 (descarte) | 2 (descarte) |
| 🔬 Clínica veterinaria | Laboratorio. Es la única sala donde se **acusa** | 6 | 6 |
| 📚 Archivo veterinario | Fichas de teoría (ayudas) | 4 | 4 |
| 🏠 Casa del granjero | Testimonios del ganadero | 2 | 2 |
| 🌾 Cercado de leguminosas | Pasto nuevo del caballo | 1 (descarte) | 3 |
| 🌽 Silo | Forraje almacenado | 2 (descarte) | 2 (descarte) |

Total: 47 tarjetas en el caso 1 (23 en el tablero de la oveja y 24 en el del caballo).

**Estado: Propuesta**

### 4.4 Puertas y pasadizos

- Cada sala tiene una o varias casillas puerta (marcadas con el icono de la sala).
- Pasadizos secretos entre salas de esquinas opuestas: Aprisco ↔ Silo y Establo ↔ Casa del granjero.

**Estado: Propuesta**

## 5. Turnos y movimiento

### 5.1 Desarrollo de un turno

1. El jugador del turno elige una acción:
   - 🎲 **Tirar los dados** (2 dados) y mover **una** de sus dos fichas: la del tablero de la oveja o la del del caballo.
   - 🔎 **Investigar aquí**, sin moverse (si una de sus fichas está dentro de una sala).
   - 🌀 **Usar el pasadizo**, sin tirar los dados.
   - ⚖️ **Acusar** (si una de sus fichas está en la Clínica y aún no ha resuelto ese caso).
   - ⏭ **Pasar el turno**.
2. Al tirar los dados se iluminan las casillas y salas alcanzables **en los dos tableros**; toca una para moverte.
3. Al entrar en una sala (o investigarla) descubre la siguiente tarjeta de esa sala **en ese tablero**.
4. Si termina el movimiento en la Clínica, puede acusar en ese mismo turno.
5. Pasa el siguiente jugador. Quien tiene penalización pierde su turno automáticamente.

**Estado: Propuesta**

### 5.2 Reglas de movimiento

- La suma de los dos dados es el máximo de pasos.
- Se mueve en vertical y horizontal, nunca en diagonal.
- No se atraviesan las salas: se entra por una puerta y entrar en la sala termina el movimiento.
- Entrar en una sala cuesta 1 paso extra; salir de una sala por una puerta también cuesta 1 paso.
- Las fichas pueden compartir casilla (no hay bloqueos entre jugadores).
- No hay turno extra por sacar dobles.

**Estado: Propuesta**

### 5.3 Posiciones iniciales

Cada jugador sale de una casilla de paso distinta (la misma en los dos tableros). Juega primero quien creó la partida.

**Estado: Propuesta**

## 6. Tarjetas

Las tarjetas son **privadas**: al descubrirla, solo la ve quien la descubre y se guarda en su archivo
personal. Los demás solo saben, por el registro público, que ese jugador descubrió una tarjeta en esa sala.

Cada jugador lleva su **propio mazo por sala y por tablero** y va descubriendo las tarjetas en orden, así
que todos pueden llegar a ver todo; la carrera está en quién explora y deduce más rápido.

| Tipo | Para qué sirve | Ejemplo |
|---|---|---|
| 🔎 **Pista** | Dato del caso | "Citrato 520 % e isocitrato 35 % (oveja)" |
| 🧰 **Ayuda** | Ficha de teoría que ayuda a interpretar las pistas | "Ficha: el ciclo de Krebs" |
| ✅ **Descarte** | Elimina una hipótesis | "El agua del pozo es potable" |
| ⚠️ **Imprevisto** | Evento que altera el turno | Aún no implementado |

Algunas pistas llevan una **lectura** (cómo interpretarlas), pensada para que el juego también enseñe.

**Estado: Decidido** (tarjetas privadas). Los imprevistos quedan para una versión posterior.

## 7. Diagnóstico (acusación)

- Se acusa **por animal**, por separado.
- Solo se puede acusar con la ficha en la **Clínica veterinaria del tablero de ese animal**.
- Cada acusación elige tres piezas: **causa**, **enzima bloqueada** y **origen** (la sala donde se expuso).
- **Acierto**: ese caso queda resuelto para ese jugador. Si ya tiene los dos, **gana la partida**.
- **Fallo**: pierde los **2 turnos** siguientes y puede volver a intentarlo después.
- Los demás jugadores ven en el registro quién ha resuelto un caso o ha fallado, pero no qué respondió.
- Resolver un caso no lo cierra para los demás: pueden resolverlo ellos también. Es una carrera por resolver los dos.
- Al terminar se muestra la solución y por qué: qué bloqueó cada tóxico y cómo se ve en los datos.

Opciones disponibles (se irán ampliando con los casos nuevos):

- Causas: fluoroacetato, malonato, cianuro, monóxido de carbono, arsenito, rotenona.
- Enzimas: aconitasa, succinato deshidrogenasa, complejo I, citocromo c oxidasa, piruvato deshidrogenasa, isocitrato deshidrogenasa.
- Orígenes: almacén, cercado, silo, pozo, establo, aprisco.

**Estado: Propuesta**. Con 6 × 6 × 6 = 216 combinaciones y 2 turnos de penalización, probar al azar es poco rentable,
pero es una pregunta abierta (apartado 13).

## 8. Cuaderno de notas privado

Cada jugador tiene, **por cada animal**, un cuaderno con las listas de causas, enzimas y orígenes para
tachar y un cuadro de texto libre. Se guarda solo en su dispositivo y **nunca se envía a nadie**.

**Estado: Decidido** (notas privadas y separadas por animal)

## 9. Jugadores y partida en red

- De 2 a 6 jugadores, cada uno desde su dispositivo (móvil, tablet u ordenador).
- Quien crea la partida obtiene un **código de 4 letras** y un enlace para invitar. Los demás entran con el código.
- Hay una **sala de espera**; el anfitrión pulsa "Empezar" cuando estén todos.
- Cada jugador elige su nombre y su personaje (veterinario). El color se asigna solo.
- Si alguien recarga la página o pierde la conexión, **vuelve a su sitio** con sus tarjetas y sus notas.
- Si un jugador se desconecta, se le salta el turno hasta que vuelva.

**Estado: Decidido**

## 10. Interfaz y estilo visual

- Estilo cálido de granja: crema, rojo granero, verde pasto y amarillo.
- Fuente redondeada, botones grandes con relieve, animaciones suaves (dados, tarjetas, confeti al ganar).
- Imágenes de dominio público (CC0) de Wikimedia Commons: granja, oveja, caballo, laboratorio, trébol, establo.
- Los dos tableros siempre visibles; debajo, la zona privada (tarjetas y cuaderno de cada animal).
- Registro público de lo que ocurre ("Ana saca 7", "Luis descubre una tarjeta en el Almacén").
- Aviso sonoro y visual cuando llega tu turno. Sonidos sencillos con botón de silencio.
- Funciona en el móvil (se comprobó que no hay desbordes). Respeta la opción de reducir animaciones.

**Estado: Propuesta**

## 11. Arquitectura técnica

- Web estática (HTML + CSS + JavaScript), sin instalar nada. Se publica en GitHub Pages:
  <https://nortiaweb.github.io/metabcases/>
- **Sin servidor propio.** Los dispositivos se conectan entre sí con WebRTC mediante PeerJS
  (`vendor/peerjs.min.js`, licencia MIT). El servicio gratuito de PeerJS solo ayuda a que se encuentren.
- **El dispositivo de quien crea la partida hace de anfitrión**: guarda el estado, aplica las reglas y envía a
  cada jugador únicamente lo que le corresponde. Su estado se guarda en el navegador, así que puede
  reanudar la partida si recarga o cierra la pestaña (desde el mismo navegador).
- Ficheros:
  - `index.html`, `estilos.css`: página y estilos.
  - `casos.js`: datos **públicos** del caso (plano, salas, opciones). Los carga todo el mundo.
  - `secretos.js`: tarjetas, soluciones y explicaciones. **Solo lo descarga el anfitrión.**
  - `motor.js`: reglas del juego y qué ve cada jugador (sin tocar pantalla ni red).
  - `red.js`: conexión entre dispositivos.
  - `ui.js`, `ui-juego.js`: pantallas.
  - `img/`: imágenes (créditos en `CREDITOS.md`).
- Añadir un caso nuevo = tocar `casos.js` y `secretos.js`, no el código del juego.

**Estado: Decidido**

### 11.1 Límites conocidos de esta arquitectura (importante)

1. **El anfitrión puede hacer trampas.** Como su dispositivo guarda la solución, quien crea la partida podría
   mirarla con las herramientas del navegador. Para jugar entre amigos o en clase es aceptable.
2. **La solución no está realmente protegida.** El juego no entrega `secretos.js` a los demás jugadores, y solo
   reciben las tarjetas que descubren (comprobado en las pruebas), pero ese fichero está publicado igual que el
   resto de la web y del repositorio. Quien sepa su dirección o abra el repositorio en GitHub puede leerlo. Sirve
   para jugar entre amigos o en clase con confianza, no para competir en serio. Opciones para endurecerlo (apartado 13):
   ofuscar el fichero (frena la curiosidad, no a quien quiera mirar), o un servidor propio con las soluciones privadas.
3. **Si el anfitrión cierra la pestaña, la partida se detiene** para todos hasta que vuelva y la reanude.
4. **Algunas redes bloquean la conexión directa** entre dispositivos (wifis de colegios, universidades o empresas).
   Con datos móviles o wifi doméstica suele funcionar. Si pasa, hace falta un servidor de relevo.
5. **Depende del servicio gratuito de PeerJS.** Si estuviera caído, no se podrían crear ni unir partidas.

## 12. Plan de versiones

| Versión | Contenido | Estado |
|---|---|---|
| v0.1 | Primera versión: turnos, pruebas en lista y acusación | Publicada |
| v0.2 | Tablero con salas, dados, tarjetas, caso conjunto (un dispositivo) | Publicada |
| v0.3 | Partida en red, dos tableros, tarjetas y notas privadas, penalización | Publicada |
| v0.4 | Tarjetas de imprevisto, equilibrio, más sonidos | Pendiente |
| v0.5 | Segundo caso con problemas distintos | Pendiente |
| v1.0 | Servidor propio (sin trampas posibles, sin depender del anfitrión) | Pendiente |

## 13. Preguntas abiertas

1. ¿Es suficiente la penalización de **2 turnos** por acusar mal, o prefieres eliminar al jugador, o aumentar la penalización?
2. ¿Los orígenes posibles deben ser **solo las salas con sentido** (almacén, cercado, silo, pozo, establo, aprisco) o todas?
3. ¿Quieres **tarjetas de imprevisto** (pierdes un turno, una vaca bloquea un pasillo, el ganadero te regala una pista…)?
4. ¿Hace falta un **límite de tiempo por turno** o por partida?
5. ¿Hace falta un **modo profesor** para ver el progreso de todos sin jugar?
6. ¿Es importante la **seguridad frente a trampas**? Hoy la solución es legible para quien la busque (apartado 11.1).
   Opciones: ofuscar `secretos.js` (rápido, frena solo lo casual) o un servidor propio con las soluciones privadas (más trabajo, coste y mantenimiento).
7. ¿Qué tipos de problema añadimos en los siguientes casos (otras rutas metabólicas, genética, patología…)?
8. ¿Hace falta una versión **imprimible** del tablero o de las tarjetas para jugar en físico?
9. ¿Quieres que los jugadores **intercambien información** entre sí (por ejemplo, vender o regalar una tarjeta)?

## 14. Registro de cambios

- 0.1 (24/10/2026): primera redacción con el tablero, los dados, las salas, las tarjetas y el caso conjunto.
- 0.2 (24/10/2026): partida en red desde varios dispositivos; dos tableros (uno por animal) con tarjetas y
  cuadernos distintos; tarjetas y notas privadas; acusación por animal con penalización de 2 turnos; límites
  conocidos de la arquitectura sin servidor.

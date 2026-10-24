# Diagnóstico en la granja: documento de especificaciones

Documento vivo. Sirve para ir refinando el juego entre todos. Cada apartado indica su estado:

- **Decidido**: ya acordado.
- **Propuesta**: lo que propone la versión actual, pendiente de que lo confirmes o lo cambies.
- **Abierto**: pregunta sin resolver.

Versión del documento: 0.1 (24/10/2026). Versión del juego a la que corresponde: v0.2 (tablero).

---

## 1. Idea general

Un juego de mesa digital tipo Cluedo para estudiar bioquímica con casos clínicos veterinarios.
Los jugadores son veterinarios que recorren una granja, entran en sus salas, recogen tarjetas con
pistas y ayudas, y tratan de descubrir antes que nadie qué les pasa a los animales del caso.

**Estado: Decidido**

- Ambientación: una granja. Los personajes de los jugadores son veterinarios.
- Se juega por turnos, todos en la misma partida y sobre el mismo tablero.
- Gana quien acierte primero el diagnóstico correcto.
- Se partirá de un caso inicial y se irán añadiendo casos con problemas distintos.
- Los casos están basados en los documentos de Bioquímica (EYFIII).
- No es un test: se avanza explorando, no contestando preguntas.

## 2. Objetivos y público

- Practicar el razonamiento metabólico (ciclo de Krebs, cadena respiratoria, inhibidores) de forma divertida.
- Público: estudiantes de Veterinaria. Se juega en grupo, en clase o en casa.
- El juego tiene que ser intuitivo: se entiende sin leer instrucciones.

**Estado: Propuesta**

## 3. Caso 1: "Dos animales con un problema energético"

Un único caso con dos pacientes que se resuelven a la vez (son un solo caso, no dos).

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

## 4. El tablero

### 4.1 Aspecto

Plano de la granja visto desde arriba, dividido en cuadrículas, como el Cluedo. Las salas son bloques
grandes con puertas, y el resto son pasillos y patios de casillas por donde se mueven los personajes.

**Estado: Decidido** (tablero con salas, cuadrículas y movimiento con dados).

### 4.2 Tamaño y plano

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

### 4.3 Salas

| Sala | Para qué sirve | Tarjetas |
|---|---|---|
| 🐑 Aprisco | Donde vive la oveja | 2 |
| 🏚️ Almacén agrícola | Productos antiguos, cerrado habitualmente | 3 |
| 🐴 Establo | Donde vive el caballo | 3 |
| 💧 Pozo | Agua de la granja | 2 |
| 🔬 Clínica veterinaria | Laboratorio con los análisis. Es la única sala donde se puede **acusar** | 6 |
| 📚 Archivo veterinario | Fichas de teoría (ayudas) | 4 |
| 🏠 Casa del granjero | Testimonios del ganadero | 3 |
| 🌾 Cercado de leguminosas | Pasto nuevo del caballo | 3 |
| 🌽 Silo | Forraje almacenado | 2 |

Total: 28 tarjetas en el caso 1.

**Estado: Propuesta**

### 4.4 Puertas y pasadizos

- Cada sala tiene una o varias casillas puerta (se marcan en el tablero).
- Pasadizos secretos entre salas de esquinas opuestas: Aprisco ↔ Silo y Establo ↔ Casa del granjero.

**Estado: Propuesta**

## 5. Turnos y movimiento

### 5.1 Desarrollo de un turno

1. El jugador del turno elige una de estas acciones:
   - 🎲 **Tirar los dados** y moverse.
   - 🔎 **Investigar aquí**, sin moverse (solo si ya está dentro de una sala).
   - 🚪 **Usar el pasadizo**, sin tirar los dados (solo si está en una sala con pasadizo).
   - ⚖️ **Acusar** (solo si está en la Clínica).
2. Si tira los dados, se iluminan las casillas y salas a las que llega. Toca una para moverse.
3. Al entrar en una sala (o investigar en ella) se descubre la siguiente tarjeta de esa sala.
4. Fin del turno. Pasa el siguiente jugador.

**Estado: Propuesta**

### 5.2 Reglas de movimiento

- Se tiran **2 dados** de 6 caras; el movimiento máximo es la suma.
- Se mueve en vertical y horizontal, nunca en diagonal.
- No se atraviesan las salas: se entra por una puerta y entrar en la sala termina el movimiento.
- Entrar en una sala cuesta 1 paso extra; salir de una sala por una puerta también cuesta 1 paso.
- Los personajes pueden compartir casilla (no hay bloqueos entre jugadores).
- No hay turno extra por sacar dobles.

**Estado: Propuesta**

### 5.3 Posiciones iniciales

Cada jugador sale de una casilla de paso distinta de los patios centrales. Sin orden especial: el
primer turno es del primer jugador de la lista.

**Estado: Propuesta**

## 6. Tarjetas

Al descubrirse, una tarjeta se muestra a todos los jugadores y queda guardada en el archivo de pistas
visible para todos. Cada sala tiene su mazo en un orden fijo; cada visita descubre la siguiente.

| Tipo | Para qué sirve | Ejemplo |
|---|---|---|
| 🔎 **Pista** | Dato del caso | "Citrato al 520 % en la oveja" |
| 🧰 **Ayuda** | Ficha de teoría que ayuda a interpretar las pistas | "Ficha: ciclo de Krebs" |
| ✅ **Descarte** | Elimina una hipótesis | "El agua del pozo es potable" |
| ⚠️ **Imprevisto** | Evento que altera el turno (pierdes turno, etc.) | Aún no implementado |

Algunas pistas llevan una **lectura** (cómo interpretarlas), pensada para que el juego también enseñe.

**Estado: Propuesta**. Las tarjetas de Imprevisto quedan para una versión posterior.

## 7. Diagnóstico (acusación)

- Solo se puede acusar estando en la **Clínica veterinaria**.
- La acusación completa 6 piezas: para **cada animal**, la **causa**, la **enzima bloqueada** y el **origen** (la sala donde se expuso).
- Si las 6 son correctas, ese jugador **gana**. Si falla alguna, **queda fuera** de la partida; los demás siguen.
- Si todos quedan fuera, se cierra el caso y se muestra la solución con su explicación.
- Al terminar se explica por qué: qué bloqueó cada tóxico y cómo se ve en los datos.

Opciones disponibles (se irán ampliando con los casos nuevos):

- Causas: fluoroacetato, malonato, cianuro, monóxido de carbono, arsenito, rotenona.
- Enzimas: aconitasa, succinato deshidrogenasa, complejo I, citocromo c oxidasa, piruvato deshidrogenasa, isocitrato deshidrogenasa.
- Orígenes: almacén, cercado, silo, pozo, establo.

**Estado: Propuesta**

## 8. Cuaderno de sospechas

Panel donde cada jugador va tachando causas, enzimas y orígenes descartados. Por ahora es compartido
por todos (se juega en un solo dispositivo).

**Estado: Propuesta**

## 9. Jugadores y modo de juego

- De 2 a 6 jugadores en la misma partida.
- Cada jugador tiene nombre, avatar (veterinario) y un color.
- **v1: un solo dispositivo**, pasándose el turno. Todas las pistas son públicas.
- **Futuro**: partida en red, cada jugador desde su dispositivo. Entonces se podrá hacer que las
  tarjetas sean privadas (solo las ve quien las descubre), lo que da más tensión y más deducción.

**Estado: Propuesta**. El multijugador en red necesita un servicio de servidor (Abierto).

## 10. Interfaz y estilo visual

- Estilo cálido de granja: crema, rojo granero, verde pasto y amarillo.
- Fuente redondeada, botones grandes con relieve, animaciones suaves (dados, tarjetas, confeti al ganar).
- Imágenes de dominio público (CC0) de Wikimedia Commons: granja, oveja, caballo, laboratorio, trébol, establo.
- Tarjetas que aparecen a pantalla completa con su imagen y un texto corto.
- Panel lateral con el turno, los dados, el archivo de pistas y el cuaderno.
- Debe funcionar bien en el móvil (tablero adaptable, botones grandes).
- Sonidos sencillos con botón de silencio.
- Respeta la opción de reducir animaciones del sistema.

**Estado: Propuesta**

## 11. Arquitectura técnica

- Web estática (HTML + CSS + JavaScript), sin instalar nada. Se publica en GitHub Pages:
  <https://nortiaweb.github.io/metabcases/>
- `index.html`: interfaz, tablero y reglas.
- `casos.js`: todos los datos del caso (plano, salas, tarjetas, solución). **Añadir un caso nuevo
  no obliga a tocar el código del juego.**
- `img/`: imágenes. Créditos y licencias en `CREDITOS.md`.

**Estado: Decidido**

## 12. Plan de versiones

| Versión | Contenido | Estado |
|---|---|---|
| v0.1 | Primera versión: turnos, pruebas en lista y acusación | Publicada |
| v0.2 | Tablero con salas, dados, movimiento, tarjetas, caso conjunto | En curso |
| v0.3 | Tarjetas de imprevisto, retoques de equilibrio, más sonidos | Pendiente |
| v0.4 | Segundo caso con problemas distintos | Pendiente |
| v1.0 | Partida en red con tarjetas privadas | Pendiente |

## 13. Preguntas abiertas

1. ¿Prefieres que quien falla la acusación quede **eliminado** o que **pierda varios turnos**?
2. ¿Las tarjetas deben ser **públicas** para todos o **privadas** de quien las descubre (más Cluedo)?
3. ¿Se acusa **solo en la Clínica** o desde cualquier sala?
4. ¿La acusación pide **6 piezas** (causa, enzima y origen de cada animal) o prefieres algo más sencillo?
5. ¿Añadimos **imprevistos** (pierdes un turno, una vaca bloquea un pasillo…)?
6. ¿Cuántos jugadores como máximo? ¿Hace falta una partida individual contra el ordenador?
7. ¿Quieres un **límite de turnos** o una cuenta atrás por partida?
8. ¿Qué tipos de problema añadimos en los siguientes casos (otras rutas metabólicas, genética, patología…)?
9. ¿Hace falta una versión **imprimible** del tablero o de las tarjetas para jugar en físico?

## 14. Registro de cambios

- 0.1 (24/10/2026): primera redacción con el tablero, los dados, las salas, las tarjetas y el caso conjunto.

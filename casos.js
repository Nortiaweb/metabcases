/*
 * Datos PÚBLICOS del caso (los cargan todos los jugadores).
 * Las tarjetas, la solución y las explicaciones están aparte, en secretos.js, y solo las
 * carga el dispositivo que crea la partida, para que los demás jugadores no las puedan leer.
 *
 * Cada animal tiene su propio tablero. Los dos tableros usan el mismo plano de granja,
 * pero cada uno tiene sus propias tarjetas y su propio cuaderno de notas.
 *
 * Estructura de un caso:
 *  - animales: los pacientes (un tablero por animal).
 *  - opciones: causas, enzimas y orígenes entre los que se elige al acusar.
 *  - mapa: tamaño del tablero y casillas de salida (una por jugador).
 *  - salas: posición [fila, columna, alto, ancho], puertas y, si procede, pasadizo y si se puede acusar.
 *    Todo lo que no está dentro de una sala es casilla de paso.
 */
const CASOS = [
  {
    id: "caso1",
    titulo: "Dos animales con un problema energético",
    granja: "Granja El Roble",
    intro:
      "A primera hora de la mañana llegan dos llamadas urgentes a la granja. Una oveja y un caballo " +
      "están muy débiles. En los dos, la glucosa y el oxígeno en sangre son normales, pero el ATP de " +
      "sus tejidos está muy bajo. Son dos casos que ocurren a la vez pero son distintos: cada animal " +
      "tiene su tablero, sus tarjetas y su cuaderno. Gana quien resuelva antes los dos.",

    animales: [
      {
        id: "oveja", nombre: "La oveja", emoji: "🐑", imagen: "img/oveja.jpg", color: "#6b4a37",
        resumen: "Marcada debilidad, temblores, respiración acelerada y episodios de colapso. " +
                 "Pudo entrar en una zona de almacenamiento normalmente cerrada."
      },
      {
        id: "caballo", nombre: "El caballo", emoji: "🐴", imagen: "img/caballo.jpg", color: "#4d5d3a",
        resumen: "Caballo de deporte con intolerancia progresiva al ejercicio, debilidad y marcha " +
                 "descoordinada. Pastaba desde hace semanas en un cercado nuevo."
      }
    ],

    opciones: {
      causas: [
        { id: "fluoroacetato", icono: "🐀", texto: "Fluoroacetato" },
        { id: "malonato", icono: "🌿", texto: "Malonato" },
        { id: "cianuro", icono: "☠️", texto: "Cianuro" },
        { id: "co", icono: "💨", texto: "Monóxido de carbono" },
        { id: "arsenito", icono: "⚗️", texto: "Arsenito" },
        { id: "rotenona", icono: "🐟", texto: "Rotenona" }
      ],
      enzimas: [
        { id: "aconitasa", icono: "⚙️", texto: "Aconitasa" },
        { id: "sdh", icono: "🔧", texto: "Succinato deshidrogenasa (complejo II)" },
        { id: "complejo1", icono: "🔋", texto: "Complejo I (NADH deshidrogenasa)" },
        { id: "citocromo", icono: "🫁", texto: "Citocromo c oxidasa (complejo IV)" },
        { id: "pdh", icono: "🧬", texto: "Piruvato deshidrogenasa" },
        { id: "idh", icono: "🔩", texto: "Isocitrato deshidrogenasa" }
      ],
      /* Los orígenes son ids de salas (deben existir en "salas") */
      origenes: ["almacen", "cercado", "silo", "pozo", "establo", "aprisco"]
    },

    mapa: {
      filas: 13,
      columnas: 18,
      /* Casillas de salida (fila, columna), una por jugador (máximo 6) */
      inicio: [[4, 5], [4, 6], [8, 5], [8, 6], [4, 11], [4, 12]]
    },

    /* rect = [fila, columna, alto, ancho]; puertas = casillas de paso desde las que se entra */
    salas: [
      { id: "aprisco", nombre: "Aprisco", icono: "🐑", color: "#e9dcc3", imagen: "img/oveja.jpg",
        rect: [0, 0, 4, 5], puertas: [[4, 2], [2, 5]], pasadizo: "silo" },
      { id: "almacen", nombre: "Almacén agrícola", icono: "🏚️", color: "#d9c9a8", imagen: "img/establo.jpg",
        rect: [0, 7, 4, 4], puertas: [[2, 6], [2, 11]] },
      { id: "establo", nombre: "Establo", icono: "🐴", color: "#e6d3bd", imagen: "img/caballo.jpg",
        rect: [0, 13, 4, 5], puertas: [[4, 15], [2, 12]], pasadizo: "casa" },
      { id: "pozo", nombre: "Pozo", icono: "💧", color: "#cfe6f2",
        rect: [5, 0, 3, 3], puertas: [[6, 3], [8, 1]] },
      { id: "clinica", nombre: "Clínica veterinaria", icono: "🔬", color: "#d8ecd0", imagen: "img/tubos.jpg",
        rect: [5, 7, 3, 4], puertas: [[4, 8], [8, 9], [6, 6], [6, 11]], acusar: true },
      { id: "archivo", nombre: "Archivo veterinario", icono: "📚", color: "#e4dcef", imagen: "img/microscopio.jpg",
        rect: [5, 15, 3, 3], puertas: [[6, 14], [8, 16]] },
      { id: "casa", nombre: "Casa del granjero", icono: "🏠", color: "#f2d9d3",
        rect: [9, 0, 4, 5], puertas: [[8, 2], [10, 5]], pasadizo: "establo" },
      { id: "cercado", nombre: "Cercado de leguminosas", icono: "🌾", color: "#d4e8b8", imagen: "img/trebol.jpg",
        rect: [9, 7, 4, 4], puertas: [[10, 6], [10, 11]] },
      { id: "silo", nombre: "Silo", icono: "🌽", color: "#f5e6a8",
        rect: [9, 13, 4, 5], puertas: [[8, 15], [10, 12]], pasadizo: "aprisco" }
    ]
  }
];

/*
 * Datos del caso del juego "Diagnóstico en la granja".
 * El juego lee todo de aquí: para añadir un caso nuevo se crea otro objeto en CASOS
 * (no hace falta tocar index.html). Todo lo que sale en pantalla viene de este fichero.
 *
 * Estructura de un caso:
 *  - animales: los pacientes del caso (son un caso conjunto, se resuelven a la vez).
 *  - opciones: listas de causas, enzimas y orígenes entre las que se elige al acusar.
 *  - solucion: la respuesta correcta para cada animal (ids de opciones).
 *  - mapa: tamaño del tablero y casillas de salida.
 *  - salas: cada sala con su posición [fila, columna, alto, ancho], puertas y tarjetas.
 *    Todo lo que no está dentro de una sala es casilla de paso.
 *  - explicacion: texto final para cada animal.
 *
 * Tipos de tarjeta: "pista", "ayuda" y "descarte". Opcional: imagen y lectura.
 */
const CASOS = [
  {
    id: "caso1",
    titulo: "Dos animales con un problema energético",
    granja: "Granja El Roble",
    intro:
      "A primera hora de la mañana llegan dos llamadas urgentes a la granja. Una oveja y un caballo " +
      "están muy débiles. En los dos, la glucosa y el oxígeno en sangre son normales, pero el ATP de " +
      "sus tejidos está muy bajo. Recorred la granja, reunid pistas y averiguad qué le pasa a cada animal.",

    animales: [
      {
        id: "oveja", nombre: "La oveja", emoji: "🐑", imagen: "img/oveja.jpg",
        resumen: "Marcada debilidad, temblores, respiración acelerada y episodios de colapso. " +
                 "Pudo entrar en una zona de almacenamiento normalmente cerrada."
      },
      {
        id: "caballo", nombre: "El caballo", emoji: "🐴", imagen: "img/caballo.jpg",
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
      origenes: ["almacen", "cercado", "silo", "pozo", "establo"]
    },

    solucion: {
      oveja:   { causa: "fluoroacetato", enzima: "aconitasa", origen: "almacen" },
      caballo: { causa: "malonato",      enzima: "sdh",       origen: "cercado" }
    },

    explicacion: {
      oveja:
        "La oveja se intoxicó con fluoroacetato, que se encontraba en un bote de raticida del almacén. " +
        "En el organismo se convierte en fluorocitrato, que bloquea la aconitasa. El citrato se acumula " +
        "(520 %), casi no se forma isocitrato (35 %) y el ciclo de Krebs se detiene, así que se produce muy " +
        "poco ATP. Como el bloqueo está antes del complejo II, la respiración con succinato sigue casi normal (92 %).",
      caballo:
        "El caballo se intoxicó con malonato, presente en las leguminosas silvestres del cercado nuevo. " +
        "El malonato se parece al succinato y bloquea la succinato deshidrogenasa (complejo II). El succinato " +
        "se acumula (410 %), el fumarato baja (30 %) y la respiración con succinato cae al 18 %. Con piruvato + " +
        "malato todavía se respira bastante (78 %), porque esa vía entra por el complejo I."
    },

    mapa: {
      filas: 13,
      columnas: 18,
      /* Casillas de salida (fila, columna), una por jugador */
      inicio: [[4, 5], [4, 6], [8, 5], [8, 6], [4, 11], [4, 12]]
    },

    /* rect = [fila, columna, alto, ancho]; puertas = casillas de paso desde las que se entra */
    salas: [
      {
        id: "aprisco", nombre: "Aprisco", icono: "🐑", color: "#e9dcc3", imagen: "img/oveja.jpg",
        rect: [0, 0, 4, 5], puertas: [[4, 2], [2, 5]], pasadizo: "silo",
        tarjetas: [
          { tipo: "pista", titulo: "Signos clínicos de la oveja", imagen: "img/oveja.jpg",
            texto: "Presenta marcada debilidad, temblores, respiración acelerada y episodios breves de decúbito y colapso." },
          { tipo: "pista", titulo: "Lana en la puerta",
            texto: "En el borde de una puerta trasera hay restos de lana. La oveja salió del aprisco y llegó hasta la zona de almacenes de la granja." }
        ]
      },
      {
        id: "almacen", nombre: "Almacén agrícola", icono: "🏚️", color: "#d9c9a8", imagen: "img/establo.jpg",
        rect: [0, 7, 4, 4], puertas: [[2, 6], [2, 11]],
        tarjetas: [
          { tipo: "pista", titulo: "Productos antiguos", imagen: "img/establo.jpg",
            texto: "Estantes con sacos y botes de viejas campañas agrícolas. Muchos no tienen etiqueta. Es una zona que normalmente está cerrada con llave." },
          { tipo: "pista", titulo: "Bote de raticida sin etiqueta",
            texto: "Un bote volcado y mordisqueado. El análisis de su contenido indica que es fluoroacetato de sodio, un veneno que bloquea el ciclo de Krebs.",
            lectura: "Esta es la exposición de la oveja: entró en el almacén y probó el contenido." },
          { tipo: "pista", titulo: "Huellas pequeñas",
            texto: "En el polvo del suelo hay huellas de pezuña pequeña (una oveja). No hay huellas grandes de caballo." }
        ]
      },
      {
        id: "establo", nombre: "Establo", icono: "🐴", color: "#e6d3bd", imagen: "img/caballo.jpg",
        rect: [0, 13, 4, 5], puertas: [[4, 15], [2, 12]], pasadizo: "casa",
        tarjetas: [
          { tipo: "pista", titulo: "Signos clínicos del caballo", imagen: "img/caballo.jpg",
            texto: "Intolerancia progresiva al ejercicio, debilidad, marcha descoordinada y dificultad para caminar hacia atrás." },
          { tipo: "pista", titulo: "Rendimiento deportivo",
            texto: "Hace semanas que el caballo rinde cada vez menos. No fue un cuadro brusco: empeoró poco a poco.",
            lectura: "Un deterioro progresivo apunta a una exposición repetida durante varios días o semanas." },
          { tipo: "descarte", titulo: "Pienso del comedero",
            texto: "El pienso del establo es el de siempre, de un lote en buen estado. Otros caballos que lo comen están perfectamente.",
            lectura: "El establo no es el origen del problema." }
        ]
      },
      {
        id: "pozo", nombre: "Pozo", icono: "💧", color: "#cfe6f2",
        rect: [5, 0, 3, 3], puertas: [[6, 3], [8, 1]],
        tarjetas: [
          { tipo: "descarte", titulo: "Análisis del agua",
            texto: "El agua del pozo es potable. No se detectan venenos ni contaminantes.",
            lectura: "Descartado: el pozo no es el origen." },
          { tipo: "descarte", titulo: "Los otros animales",
            texto: "Las vacas y las gallinas de la granja beben del pozo y están perfectamente sanas." }
        ]
      },
      {
        id: "clinica", nombre: "Clínica veterinaria", icono: "🔬", color: "#d8ecd0", imagen: "img/tubos.jpg",
        rect: [5, 7, 3, 4], puertas: [[4, 8], [8, 9], [6, 6], [6, 11]], acusar: true,
        tarjetas: [
          { tipo: "pista", titulo: "Análisis de sangre", imagen: "img/tubos.jpg",
            texto: "En los dos animales, la glucemia y la oxigenación arterial son normales.",
            lectura: "No falta combustible ni oxígeno: el fallo está dentro de la célula, en la mitocondria." },
          { tipo: "pista", titulo: "ATP tisular", imagen: "img/microscopio.jpg",
            texto: "Oveja: 28 % del valor normal. Caballo: 32 %.",
            lectura: "Los dos tienen un déficit grave de energía, pero con perfiles metabólicos distintos." },
          { tipo: "pista", titulo: "Citrato e isocitrato",
            texto: "Oveja: citrato 520 %, isocitrato 35 %. Caballo: citrato 105 %, isocitrato 98 %.",
            lectura: "En la oveja el citrato se acumula y no pasa a isocitrato. En el caballo este paso es normal." },
          { tipo: "pista", titulo: "Succinato y fumarato",
            texto: "Oveja: succinato 45 %, fumarato 42 %. Caballo: succinato 410 %, fumarato 30 %.",
            lectura: "En el caballo el succinato se acumula y no pasa a fumarato." },
          { tipo: "pista", titulo: "Respiración con piruvato + malato",
            texto: "Consumo de oxígeno: oveja 35 %, caballo 78 %.",
            lectura: "En la oveja la respiración que parte del ciclo de Krebs está muy frenada." },
          { tipo: "pista", titulo: "Respiración con succinato",
            texto: "Consumo de oxígeno: oveja 92 %, caballo 18 %.",
            lectura: "En el caballo la cadena respiratoria casi no puede usar el succinato." }
        ]
      },
      {
        id: "archivo", nombre: "Archivo veterinario", icono: "📚", color: "#e4dcef", imagen: "img/microscopio.jpg",
        rect: [5, 15, 3, 3], puertas: [[6, 14], [8, 16]],
        tarjetas: [
          { tipo: "ayuda", titulo: "Ficha: el ciclo de Krebs",
            texto: "El ciclo transforma el citrato en isocitrato (lo hace la aconitasa) y, más adelante, el succinato en fumarato (lo hace la succinato deshidrogenasa).",
            lectura: "Si una enzima se bloquea, lo que está justo antes se acumula y lo que viene después baja." },
          { tipo: "ayuda", titulo: "Ficha: la cadena respiratoria",
            texto: "El piruvato + malato alimentan el ciclo de Krebs y entregan sus electrones por el complejo I. El succinato entra directamente por el complejo II.",
            lectura: "Si con succinato se respira normal, el complejo II y lo que viene después funcionan." },
          { tipo: "ayuda", titulo: "Ficha: venenos del ciclo de Krebs",
            texto: "El fluoroacetato se convierte en fluorocitrato y bloquea la aconitasa. El malonato se parece al succinato y bloquea la succinato deshidrogenasa (complejo II)." },
          { tipo: "ayuda", titulo: "Ficha: otros venenos mitocondriales",
            texto: "El cianuro y el monóxido de carbono bloquean el complejo IV. La rotenona bloquea el complejo I. El arsenito inhibe la piruvato deshidrogenasa.",
            lectura: "Con estos venenos el patrón de metabolitos del ciclo de Krebs sería distinto al de nuestros animales." }
        ]
      },
      {
        id: "casa", nombre: "Casa del granjero", icono: "🏠", color: "#f2d9d3",
        rect: [9, 0, 4, 5], puertas: [[8, 2], [10, 5]], pasadizo: "establo",
        tarjetas: [
          { tipo: "pista", titulo: "Testimonio sobre la oveja",
            texto: "El ganadero no sabe si la oveja ha comido algo raro. Solo cuenta que el almacén suele estar cerrado y esta mañana tenía la puerta abierta." },
          { tipo: "pista", titulo: "Testimonio sobre el caballo",
            texto: "Hace unas semanas pasó al caballo a un cercado nuevo. Tiene muchas plantas silvestres y leguminosas que nadie ha identificado." },
          { tipo: "pista", titulo: "El cuaderno de la granja",
            texto: "Hace años se usaban raticidas en el almacén. Ya no se compran, pero nadie recuerda haberlos tirado todos." }
        ]
      },
      {
        id: "cercado", nombre: "Cercado de leguminosas", icono: "🌾", color: "#d4e8b8", imagen: "img/trebol.jpg",
        rect: [9, 7, 4, 4], puertas: [[10, 6], [10, 11]],
        tarjetas: [
          { tipo: "pista", titulo: "Plantas silvestres", imagen: "img/trebol.jpg",
            texto: "El cercado está lleno de leguminosas silvestres que no se corresponden con las especies de un pasto habitual." },
          { tipo: "pista", titulo: "Análisis de las plantas",
            texto: "Las muestras contienen malonato, un inhibidor de la succinato deshidrogenasa.",
            lectura: "Esta es la exposición del caballo: lleva semanas comiendo estas plantas." },
          { tipo: "descarte", titulo: "Sin rastro de la oveja",
            texto: "Ninguna oveja ha entrado en este cercado: la valla está intacta y no hay huellas de ovino." }
        ]
      },
      {
        id: "silo", nombre: "Silo", icono: "🌽", color: "#f5e6a8",
        rect: [9, 13, 4, 5], puertas: [[8, 15], [10, 12]], pasadizo: "aprisco",
        tarjetas: [
          { tipo: "descarte", titulo: "Estado del ensilado",
            texto: "El forraje almacenado está en buen estado: sin mohos, sin olores extraños y bien compactado.",
            lectura: "Descartado: el silo no es el origen." },
          { tipo: "descarte", titulo: "Análisis del forraje",
            texto: "No se detectan venenos. Otros animales de la granja que comen de este silo están perfectamente." }
        ]
      }
    ]
  }
];

/*
 * Datos de los casos del juego.
 * Para añadir un caso nuevo, copia un objeto de CASOS y cambia los textos.
 *
 * Cada caso tiene:
 *  - opciones: las tres listas de donde salen las respuestas (causa, enzima, lugar).
 *  - expedientes: cada paciente del caso, con su solución secreta, sus pruebas y su explicación.
 *
 * La solución (solucion) debe usar ids que existan en opciones.
 */
const CASOS = [
  {
    id: "caso1",
    titulo: "Caso 1: Un problema de energía",
    granja: "Granja El Roble",
    opciones: {
      causas: [
        { id: "fluoroacetato", texto: "Fluoroacetato" },
        { id: "malonato", texto: "Malonato" },
        { id: "cianuro", texto: "Cianuro" },
        { id: "co", texto: "Monóxido de carbono" },
        { id: "arsenito", texto: "Arsenito" }
      ],
      enzimas: [
        { id: "aconitasa", texto: "Aconitasa" },
        { id: "sdh", texto: "Succinato deshidrogenasa (complejo II)" },
        { id: "complejo1", texto: "Complejo I (NADH deshidrogenasa)" },
        { id: "citocromo", texto: "Citocromo c oxidasa (complejo IV)" },
        { id: "pdh", texto: "Piruvato deshidrogenasa" },
        { id: "idh", texto: "Isocitrato deshidrogenasa" }
      ],
      lugares: [
        { id: "almacen", texto: "Almacén de productos agrícolas" },
        { id: "cercado", texto: "Cercado nuevo con leguminosas" },
        { id: "silo", texto: "Silo de forraje" },
        { id: "establo", texto: "Establo" },
        { id: "pozo", texto: "Pozo de agua" }
      ]
    },
    expedientes: [
      {
        id: "1A",
        paciente: "Oveja adulta",
        intro:
          "Una oveja tiene debilidad, temblores, respiración rápida y desmayos breves. " +
          "Pudo entrar en un almacén cerrado con productos agrícolas antiguos. " +
          "Azúcar en sangre y oxígeno normales. El ATP de sus tejidos está al 28 %.",
        solucion: { causa: "fluoroacetato", enzima: "aconitasa", lugar: "almacen" },
        pruebas: [
          {
            id: "glucosa",
            nombre: "Glucemia y oxígeno en sangre",
            pista:
              "Glucosa y oxígeno normales. Al animal no le falta combustible ni aire. " +
              "El problema está dentro de la célula, en las mitocondrias (sus centrales de energía)."
          },
          {
            id: "citrato",
            nombre: "Ciclo de Krebs: citrato e isocitrato",
            pista:
              "El citrato está al 520 % (muy alto) y el isocitrato al 35 % (muy bajo). " +
              "El citrato se acumula porque no pasa a isocitrato. Ese paso lo hace la aconitasa: ahí hay un atasco."
          },
          {
            id: "succinato",
            nombre: "Succinato y fumarato",
            pista:
              "Succinato al 45 % y fumarato al 42 %, ambos bajos. " +
              "Son consecuencia de un atasco anterior, no la causa del problema."
          },
          {
            id: "resp_succ",
            nombre: "Respiración con succinato",
            pista:
              "Consumo de oxígeno con succinato al 92 %, casi normal. " +
              "La última parte de la cadena respiratoria funciona bien. El problema está antes."
          },
          {
            id: "resp_pyr",
            nombre: "Respiración con piruvato + malato",
            pista:
              "Consumo de oxígeno al 35 %. La respiración que arranca en el ciclo de Krebs está muy frenada."
          },
          {
            id: "almacen",
            nombre: "Revisión del almacén",
            pista:
              "Entre los productos antiguos aparece un bote de raticida sin etiqueta. " +
              "Su contenido es fluoroacetato de sodio, un veneno que bloquea el ciclo de Krebs."
          },
          {
            id: "historia",
            nombre: "Historia y declaración del ganadero",
            pista:
              "La oveja entró en una zona de almacenamiento que normalmente está cerrada. " +
              "No se sabe si comió algo."
          }
        ],
        explicacion:
          "El fluoroacetato se convierte en fluorocitrato, que bloquea la aconitasa. " +
          "El citrato se acumula (520 %) y no se forma isocitrato, así que el ciclo de Krebs se para " +
          "y se produce muy poco ATP. Como el bloqueo está antes del complejo II, la respiración con " +
          "succinato sigue normal (92 %)."
      },
      {
        id: "1B",
        paciente: "Caballo de deporte",
        intro:
          "Un caballo de deporte pierde resistencia cada vez más, está débil y camina descoordinado, " +
          "sobre todo hacia atrás. Pastó durante semanas en un cercado nuevo con muchas leguminosas. " +
          "Azúcar en sangre y oxígeno normales. El ATP de sus tejidos está al 32 %.",
        solucion: { causa: "malonato", enzima: "sdh", lugar: "cercado" },
        pruebas: [
          {
            id: "glucosa",
            nombre: "Glucemia y oxígeno en sangre",
            pista:
              "Glucosa y oxígeno normales. El problema está dentro de la mitocondria, no en la sangre."
          },
          {
            id: "citrato",
            nombre: "Ciclo de Krebs: citrato e isocitrato",
            pista:
              "Citrato al 105 % e isocitrato al 98 %: normales. El ciclo funciona bien hasta el succinato."
          },
          {
            id: "succinato",
            nombre: "Succinato y fumarato",
            pista:
              "Succinato al 410 % (muy alto) y fumarato al 30 % (muy bajo). " +
              "El succinato no se transforma en fumarato. Ese paso lo hace la succinato deshidrogenasa."
          },
          {
            id: "resp_succ",
            nombre: "Respiración con succinato",
            pista:
              "Consumo de oxígeno con succinato solo al 18 %. " +
              "La cadena respiratoria no puede usar el succinato: el bloqueo está en el complejo II."
          },
          {
            id: "resp_pyr",
            nombre: "Respiración con piruvato + malato",
            pista:
              "Consumo de oxígeno al 78 %. Algo bajo pero bastante activo: " +
              "la parte de la cadena que no depende del complejo II todavía trabaja."
          },
          {
            id: "cercado",
            nombre: "Revisión del cercado",
            pista:
              "Hay leguminosas silvestres sin identificar. Un análisis de estas plantas detecta malonato, " +
              "un inhibidor de la succinato deshidrogenasa."
          },
          {
            id: "historia",
            nombre: "Historia y declaración de la cuadra",
            pista:
              "En las semanas previas el caballo pastaba en un cercado nuevo con plantas silvestres. " +
              "Nadie sabía qué especies había."
          }
        ],
        explicacion:
          "El malonato es un inhibidor de la succinato deshidrogenasa (complejo II). El succinato se acumula " +
          "(410 %), el fumarato baja (30 %) y la respiración con succinato cae al 18 %. Como la respiración " +
          "con piruvato + malato aún conserva parte de su actividad (78 %), el bloqueo es parcial."
      }
    ]
  }
];

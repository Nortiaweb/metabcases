/*
 * Datos SECRETOS del caso: tarjetas, soluciones y explicaciones.
 * Solo los carga el dispositivo que crea la partida (los demás jugadores no descargan este
 * fichero). El anfitrión va enviando a cada jugador únicamente las tarjetas que descubre.
 *
 * tarjetas[animal][sala] = lista ordenada de tarjetas. Cada jugador las va descubriendo
 * en ese orden al entrar en la sala o investigarla.
 * Tipos: "pista", "ayuda" y "descarte". Opcional: imagen y lectura.
 */
const SECRETOS = {
  caso1: {
    solucion: {
      oveja:   { causa: "fluoroacetato", enzima: "aconitasa", origen: "almacen" },
      caballo: { causa: "malonato",      enzima: "sdh",       origen: "cercado" }
    },

    explicacion: {
      oveja:
        "La oveja se intoxicó con fluoroacetato, que estaba en un bote de raticida del almacén. " +
        "En el organismo se convierte en fluorocitrato, que bloquea la aconitasa. El citrato se acumula " +
        "(520 %), casi no se forma isocitrato (35 %) y el ciclo de Krebs se detiene, así que se produce muy " +
        "poco ATP. Como el bloqueo está antes del complejo II, la respiración con succinato sigue casi normal (92 %).",
      caballo:
        "El caballo se intoxicó con malonato, presente en las leguminosas silvestres del cercado nuevo. " +
        "El malonato se parece al succinato y bloquea la succinato deshidrogenasa (complejo II). El succinato " +
        "se acumula (410 %), el fumarato baja (30 %) y la respiración con succinato cae al 18 %. Con piruvato + " +
        "malato todavía se respira bastante (78 %), porque esa vía entra por el complejo I."
    },

    tarjetas: {
      /* ===================== TABLERO DE LA OVEJA ===================== */
      oveja: {
        aprisco: [
          { tipo: "pista", titulo: "Signos clínicos de la oveja", imagen: "img/oveja.jpg",
            texto: "Presenta marcada debilidad, temblores, respiración acelerada y episodios breves de decúbito y colapso." },
          { tipo: "pista", titulo: "Lana en la puerta",
            texto: "En el borde de una puerta trasera hay restos de lana. La oveja salió del aprisco y llegó hasta la zona de almacenes de la granja." }
        ],
        almacen: [
          { tipo: "pista", titulo: "Productos antiguos", imagen: "img/establo.jpg",
            texto: "Estantes con sacos y botes de viejas campañas agrícolas. Muchos no tienen etiqueta. Es una zona que normalmente está cerrada con llave." },
          { tipo: "pista", titulo: "Bote de raticida sin etiqueta",
            texto: "Un bote volcado y mordisqueado. El análisis de su contenido indica que es fluoroacetato de sodio, un veneno que bloquea el ciclo de Krebs.",
            lectura: "Esta es la exposición de la oveja: entró en el almacén y probó el contenido." },
          { tipo: "pista", titulo: "Huellas pequeñas",
            texto: "En el polvo del suelo hay huellas de pezuña pequeña (una oveja)." }
        ],
        establo: [
          { tipo: "descarte", titulo: "Lejos de la oveja",
            texto: "El establo es el del caballo. Las ovejas nunca entran en él y no hay ningún rastro de la oveja enferma.",
            lectura: "Descartado: el establo no es el origen en la oveja." }
        ],
        pozo: [
          { tipo: "descarte", titulo: "Análisis del agua",
            texto: "El agua del pozo es potable. No se detectan venenos ni contaminantes.",
            lectura: "Descartado: el pozo no es el origen." },
          { tipo: "descarte", titulo: "El resto del rebaño",
            texto: "Las demás ovejas beben del pozo y están perfectamente sanas." }
        ],
        clinica: [
          { tipo: "pista", titulo: "Análisis de sangre (oveja)", imagen: "img/tubos.jpg",
            texto: "Glucemia y oxigenación arterial normales.",
            lectura: "No falta combustible ni oxígeno: el fallo está dentro de la célula, en la mitocondria." },
          { tipo: "pista", titulo: "ATP tisular (oveja)", imagen: "img/microscopio.jpg",
            texto: "El ATP tisular de la oveja es el 28 % del valor normal.",
            lectura: "Déficit grave de energía." },
          { tipo: "pista", titulo: "Citrato e isocitrato (oveja)",
            texto: "Citrato 520 % e isocitrato 35 %.",
            lectura: "El citrato se acumula y casi no pasa a isocitrato: hay un atasco en ese paso." },
          { tipo: "pista", titulo: "Succinato y fumarato (oveja)",
            texto: "Succinato 45 % y fumarato 42 %.",
            lectura: "Los dos están bajos: son consecuencia de un atasco anterior." },
          { tipo: "pista", titulo: "Respiración con piruvato + malato (oveja)",
            texto: "Consumo de oxígeno al 35 %.",
            lectura: "La respiración que parte del ciclo de Krebs está muy frenada." },
          { tipo: "pista", titulo: "Respiración con succinato (oveja)",
            texto: "Consumo de oxígeno al 92 %.",
            lectura: "Casi normal: desde el complejo II en adelante, la cadena respiratoria funciona." }
        ],
        archivo: [
          { tipo: "ayuda", titulo: "Ficha: el ciclo de Krebs",
            texto: "El citrato se transforma en isocitrato gracias a la aconitasa, y más adelante el succinato en fumarato gracias a la succinato deshidrogenasa.",
            lectura: "Si una enzima se bloquea, lo que está justo antes se acumula y lo que viene después baja." },
          { tipo: "ayuda", titulo: "Ficha: la cadena respiratoria",
            texto: "El piruvato + malato alimentan el ciclo de Krebs y entregan sus electrones por el complejo I. El succinato entra directamente por el complejo II.",
            lectura: "Si con succinato se respira normal, el complejo II y todo lo que viene después funciona." },
          { tipo: "ayuda", titulo: "Ficha: venenos que actúan antes del complejo II",
            texto: "El fluoroacetato se convierte en fluorocitrato y bloquea la aconitasa. El arsenito inhibe la piruvato deshidrogenasa, a la entrada del ciclo." },
          { tipo: "ayuda", titulo: "Ficha: venenos de la cadena respiratoria",
            texto: "La rotenona bloquea el complejo I. El malonato bloquea el complejo II. El cianuro y el monóxido de carbono bloquean el complejo IV.",
            lectura: "Con estos venenos el patrón de metabolitos sería distinto al de la oveja." }
        ],
        casa: [
          { tipo: "pista", titulo: "Testimonio sobre la oveja",
            texto: "El ganadero no sabe si la oveja ha comido algo raro. Solo cuenta que el almacén suele estar cerrado y esta mañana tenía la puerta abierta." },
          { tipo: "pista", titulo: "El cuaderno de la granja",
            texto: "Hace años se usaban raticidas en el almacén. Ya no se compran, pero nadie recuerda haberlos tirado todos." }
        ],
        cercado: [
          { tipo: "descarte", titulo: "Sin rastro de la oveja",
            texto: "Ninguna oveja ha entrado en este cercado: la valla está intacta y no hay huellas de ovino.",
            lectura: "Descartado: el cercado no es el origen en la oveja." }
        ],
        silo: [
          { tipo: "descarte", titulo: "Estado del ensilado",
            texto: "El forraje almacenado está en buen estado: sin mohos, sin olores extraños y bien compactado.",
            lectura: "Descartado: el silo no es el origen." },
          { tipo: "descarte", titulo: "Análisis del forraje",
            texto: "No se detectan venenos. El resto del rebaño come de este silo y está perfectamente." }
        ]
      },

      /* ===================== TABLERO DEL CABALLO ===================== */
      caballo: {
        establo: [
          { tipo: "pista", titulo: "Signos clínicos del caballo", imagen: "img/caballo.jpg",
            texto: "Intolerancia progresiva al ejercicio, debilidad, marcha descoordinada y dificultad para caminar hacia atrás." },
          { tipo: "pista", titulo: "Rendimiento deportivo",
            texto: "Hace semanas que el caballo rinde cada vez menos. No fue un cuadro brusco: empeoró poco a poco.",
            lectura: "Un deterioro progresivo apunta a una exposición repetida durante varios días o semanas." },
          { tipo: "descarte", titulo: "Pienso del comedero",
            texto: "El pienso del establo es el de siempre, de un lote en buen estado. Otros caballos que lo comen están perfectamente.",
            lectura: "Descartado: el establo no es el origen." }
        ],
        cercado: [
          { tipo: "pista", titulo: "Plantas silvestres", imagen: "img/trebol.jpg",
            texto: "El cercado está lleno de leguminosas silvestres que no se corresponden con las especies de un pasto habitual." },
          { tipo: "pista", titulo: "Análisis de las plantas",
            texto: "Las muestras contienen malonato, un inhibidor de la succinato deshidrogenasa.",
            lectura: "Esta es la exposición del caballo: lleva semanas comiendo estas plantas." },
          { tipo: "pista", titulo: "Marcas de pastoreo",
            texto: "El pasto está muy mordisqueado y hay huellas de herradura por todo el cercado: el caballo ha pastado aquí a diario desde hace semanas." }
        ],
        almacen: [
          { tipo: "descarte", titulo: "Puerta cerrada",
            texto: "El almacén está cerrado con llave habitualmente y no hay huellas de herradura ni restos de que el caballo haya entrado.",
            lectura: "Descartado: el almacén no es el origen en el caballo." }
        ],
        aprisco: [
          { tipo: "descarte", titulo: "Lejos del caballo",
            texto: "El aprisco es de las ovejas. El caballo nunca ha pastado ni comido allí.",
            lectura: "Descartado: el aprisco no es el origen en el caballo." }
        ],
        pozo: [
          { tipo: "descarte", titulo: "Análisis del agua",
            texto: "El agua del pozo es potable. No se detectan venenos ni contaminantes.",
            lectura: "Descartado: el pozo no es el origen." },
          { tipo: "descarte", titulo: "Los otros caballos",
            texto: "Los demás caballos de la cuadra beben del pozo y están perfectamente sanos." }
        ],
        clinica: [
          { tipo: "pista", titulo: "Análisis de sangre (caballo)", imagen: "img/tubos.jpg",
            texto: "Glucemia y oxigenación arterial normales.",
            lectura: "No falta combustible ni oxígeno: el fallo está dentro de la célula, en la mitocondria." },
          { tipo: "pista", titulo: "ATP tisular (caballo)", imagen: "img/microscopio.jpg",
            texto: "El ATP tisular del caballo es el 32 % del valor normal.",
            lectura: "Déficit grave de energía." },
          { tipo: "pista", titulo: "Citrato e isocitrato (caballo)",
            texto: "Citrato 105 % e isocitrato 98 %.",
            lectura: "Normales: el ciclo de Krebs funciona bien en este tramo." },
          { tipo: "pista", titulo: "Succinato y fumarato (caballo)",
            texto: "Succinato 410 % y fumarato 30 %.",
            lectura: "El succinato se acumula y casi no pasa a fumarato: hay un atasco en ese paso." },
          { tipo: "pista", titulo: "Respiración con piruvato + malato (caballo)",
            texto: "Consumo de oxígeno al 78 %.",
            lectura: "Moderadamente bajo: esa vía todavía trabaja bastante." },
          { tipo: "pista", titulo: "Respiración con succinato (caballo)",
            texto: "Consumo de oxígeno al 18 %.",
            lectura: "La cadena respiratoria casi no puede usar el succinato." }
        ],
        archivo: [
          { tipo: "ayuda", titulo: "Ficha: el ciclo de Krebs",
            texto: "El citrato se transforma en isocitrato gracias a la aconitasa, y más adelante el succinato en fumarato gracias a la succinato deshidrogenasa.",
            lectura: "Si una enzima se bloquea, lo que está justo antes se acumula y lo que viene después baja." },
          { tipo: "ayuda", titulo: "Ficha: la cadena respiratoria",
            texto: "El piruvato + malato entregan sus electrones por el complejo I. El succinato entra directamente por el complejo II.",
            lectura: "Si con succinato se respira muy mal pero con piruvato + malato bastante bien, el problema está en el complejo II." },
          { tipo: "ayuda", titulo: "Ficha: venenos del complejo II",
            texto: "El malonato se parece mucho al succinato, así que ocupa su sitio en la succinato deshidrogenasa y la bloquea. Se encuentra en algunas leguminosas." },
          { tipo: "ayuda", titulo: "Ficha: venenos de otros pasos",
            texto: "El fluoroacetato bloquea la aconitasa. El arsenito inhibe la piruvato deshidrogenasa. La rotenona bloquea el complejo I. El cianuro y el monóxido de carbono bloquean el complejo IV.",
            lectura: "Con estos venenos el patrón de metabolitos sería distinto al del caballo." }
        ],
        casa: [
          { tipo: "pista", titulo: "Testimonio sobre el caballo",
            texto: "Hace unas semanas pasó al caballo a un cercado nuevo. Tiene muchas plantas silvestres y leguminosas que nadie ha identificado." },
          { tipo: "pista", titulo: "El cuaderno de la granja",
            texto: "En el cuaderno consta que el caballo cambió de pasto hace unas semanas y que no se ha cambiado su pienso ni su agua." }
        ],
        silo: [
          { tipo: "descarte", titulo: "Estado del ensilado",
            texto: "El forraje almacenado está en buen estado: sin mohos, sin olores extraños y bien compactado.",
            lectura: "Descartado: el silo no es el origen." },
          { tipo: "descarte", titulo: "Análisis del forraje",
            texto: "No se detectan venenos. Otros animales que comen de este silo están perfectamente." }
        ]
      }
    }
  }
};

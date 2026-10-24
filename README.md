# metabcases

Juego web tipo Cluedo para aprender metabolismo con casos clínicos de veterinaria.
Los veterinarios investigan una granja, piden pruebas para revelar pistas y gana quien
diagnostique antes el problema correcto.

## Cómo jugar

1. Abre `index.html` en el navegador.
2. Elige el caso y el paciente (expediente).
3. Escribid los nombres de los veterinarios (2 a 4).
4. En cada turno, el veterinario que toca:
   - pide una prueba para revelar una pista, o
   - propone un diagnóstico: causa, enzima bloqueada y lugar de exposición.
5. Si el diagnóstico es correcto, gana. Si no, queda fuera de la partida.

La partida es por turnos en un mismo dispositivo. Todavía no hay multijugador en red.

## Estructura

- `index.html`: la web del juego (pantallas, reglas y lógica).
- `casos.js`: los datos de los casos (opciones, pruebas, soluciones y explicaciones).

## Añadir un caso nuevo

En `casos.js`, copia un objeto de `CASOS` y cambia:

- `opciones`: las listas de causas, enzimas y lugares que aparecen en los desplegables.
- `expedientes`: cada paciente, con su `solucion` (los ids deben existir en `opciones`),
  sus `pruebas` (cada una con una `pista`) y su `explicacion` final.

## Publicar en GitHub Pages

En el repositorio: Settings → Pages → Source: `Deploy from a branch`, rama `main`, carpeta `/ (root)`.
La web quedará disponible en la URL que indique GitHub.

## Próximos pasos

- Más casos con problemas distintos (no solo metabólicos).
- Multijugador en red en tiempo real (requiere un servicio de servidor, por ejemplo Firebase).

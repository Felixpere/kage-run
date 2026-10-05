# Kage Run

Plataformero arcade en HTML5 Canvas (un solo archivo, sin dependencias).
Un ninja original que evoluciona en tres formas al recoger pergaminos de chakra.

## Jugar
El juego usa módulos ES, así que **hay que servirlo** (abrirlo con doble clic no
funciona, el navegador bloquea los módulos sobre `file://`):

```bash
python -m http.server 8000
```

Luego abre `http://127.0.0.1:8000`. Desde el móvil, `http://TU-IP:8000` con el
teléfono en la misma red.

## Controles
| Acción | Teclado | Táctil | Forma | Chakra |
|---|---|---|---|---|
| Mover (mantener = sprint) | ← → / A D | ◀ ▶ | todas | — |
| Saltar (soltar antes = corto) / doble salto | ↑ / W / Espacio | ▲ | todas / II+ | — |
| Patada (en el aire: voladora) | K | K | todas | — |
| Embestida de esfera (toque) / cargar chakra (mantener) | Z | ● | II+ | 25 |
| Clones | C | ✦ | II+ | 35 |
| Henge (5 s invencible) | H | H | II+ | 30 |
| Dash bajo | X | X | III+ | — |
| Invocación de la bestia | B | B | III+ | 60 |
| Haz dorado | V | ☄ | IV | 50 |
| Vidas infinitas on/off (pruebas) | I | — | — | — |
| Ocultar HUD | T | — | — | — |
| Silenciar | — | 🔊 (esquina) | — | — |

## Formas
1. **Novato** – correr, saltar, patada.
2. **Chakra** – doble salto, embestida de esfera, clones, henge.
3. **Sabio** – dash bajo, atraviesa enemigos, invocación.
4. **Dorado** – dash de fuego con quemaduras, haz dorado a pantalla completa.

Cada 3 pergaminos evolucionas (pose de carga + flash). Al recibir un golpe pierdes una forma; en Novato, una vida.

## Mundo
Nivel en 4 tramos. Onis (grupos de 2-3), kappas (pisar → caparazón → patear), serpientes en bambúes, morteros que disparan.
Destrucción: ladrillo en fragmentos, bambúes que se vuelcan o se parten, cráteres y montículos, quemaduras del dash dorado.
Bloques dorados: +chakra y onigiri (+1 vida).

## Estructura del código

```
index.html      solo marcado
css/style.css   estilos
js/state.js     constantes, DOM, entrada y el objeto G con todo el estado
js/level.js     mapa del nivel en ASCII y su conversión a objetos
js/sprites.js   pixel art dibujado en código y carga de los PNG
js/packfx.js    sprites del pack: monstruos, humo, explosión, chispa, aura
js/hero.js      motor de hojas de sprites del héroe (64x72, una fila por animación)
js/fx.js        partículas, polvo, destellos, hitstop y marcas del terreno
js/audio.js     música, efectos de sonido y silencio
js/game.js      reset, menú, fin de partida, evolución y daño
js/physics.js   step(): entrada, colisiones, poderes y enemigos
js/render.js    draw(): fondo, mundo, jugador y HUD
js/main.js      listeners de teclado y táctil, bucle principal
assets/         sprites sueltos y el pack Ninja Adventure
```

Mapa del nivel en `js/level.js`: `#` suelo, `=` piedra, `L` bloque dorado,
`N` bambú con serpiente, `M` mortero, `o` onis, `k` kappa, `P` bambú,
`S` pergamino, `b` arbusto, `T` torii.

Autor: Félix Pérez Acevedo.

## Créditos de arte
- Sapo gigante (invocación), onigiri, pergamino, kappa, serpiente, farolillo y los
  efectos de humo, explosión, chispa y aura: "Ninja Adventure" asset pack de
  pixel-boy (licencia CC0). También la música y los sonidos.
- Oni, caparazón, mortero, tiles, bambúes, fondo y HUD: dibujados en código para
  este proyecto.

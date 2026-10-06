# Kage Run

**▶ Jugar: https://felixpere.github.io/kage-run/**

Plataformero arcade de scroll lateral en HTML5 Canvas, sin dependencias ni
compilación. Un ninja recorre un reino de bambú y ladrillo recogiendo pergaminos
de chakra; cada tres pergaminos sube de forma y gana poderes, hasta que deja de
esquivar el escenario y empieza a demolerlo.

El nivel tiene cuatro tramos: el primero es un paseo, el último una demolición.
Al final espera el torii.

---

## Cómo jugar

### Teclado

| Acción | Teclas | Forma | Chakra |
|---|---|---|---|
| Mover (mantener = sprint) | `←` `→` · `A` `D` | todas | — |
| Saltar (soltar antes = salto corto) | `↑` · `W` · `Espacio` | todas | — |
| Doble salto | `↑` en el aire | II+ | — |
| Patada (en el aire, patada voladora) | `K` | todas | — |
| Esfera de chakra (toque) | `Z` | todas | 20 / 25 / 30 / 50 |
| Cargar chakra (mantener) | `Z` | todas | — |
| Clones (2 · 4 · 6 según forma) | `C` | II+ | 35 |
| Jutsu de distracción — 3 s | `J` | II+ | 30 |
| Dash bajo | `X` | III+ | — |
| Invocación del sapo | `B` | III+ | 60 |
| Haz dorado | `V` | IV | 50 |

### Táctil

En móvil o pantalla táctil aparecen los controles sobre el propio juego:
`◀` `▶` para moverse, `▲` saltar, `K` patada, `●` esfera, `✦` clones,
`J` distracción, `X` dash, `B` invocación, `☄` haz dorado y `⋯` para ocultar el HUD.

El botón `🔊` de la esquina silencia música y efectos; recuerda el estado.

### Modo pruebas

`1` `2` `3` `4` cambian de forma al instante y llenan el chakra · `I` vidas
infinitas · `T` oculta el HUD.

---

## Las cuatro formas

Se evoluciona cada **3 pergaminos** (hay 14 en el nivel). Al recibir un golpe se
pierde una forma; en Novato, una vida.

| | Forma | Qué desbloquea |
|---|---|---|
| **I** | **Novato** · naranja | Correr, saltar, patada |
| **II** | **Chakra** · cian | Doble salto, clones ×2, distracción |
| **III** | **Sabio** · haori rojo | Dash bajo, atraviesa enemigos, invocación del sapo, clones ×4 |
| **IV** | **Dorado** | Dash de fuego con quemaduras, haz dorado, clones ×6 |

### La esfera de chakra (`Z`)

No es una técnica fija: cambia por completo con la forma.

| Forma | Qué hace | Coste |
|---|---|---|
| **I** Novato | Esfera de 60 px en la mano. Parpadea y se deshace sola al segundo si no toca nada. Embestida de 2 tiles. | 20 |
| **II** Chakra | Esfera de 120 px en la mano. Embestida de 3 tiles; rompe estructuras y mata al contacto. | 25 |
| **III** Sabio | Se **lanza** como proyectil a 9 px/frame. Atraviesa enemigos y revienta la estructura que toca. Alcance 8 tiles. | 30 |
| **IV** Dorado | **Cuchilla de chakra**: sale girando con cuatro aspas, 16 tiles de alcance, atraviesa todo, y al acabar detona una expansión de 5 tiles que arrasa estructuras y enemigos. | 50 |

Con la barra de chakra **al 100 %** la técnica sale a **1,6× de tamaño y alcance gastando el doble**.

---

## El mundo

Nivel de 172 columnas en cuatro tramos. Onis en grupos de 2-3, kappas (pisar →
caparazón → patear para lanzarlo), serpientes escondidas en los bambúes y
morteros que disparan.

**Todo se rompe**: el ladrillo salta en fragmentos, los bambúes se vuelcan y
quedan tumbados como obstáculo o se parten por la mitad, los impactos fuertes
dejan cráteres y montículos, y el dash dorado deja quemaduras en el suelo. Los
enemigos aplastados se quedan en el suelo unos segundos.

Los bloques dorados dan chakra y onigiri (+1 vida).

---

## Ejecutar en local

El juego usa módulos ES, así que **hay que servirlo**: abrir `index.html` con
doble clic no funciona porque el navegador bloquea los módulos sobre `file://`.

```bash
git clone https://github.com/Felixpere/kage-run.git
cd kage-run
python -m http.server 8000
```

Luego abre <http://localhost:8000>. Desde el móvil, `http://TU-IP:8000` con el
teléfono en la misma red.

---

## Estructura

```
index.html      solo marcado
css/style.css   estilos
js/state.js     constantes, DOM, entrada y el objeto G con todo el estado
js/level.js     mapa del nivel en ASCII y su conversión a objetos
js/sprites.js   pixel art dibujado en código y carga de los PNG
js/packfx.js    sprites del pack: monstruos, humo, explosión, chispa, aura
js/hero.js      motor de hojas de sprites del héroe (64×72, una fila por animación)
js/sheet.js     detección automática de rejilla en hojas irregulares
js/summon.js    el sapo de la invocación
js/fx.js        partículas, polvo, destellos, hitstop y marcas del terreno
js/audio.js     música, efectos de sonido y silencio
js/game.js      reset, menú, fin de partida, evolución y daño
js/physics.js   step(): entrada, colisiones, poderes y enemigos
js/render.js    draw(): fondo, mundo, jugador y HUD
js/main.js      listeners de teclado y táctil, bucle principal
assets/         hojas del héroe, el sapo y lo que se usa del pack
```

El mapa del nivel está en `js/level.js` como arte ASCII: `#` suelo, `=` piedra,
`L` bloque dorado, `N` bambú con serpiente, `M` mortero, `o` onis, `k` kappa,
`P` bambú, `S` pergamino, `b` arbusto, `T` torii.

Detalle de las rejillas de sprites en [`assets/README.md`](assets/README.md).

---

## Créditos de arte

- **Héroe** (las cuatro formas y la distracción) y **sapo** de la invocación:
  hojas propias del proyecto, en `assets/`.
- **Onigiri, pergamino, kappa, serpiente, farolillo**, los efectos de **humo,
  explosión, chispa y aura**, la **música** y los **sonidos**: del asset pack
  [**Ninja Adventure**](https://pixel-boy.itch.io/ninja-adventure-asset-pack) de
  **pixel-boy**, licencia **CC0**. En el repositorio solo van los 25 ficheros que
  el juego usa de verdad; el pack completo (97 MB) no se publica.
- **Oni, caparazón, mortero, tiles, bambúes, fondo y HUD**: dibujados en código
  para este proyecto.

## Autor

**Félix Pérez Acevedo**

# Assets

## Héroe — hojas propias (Claude Design)

| Archivo | Uso |
|---|---|
| `kage_f1.png` | Forma 1 — Novato (naranja) |
| `kage_f2.png` | Forma 2 — Chakra (cian) |
| `kage_f3.png` | Forma 3 — Sabio (haori rojo) |
| `kage_f4.png` | Forma 4 — Dorado |
| `kage_distraccion.png` | Jutsu de distracción |

**Se usan las versiones 1x.** Las `*_3x.png` están guardadas al lado como original
de mayor resolución, pero el juego no las carga.

Rejilla real, medida sobre los PNG: celdas de **64 × 72 px**, 8 columnas, anclaje
en los pies a **y = 64** de la celda. `js/hero.js` escala ×1,40625 para que el
héroe mida 90 px, los mismos que su caja de colisión.

Las cuatro hojas de forma traen 12 filas con estos fotogramas, detectados
automáticamente al cargar:

```
idle 4 · correr 8 · sprint 6 · saltoSubida 2 · ápice 1 · caída 2
aterrizaje 3 · patada 4 · patadaVoladora 4 · embestida 6 · carga 4 · daño 2
```

`kage_distraccion.png` es una sola fila de 8 fotogramas; solo se usa su fila 0.

Nota: las hojas miden 880 px de alto (952 la de Dorado) en vez de los 864 que
darían 12 × 72, porque llevan una franja de texto al pie. Cae fuera de las filas
0-11, así que no se dibuja.

## Invocación — `sapo.png`

Hoja propia, 1152 × 656. **No tiene filas de altura uniforme**, así que
`js/sheet.js` la mide en vez de asumir una rejilla: celda de 192 px de ancho y
cuatro filas con su propia altura.

| Fila | Fotogramas | Alto | Qué es |
|---|---|---|---|
| 0 | 4 | 103 px | Reposo |
| 1 | 5 | 117 px | Avance |
| 2 | 6 | 106 px | Ataque |
| 3 | 6 | 160 px | Desaparición en humo |

Se escala ×2,91 para que la fila de reposo mida 300 px en pantalla. Sustituye al
sapo del pack, que queda de respaldo si el PNG no carga.

## Sprites sueltos (`sprites/`)

`frog_idle.png`, `frog_jump.png`, `frog_attack.png`, `onigiri.png` y `scroll.png`:
salieron del base64 que estaba incrustado en `index.html`. Los tres del sapo son
ahora solo respaldo.

## Pack externo (`pack/`)

"Ninja Adventure - Asset Pack" de **pixel-boy**, licencia **CC0**.

- `actor/boss/GiantFrog` — invocación de respaldo
- `actor/monster/KappaGreen`, `Snake`, `Bamboo`, `LanternRed` — enemigos y bloque de recompensa
- `FX` — humo, explosión, chispa, aura y partículas
- `items/Food`, `items/Scroll` — onigiri y pergaminos
- `Audio` — músicas, jingles y sonidos

`Bamboo` se copió pero no se usa: en este juego el bambú es una estructura del
escenario, no un enemigo.

**Aviso de tamaño**: `pack/Audio` ocupa 95 MB (41 músicas y 132 sonidos) y el juego
usa un puñado. Se puede recortar a lo que de verdad suena.

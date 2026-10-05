# Assets que faltan

## Hojas de sprites del héroe (Claude Design) — NO ENCONTRADAS

Buscado en `Descargas`, `Escritorio`, `Documentos` e `Imágenes`, recursivo, con los
patrones `kage*.png`, `Kage*Run*.png` y `*kage*.png`. **Cero resultados.**

Se revisaron además los 5.121 PNG de esas carpetas: todos son capturas de pantalla
(`Pictures\Screenshots\Captura de pantalla *.png`). No hay ninguna exportación de
Claude Design en disco.

Archivos esperados, según `CLAUDE.md`:

| Archivo | Para qué |
|---|---|
| `kage_f1.png` | Forma 1 — Novato (naranja) |
| `kage_f2.png` | Forma 2 — Chakra (cian) |
| `kage_f3.png` | Forma 3 — Sabio (haori rojo) |
| `kage_f4.png` | Forma 4 — Dorado |
| `kage_distraccion.png` | Jutsu de distracción |

Formato esperado: celdas de **64 × 72 px**, una fila por animación, en este orden:

```
0  idle            4 frames
1  correr          8
2  sprint          6
3  salto subida    2
4  ápice           1
5  caída           2
6  aterrizaje      3
7  patada          4
8  patada voladora 4
9  embestida       6
10 carga           4
11 daño            2
```

### Qué se ha hecho mientras tanto

`js/sprites.js` incluye un **motor de hojas de sprites completo y ya operativo**
(`SpriteSheet`), con detección automática del número de frames por fila contando
celdas no vacías, flip horizontal, anclaje en los pies y escalado a 90 px de alto.

El juego intenta cargar `assets/sprites/kage_f1.png` … `kage_f4.png` al arrancar.
**Si no existen, cae automáticamente al sprite dibujado en código** y escribe un aviso
en consola. No se rompe nada.

Para activarlas: exporta las hojas desde Claude Design y déjalas en
`assets/sprites/` con esos nombres exactos. No hay que tocar código.

## Assets del pack que sí están

Todo lo pedido de "Ninja Adventure - Asset Pack" (pixel-boy, CC0) se copió desde
`Descargas\Ninja Adventure - Asset Pack.zip` a `assets/pack/`:

- `actor/boss/GiantFrog` — invocación
- `actor/monster/KappaGreen`, `Snake`, `Bamboo`, `LanternRed` — enemigos
- `FX` — humo, aura, explosiones, partículas, slashes
- `items/Food` — onigiri y demás
- `items/Scroll` — pergaminos
- `Audio` — músicas, jingles y sonidos

**Aviso de tamaño**: `assets/pack/Audio` ocupa 95 MB (41 músicas y 132 sonidos), y el
juego usa un puñado. Si el repositorio empieza a pesar demasiado, se puede recortar a
lo que realmente se reproduce.

# Kage Run — contexto del proyecto

Plataformero 2D de scroll lateral en HTML5 Canvas, hecho por diversión por Félix Pérez Acevedo.
Inspirado en el *look & feel* de un reel ("ninja en un mundo de plataformas clásico"), pero **todo el arte y los personajes son originales**: nada de personajes, enemigos, bloques "?", tuberías con reborde, setas ni logotipos de franquicias existentes. Si algo se parece demasiado, cambiarlo.

## Estado actual
- Separado en `index.html` (3 KB, solo marcado), `css/style.css` y diez módulos ES en `js/`:
  `state.js` (constantes, DOM, entrada y el objeto `G` con todo el estado mutable),
  `level.js`, `sprites.js` (pixel art en código), `packfx.js` (sprites del pack),
  `hero.js` (motor de hojas del héroe), `fx.js`, `audio.js`, `game.js`, `physics.js`,
  `render.js`, `main.js`.
- Al ser módulos ES ya **no funciona con doble clic** (file://): hay que servir la carpeta.
  `python -m http.server 8000` y abrir `http://127.0.0.1:8000`.
- Assets en `assets/`: los sprites que iban en base64 como PNG sueltos, y el pack
  "Ninja Adventure" completo en `assets/pack/`.
- Botón de silencio en el marco; estado en `localStorage` bajo `kage.mute`.
- Handle de pruebas en consola: `window.KAGE` ({G, keys, pressed, released, step, draw,
  tick(n), heroReady, heroAnimFor, analyzeSheet, toggleMute, isMuted}). `tick(n)` avanza
  n fotogramas a mano, útil porque `requestAnimationFrame` se pausa con la pestaña oculta.

## Referencia medida del reel (brief DESIGN_BRIEF.md si existe)
- Viewport 2:1 (960×480), suelo al 85 % de la altura, héroe ≈ 17,5 % de la altura (90 px).
- Sin parallax real: una capa lenta al 0,85 y el resto a 1,0.
- Cámara: zona muerta horizontal 35–45 % del ancho; **sin seguimiento vertical**.
- Velocidades: caminar → correr (0,3 s) → sprint (1 s, ~0,6 pantallas/s). Frenada en seco. Caída más rápida que subida.
- Nada de flash blanco al 100 %: velo blanco al 55–65 % solo en impactos grandes.
- Congelados (hitstop) de 0,3–1,3 s en: evolucionar, invocar, media luna dorada, tumbar estructuras.
- Esfera de chakra: 120 px de diámetro (1,4× el héroe), dos espirales contrarias, 5 chispas.
- Enemigos aplastados persisten 4 s. Estructuras se vuelcan (quedan tumbadas) o se parten.
- Paleta: ver `:root` del CSS y constantes en `sprites`. Nada de negro puro; contorno #2B1A10.

## Controles
| Acción | Teclado | Táctil |
|---|---|---|
| Mover / sprint (mantener) | ← → / A D | ◀ ▶ |
| Saltar (variable) / doble salto (II+) | ↑ W Espacio | ▲ |
| Patada / patada voladora | K | K |
| Embestida de esfera (toque) / cargar chakra (mantener) — II+ | Z | ● |
| Clones — II+ | C | ✦ |
| Henge 5 s invencible — II+ | H | H |
| Jutsu de distracción — II+ | J | J |
| Dash bajo — III+ | X | X |
| Invocación (sapo gigante) — III+ | B | B |
| Media luna dorada — IV | V | ☄ |
| Pruebas: forma 1-4 / vidas ∞ / HUD | 1 2 3 4 / I / T | ⋯ |

## Formas (evolución cada 3 pergaminos; 14 en el nivel)
1. Novato (naranja) · 2. Chakra (cian) · 3. Sabio (haori rojo, atraviesa enemigos) · 4. Dorado.

## Mundo
Nivel ASCII en `L[]` (172 columnas, 4 tramos): `#` suelo, `=` ladrillo rompible, `L` bloque de recompensa (rombo cian; +chakra, onigiri, monedas), `P` estructura verde, `N` estructura con serpiente, `S` pergamino, `b` arbusto, `M` mortero, `o` onis (grupos), `k` kappa (caparazón pateable), `T` torii (meta).
Todo lo flotante debe dejar ≥ 2 tiles (96 px) de hueco bajo él: el héroe mide 90 px.

## Arte
- Fondos, tiles, estructuras y arbustos: dibujados en Canvas en alta resolución (curvas suaves).
- Héroe: hojas propias en `assets/kage_f1..f4.png` y `kage_distraccion.png` (celdas
  64×72, pies a y=64, 8 columnas). Detalle de filas y fotogramas en `assets/README.md`.
  El sprite dibujado en código sigue como respaldo si una hoja no carga.
- Invocación: `assets/sapo.png`, hoja propia de celda 192 px y filas de altura distinta,
  medida por `js/sheet.js`. El sapo del pack queda de respaldo.
- Enemigos y FX del pack "Ninja Adventure" de pixel-boy (CC0): kappa, serpiente,
  farolillo, humo, explosión, chispa y aura, más la música y los sonidos.
- **Parecido con la obra que inspira el proyecto**: el héroe (rubio, mono naranja, banda
  con cintas, esfera de chakra azul) y el sapo invocado con pipa son muy reconocibles.
  La regla de arriba dice que si algo se parece demasiado hay que cambiarlo; queda
  anotado como decisión pendiente de Félix, no se ha tocado el arte entregado.

## Pendientes (por prioridad)
1. Recortar `assets/pack/Audio` (95 MB) a lo que de verdad suena.
2. Quitar modo pruebas (teclas 1-4, vidas ∞, `window.KAGE`) para la versión final.
3. Revisar el parecido del héroe con el personaje que lo inspira (ver *Arte*).

## Hecho
- Separación en módulos y assets fuera del HTML.
- Motor de hojas de sprites del héroe (`js/hero.js`), con las cuatro hojas reales
  (`assets/kage_f1..f4.png`), la de distracción y el sapo propio (`assets/sapo.png`).
- Enemigos y efectos del pack: kappa, serpiente, farolillo, humo, explosión, chispa y aura.
  El oni y el caparazón siguen en código (el pack no trae equivalente y son arte propio).
- Música y sonidos del pack con botón de silencio.

## Estilo de trabajo
- Español, directo, sin relleno.
- Antes de cambiar el feel (velocidades, salto, cámara) comprobar contra las medidas de arriba.
- Félix es el autor: metadatos y README a su nombre.

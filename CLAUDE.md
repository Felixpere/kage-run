# Kage Run — contexto del proyecto

Plataformero 2D de scroll lateral en HTML5 Canvas, hecho por diversión por Félix Pérez Acevedo.
Inspirado en el *look & feel* de un reel ("ninja en un mundo de plataformas clásico"), pero **todo el arte y los personajes son originales**: nada de personajes, enemigos, bloques "?", tuberías con reborde, setas ni logotipos de franquicias existentes. Si algo se parece demasiado, cambiarlo.

## Estado actual
- Un solo archivo `index.html` (~60 KB) con CSS, JS y sprites incrustados (algunos en base64).
- Funciona abriéndolo en el navegador. Móvil: controles táctiles en pantalla.
- Pendiente inmediato: separar en `index.html`, `css/`, `js/` (`level.js`, `physics.js`, `render.js`, `fx.js`, `sprites.js`) y carpeta `assets/`.

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
- Héroe y enemigos: sprites pixel provisionales dibujados en código. **Sustituir** por la hoja de sprites del ninja generada en Claude Design (celdas 64×72, filas: idle 4, correr 8, sprint 6, salto 2/1/2, aterrizaje 3, patada 4, patada voladora 4, embestida 6, carga 4, daño 2) y sus variantes `kage_f1..f4.png` y `kage_distraccion.png`.
- Sapo gigante, onigiri y pergamino: pack "Ninja Adventure" de pixel-boy (CC0), carpeta del pack en disco. Reutilizar también sus FX (aura, explosión, humo), monstruos (kappa, serpiente, bambú, farolillo) y audio.

## Pendientes (por prioridad)
1. Separar el archivo en módulos y cargar sprites desde `assets/` en vez de base64.
2. Motor de hojas de sprites para el héroe (animaciones por fila, flip horizontal, anclaje en los pies).
3. Sustituir enemigos por sprites del pack (kappa, serpiente, bambú, farolillo) y FX del pack.
4. Música y sonidos del pack (salto, golpe, explosión, jingle de evolución).
5. Quitar modo pruebas (teclas 1-4, vidas ∞) para la versión final.

## Estilo de trabajo
- Español, directo, sin relleno.
- Antes de cambiar el feel (velocidades, salto, cámara) comprobar contra las medidas de arriba.
- Félix es el autor: metadatos y README a su nombre.

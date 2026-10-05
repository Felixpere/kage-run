# Kage Run

Plataformero arcade en HTML5 Canvas (un solo archivo, sin dependencias).
Un ninja original que evoluciona en tres formas al recoger pergaminos de chakra.

## Jugar
Abre `index.html` en cualquier navegador (doble clic). En móvil, sirve la carpeta
con un servidor local y ábrelo desde el teléfono:

```bash
python3 -m http.server 8000
# luego http://TU-IP:8000 en el móvil
```

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

## Estructura del código (`index.html`)
- `L` – mapa del nivel en ASCII (`#` suelo, `=` piedra, `L` bloque dorado, `N` bambú con serpiente, `M` mortero, `o` onis, `k` kappa, `P` bambú, `S` pergamino, `b` arbusto, `T` torii).
- `sprite()` – sprites pixel-art definidos como cadenas de texto.
- `step()` – física, input, poderes y colisiones.
- `draw()` – fondo parallax, mundo con zoom y HUD.

Autor: Félix Pérez Acevedo.

## Créditos de arte
- Sapo gigante (invocación), onigiri y pergamino: "Ninja Adventure" asset pack de pixel-boy (licencia CC0).
- Resto de sprites y tiles: dibujados en código para este proyecto.

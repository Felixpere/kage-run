"""Genera una hoja de sprites sintetica para probar js/hero.js.

Celdas 64x72, una fila por animacion. A proposito usa un numero de
fotogramas por fila DISTINTO del esperado en ANIMS, para comprobar que la
deteccion automatica manda sobre lo esperado.
"""
from PIL import Image, ImageDraw
import sys, pathlib

CELL_W, CELL_H, FEET_Y = 64, 72, 64
# esperado en ANIMS: 4,8,6,2,1,2,3,4,4,6,4,2
REALES = [3, 6, 5, 2, 1, 2, 2, 3, 4, 5, 4, 2]
COLORES = ["#E0701A", "#7FD8F0", "#D4503A", "#E8B64A", "#45CB50", "#FF5CC8",
           "#F2D45C", "#A85C34", "#2FA6D4", "#FFF6D0", "#9C4406", "#C72FA0"]

def main(out):
    cols = max(REALES)
    img = Image.new("RGBA", (cols * CELL_W, len(REALES) * CELL_H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    for r, n in enumerate(REALES):
        for c in range(n):
            x0, y0 = c * CELL_W, r * CELL_H
            # cuerpo: rectangulo que apoya justo en la linea de pies
            d.rectangle([x0 + 20, y0 + FEET_Y - 40, x0 + 44, y0 + FEET_Y - 1],
                        fill=COLORES[r % len(COLORES)])
            # cabeza
            d.ellipse([x0 + 22, y0 + FEET_Y - 56, x0 + 42, y0 + FEET_Y - 38],
                      fill="#EAC867")
            # marca de fotograma, para ver la animacion avanzar
            d.rectangle([x0 + 2, y0 + 2, x0 + 2 + c * 6 + 4, y0 + 8], fill="#FFFFFF")
    p = pathlib.Path(out); p.parent.mkdir(parents=True, exist_ok=True)
    img.save(p)
    print(f"{p}  {img.width}x{img.height}  filas={len(REALES)} frames={REALES}")

if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "tests/kage_test.png")

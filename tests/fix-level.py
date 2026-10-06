"""Corrige el mapa de js/level.js y verifica las invariantes.

    python tests/fix-level.py --check     solo informa
    python tests/fix-level.py             informa y aplica

Invariantes que impone:
  1. Todas las filas con la misma longitud.
  2. Ninguna estructura solida (P, N) ni enemigo (o, k, M) dentro de un hueco:
     un bambu de 3 tiles colgado sobre el vacio es un muro en mitad del salto.
  3. Cada hueco cruzable de un salto en forma Nino A VELOCIDAD DE CARRERA (no de
     sprint) con margen del 15 %: tras reaparecer o tras saltar un obstaculo no
     siempre da tiempo a coger sprint, y si el hueco solo se cruza a sprint el
     jugador se queda encerrado.
  4. Al menos 4 tiles seguidos de suelo libre antes de cada hueco (carrerilla).
  5. Todo lo flotante con >= 2 tiles (96 px) libres debajo, para que el heroe
     (90 px) quepa y pueda pisar la plataforma de abajo.
  6. Nada flotante (= o L) justo encima de un hueco: el arco del salto pasa por
     ahi, y chocar a media parabola deja la velocidad a cero y te tira al vacio.
  7. Ninguna pareja de estructuras solidas (P, N) pegadas: dos bambues juntos
     forman un muro de 102 px y 3 tiles de alto que exige un salto milimetrico.
  8. Hueco libre sobre los 3 tiles previos a cada estructura solida: un bloque
     flotante ahi corta el salto contra el techo (54 px en vez de 169) y deja al
     jugador encerrado contra el bambu, sin poder saltarlo ni retroceder.
"""
import re, sys, pathlib

RAIZ = pathlib.Path(__file__).resolve().parent.parent
TILE = 48
MARGEN = 0.85          # sobre el alcance a velocidad de carrera
CARRERILLA_MIN = 6     # 4 era insuficiente: al saltar un solido se aterriza en el borde
SOLIDOS = 'PN'         # ocupan espacio y frenan
ENEMIGOS = 'okM'
ESTRUCTURAS = SOLIDOS + ENEMIGOS + 'b'
FILA_OBST = 6          # fila donde viven estructuras y enemigos


def leer():
    src = (RAIZ / 'js' / 'level.js').read_text(encoding='utf-8')
    bloque = re.search(r'const L=\[(.*?)\];', src, re.S)
    filas = re.findall(r'"([^"]*)"', bloque.group(1))
    return src, filas


def alcance_nino():
    st = (RAIZ / 'js' / 'state.js').read_text(encoding='utf-8')
    m = re.search(r"\{name:'NOVATO',col:'[^']+',jump:(-?[\d.]+),walk:[\d.]+,run:([\d.]+),sprint:([\d.]+)\}", st)
    vy0, run = abs(float(m.group(1))), float(m.group(2))
    sube = vy0 / 0.5
    alto = vy0 * sube / 2
    baja = (2 * alto / 0.78) ** 0.5
    return (sube + baja) * run          # velocidad de carrera: el peor caso realista


def huecos_de(suelo):
    out, i, n = [], 0, len(suelo)
    while i < n:
        if suelo[i] == '.':
            j = i
            while j < n and suelo[j] == '.':
                j += 1
            out.append((i, j - 1, j - i))
            i = j
        else:
            i += 1
    return out


MARGEN_BORDE = 3       # tiles minimos entre una reubicacion y el borde de un hueco


def lejos_de_huecos(suelo, c):
    """Columna valida para reubicar: ni en la carrerilla previa a un hueco ni
    pegada al borde de salida."""
    for a, b, _ in huecos_de(suelo):
        if a - max(MARGEN_BORDE, CARRERILLA_MIN) <= c <= b + MARGEN_BORDE:
            return False
    return True


def carrerilla(suelo, obst, ini):
    n, c = 0, ini - 1
    while c >= 0 and suelo[c] == '#' and obst[c] not in SOLIDOS:
        n += 1
        c -= 1
    return n


def auditar(filas, alcance):
    COLS = len(filas[0])
    suelo, obst = filas[-2], filas[FILA_OBST]
    fallos = []

    if len(set(len(f) for f in filas)) != 1:
        fallos.append(('filas', f'longitudes distintas: {sorted(set(len(f) for f in filas))}'))

    maxi = alcance * MARGEN
    for a, b, n in huecos_de(suelo):
        dentro = [(c, obst[c]) for c in range(a, b + 1) if obst[c] in ESTRUCTURAS]
        if dentro:
            fallos.append(('estructura en hueco', f'cols {a}-{b}: {dentro}'))
        if n * TILE > maxi:
            fallos.append(('hueco ancho', f'cols {a}-{b}: {n} tiles ({n*TILE}px) > {maxi:.0f}px'))
        carr = carrerilla(suelo, obst, a)
        if carr < CARRERILLA_MIN:
            fallos.append(('carrerilla corta', f'antes de {a}: {carr} tiles'))
        encima = [(r, c) for r in range(len(filas) - 2) for c in range(a, b + 1)
                  if filas[r][c] in '=L']
        if encima:
            fallos.append(('bloque sobre hueco', f'cols {a}-{b}: {encima}'))

    for c in range(COLS - 1):
        if obst[c] in SOLIDOS and obst[c + 1] in SOLIDOS:
            fallos.append(('solidos pegados', f'cols {c} y {c+1}: {obst[c]!r}{obst[c+1]!r}'))

    # rows 1..4 taparian el salto; la 0 queda por encima del apice
    for c in range(COLS):
        if obst[c] not in SOLIDOS:
            continue
        for cc in range(max(0, c - 3), c + 1):
            for r in range(1, 5):
                if filas[r][cc] in '=L':
                    fallos.append(('techo sobre estructura',
                                   f'{filas[r][cc]!r} en fila {r} col {cc}, delante del {obst[c]!r} de col {c}'))

    for r in range(len(filas) - 2):
        for c in range(COLS):
            if filas[r][c] in '=L':
                for r2 in range(r + 1, len(filas)):
                    if filas[r2][c] in '=L#':
                        if r2 - r - 1 < 2:
                            fallos.append(('holgura', f'fila {r} col {c} con {r2-r-1} tile(s) sobre fila {r2}'))
                        break
    return fallos


def arreglar(filas, alcance):
    COLS = max(len(f) for f in filas)
    filas = [list(f.ljust(COLS, '.')) for f in filas]
    cambios = []

    # 1. suelo continuo al final (la fila corta dejaba un hueco de 1 tile)
    for fila in (filas[-2], filas[-1]):
        for c in range(COLS):
            if fila[c] == '.' and c >= COLS - 2:
                fila[c] = '#'
    cambios.append('filas igualadas a %d columnas y suelo cerrado al final' % COLS)

    suelo, obst = filas[-2], filas[FILA_OBST]

    # 2. estrechar los huecos que no se cruzan en forma Nino
    maxi = alcance * MARGEN
    for a, b, n in huecos_de(''.join(suelo)):
        if n * TILE <= maxi:
            continue
        objetivo = int(maxi // TILE)
        sobra = n - objetivo
        # se rellena por el lado izquierdo: deja la carrerilla mas larga
        for c in range(a, a + sobra):
            filas[-2][c] = '#'
            filas[-1][c] = '#'
        cambios.append(f'hueco cols {a}-{b}: {n} -> {objetivo} tiles (relleno {a}-{a+sobra-1})')

    suelo = filas[-2]

    # 3. sacar estructuras y enemigos de dentro de los huecos
    for a, b, n in huecos_de(''.join(suelo)):
        for c in range(a, b + 1):
            ch = obst[c]
            if ch not in ESTRUCTURAS:
                continue
            destino = None
            cad = ''.join(suelo)
            for d in range(1, 14):              # buscar sitio lejos de los bordes
                for cc in (c - d, c + d):
                    if (0 <= cc < COLS and suelo[cc] == '#' and obst[cc] == '.'
                            and lejos_de_huecos(cad, cc)):
                        destino = cc
                        break
                if destino is not None:
                    break
            obst[c] = '.'
            if destino is not None:
                obst[destino] = ch
                cambios.append(f"{ch!r} de col {c} (dentro del hueco) a col {destino}")
            else:
                cambios.append(f"{ch!r} de col {c} eliminado (sin sitio en tierra firme)")

    # 4. carrerilla: despejar solidos en los 4 tiles previos a cada hueco
    for a, b, n in huecos_de(''.join(suelo)):
        for c in range(max(0, a - CARRERILLA_MIN), a):
            if obst[c] in SOLIDOS:
                ch = obst[c]
                destino = None
                cad = ''.join(suelo)
                for d in range(1, 16):
                    cc = c - d
                    if (cc >= 0 and suelo[cc] == '#' and obst[cc] == '.'
                            and cc < a - CARRERILLA_MIN and lejos_de_huecos(cad, cc)):
                        destino = cc
                        break
                obst[c] = '.'
                if destino is not None:
                    obst[destino] = ch          # conserva el tipo: N lleva serpiente
                    cambios.append(f'{ch!r} de col {c} (carrerilla) a col {destino}')
                else:
                    cambios.append(f'{ch!r} de col {c} eliminado (carrerilla)')

    # 4b. quitar bloques flotantes que estan encima de un hueco
    for a, b, n in huecos_de(''.join(suelo)):
        for c in range(a, b + 1):
            for r in range(len(filas) - 2):
                if filas[r][c] not in '=L':
                    continue
                ch = filas[r][c]
                # se borra: reubicarlo al lado del hueco crearia un muro justo
                # en la zona de despegue o de aterrizaje, que es peor.
                filas[r][c] = '.'
                cambios.append(f'{ch!r} fila {r} col {c} eliminado (sobre el hueco)')

    # 4c. separar estructuras solidas pegadas
    cad = ''.join(suelo)
    for c in range(COLS - 1):
        if obst[c] in SOLIDOS and obst[c + 1] in SOLIDOS:
            ch = obst[c + 1]
            destino = None
            for d in range(2, 16):
                for cc in (c + 1 + d, c + 1 - d):
                    if (0 <= cc < COLS and suelo[cc] == '#' and obst[cc] == '.'
                            and lejos_de_huecos(cad, cc)
                            and (cc == 0 or obst[cc - 1] not in SOLIDOS)
                            and (cc + 1 >= COLS or obst[cc + 1] not in SOLIDOS)):
                        destino = cc
                        break
                if destino is not None:
                    break
            obst[c + 1] = '.'
            if destino is not None:
                obst[destino] = ch
                cambios.append(f'{ch!r} de col {c+1} (pegado a col {c}) a col {destino}')
            else:
                cambios.append(f'{ch!r} de col {c+1} eliminado (pegado a col {c})')

    # 4d. despejar el techo en los 3 tiles previos a cada estructura solida
    for c in range(COLS):
        if obst[c] not in SOLIDOS:
            continue
        for cc in range(max(0, c - 3), c + 1):
            for r in range(1, 5):
                if filas[r][cc] in '=L':
                    cambios.append(f'{filas[r][cc]!r} fila {r} col {cc} eliminado '
                                   f'(techo sobre el {obst[c]!r} de col {c})')
                    filas[r][cc] = '.'

    # 5. holgura vertical: subir el bloque de ARRIBA. Bajar el de abajo no vale:
    #    la fila 5 deja solo 48 px sobre el suelo y el heroe mide 90.
    for pasada in range(3):
        conflicto = False
        for r in range(len(filas) - 2):
            for c in range(COLS):
                if filas[r][c] not in '=L':
                    continue
                for r2 in range(r + 1, len(filas)):
                    if filas[r2][c] in '=L#':
                        if r2 - r - 1 < 2 and filas[r2][c] in '=L':
                            conflicto = True
                            if r - 1 >= 0 and filas[r - 1][c] == '.':
                                filas[r - 1][c] = filas[r][c]
                                filas[r][c] = '.'
                                cambios.append(f'bloque col {c}: fila {r} -> fila {r-1} (holgura)')
                            else:
                                cambios.append(f'bloque col {c} fila {r2} eliminado (holgura)')
                                filas[r2][c] = '.'
                        break
        if not conflicto:
            break
    return [''.join(f) for f in filas], cambios


def escribir(filas):
    ruta = RAIZ / 'js' / 'level.js'
    src = ruta.read_text(encoding='utf-8')
    nuevo = 'const L=[\n' + ''.join(f'"{f}",\n' for f in filas) + '];'
    src = re.sub(r'const L=\[.*?\];', lambda _: nuevo, src, count=1, flags=re.S)
    ruta.write_text(src, encoding='utf-8')


def main():
    solo_check = '--check' in sys.argv
    src, filas = leer()
    alcance = alcance_nino()
    print(f'alcance de un salto en forma Nino: {alcance:.0f}px ({alcance/TILE:.1f} tiles), '
          f'maximo admitido {alcance*MARGEN/TILE:.1f} tiles\n')

    fallos = auditar([f.ljust(max(len(x) for x in filas), '.') for f in filas], alcance)
    print(f'ANTES: {len(fallos)} problemas')
    for tipo, det in fallos:
        print(f'  [{tipo}] {det}')

    if solo_check:
        return 1 if fallos else 0

    filas2, cambios = arreglar(filas, alcance)
    print(f'\nCAMBIOS ({len(cambios)}):')
    for c in cambios:
        print('  ' + c)

    fallos2 = auditar(filas2, alcance)
    print(f'\nDESPUES: {len(fallos2)} problemas')
    for tipo, det in fallos2:
        print(f'  [{tipo}] {det}')

    if fallos2:
        print('\nno se escribe: quedan problemas')
        return 1
    escribir(filas2)
    print('\njs/level.js actualizado')
    return 0


if __name__ == '__main__':
    sys.exit(main())

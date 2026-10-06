"""Servidor estatico para desarrollo, sin cache.

    python tests/serve.py [puerto]      (por defecto 8000)

`python -m http.server` responde 304 y el navegador se queda con los modulos ES
viejos: editas un .js, recargas y sigues viendo el anterior. Esto manda
Cache-Control: no-store en todo, asi que cada recarga trae el codigo actual.
"""
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent


class SinCache(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def send_header(self, keyword, value):
        # SimpleHTTPRequestHandler manda su propio Last-Modified; sin el, el
        # navegador no tiene con que revalidar y no cachea.
        if keyword == 'Last-Modified':
            return
        super().send_header(keyword, value)

    def log_message(self, formato, *args):
        if '404' in (args[1] if len(args) > 1 else ''):
            super().log_message(formato, *args)


def main():
    puerto = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    handler = partial(SinCache, directory=str(RAIZ))
    with ThreadingHTTPServer(('127.0.0.1', puerto), handler) as s:
        print(f'Kage Run en http://127.0.0.1:{puerto}  (sin cache; Ctrl-C para parar)')
        s.serve_forever()


if __name__ == '__main__':
    main()

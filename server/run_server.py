import os
import sys
from dotenv import load_dotenv

# Force UTF-8 encoding for stdout/stderr on Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, '.env'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medicash_backend.settings')

from medicash_backend.wsgi import application
from waitress import serve

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print(f"Servidor Django MediCash iniciado en http://0.0.0.0:{port}")
    serve(application, host='0.0.0.0', port=port)

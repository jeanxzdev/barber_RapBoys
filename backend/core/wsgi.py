import os
import sys

# Parche crítico para MySQL
try:
    import pymysql
    pymysql.version_info = (2, 2, 1, "final", 0)
    pymysql.install_as_MySQLdb()
except ImportError:
    pass

from django.core.wsgi import get_wsgi_application

# Asegurar que la raíz del proyecto esté en el PATH
path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if path not in sys.path:
    sys.path.append(path)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Vercel necesita estas variables al nivel superior (sin indentación)
application = get_wsgi_application()
app = application

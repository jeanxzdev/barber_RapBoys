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

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Vercel necesita estas variables al nivel superior (sin indentación)
application = get_wsgi_application()
app = application

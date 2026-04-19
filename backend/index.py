import os
import sys

# Parche crítico para MySQL
try:
    import pymysql
    pymysql.version_info = (2, 2, 1, "final", 0)
    pymysql.install_as_MySQLdb()
except ImportError:
    pass

# Asegurar que la dirección actual esté en el PATH
path = os.path.dirname(os.path.abspath(__file__))
if path not in sys.path:
    sys.path.insert(0, path)

from core.wsgi import application
app = application

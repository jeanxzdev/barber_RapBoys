"""
Script to create a superuser remotely.
Run from the backend directory with DATABASE_URL set:
  set DATABASE_URL=mysql://user:pass@host:port/dbname
  python create_superuser.py
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Load .env if present
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

django.setup()

from apps.users.models import User

EMAIL = 'admin@rapboys.com'
PASSWORD = 'RapBoys2026'

try:
    user = User.objects.filter(email=EMAIL).first()
    if user:
        print(f'[INFO] User {EMAIL} already exists. Updating password and ensuring superuser status...')
        user.set_password(PASSWORD)
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.save()
        print(f'[OK] User {EMAIL} updated successfully as superuser.')
    else:
        user = User.objects.create_superuser(email=EMAIL, password=PASSWORD)
        print(f'[OK] Superuser {EMAIL} created successfully.')
except Exception as e:
    print(f'[ERROR] {e}')
    sys.exit(1)

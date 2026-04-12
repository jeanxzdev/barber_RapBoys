FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

EXPOSE 8000

# Comando para ejecutar migraciones, crear admin y arrancar el servidor en producción
CMD sh -c "python manage.py collectstatic --no-input && python manage.py migrate && python manage.py shell -c \"from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(email='admin@rapboys.com').exists() or User.objects.create_superuser('admin@rapboys.com', 'RapBoys2026')\" && gunicorn core.wsgi:application --bind 0.0.0.0:${PORT:-8000}"

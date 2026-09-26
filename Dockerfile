# Use the official Python image
FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=platformer_project.settings

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

EXPOSE 10000

CMD ["/bin/sh", "-c", "python manage.py migrate --noinput && exec gunicorn --bind 0.0.0.0:$PORT platformer_project.wsgi:application"]

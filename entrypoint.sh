#!/bin/sh

echo "📡 Waiting for DB on $DB_HOST:$DB_PORT..."

until nc -z "$DB_HOST" "$DB_PORT"; do
  echo "❌ DB is unavailable - sleeping"
  sleep 1
done

echo "✅ DB is up - executing command"

echo "Collecting static files..."
python manage.py collectstatic --noinput

set -e

python manage.py migrate

echo "
from django.contrib.auth import get_user_model
import os

User = get_user_model()
username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print(f'Created superuser {username}')
else:
    print(f'Superuser {username} already exists')
" | python manage.py shell

exec "$@"

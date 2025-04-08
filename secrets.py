import os

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-&dp1=kwuer4vt=7=y#a^oiu**r)2mdu9uk#-76o@f2k4#83l(!')

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'blog'),
        'USER': os.environ.get('DB_USER', 'postgres'),
        'PASSWORD': os.environ.get('DB_PASSWORD', 'postgres'),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}

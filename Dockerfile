FROM python:3.11-slim

RUN apt update && \
    apt install -y --no-install-recommends libpq-dev gcc curl gnupg2 lsb-release ca-certificates netcat-openbsd && \
    rm -rf /var/lib/apt/lists/*

RUN apt update && apt install -y --no-install-recommends \
    bash curl gnupg2 ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt install -y nodejs \
    && apt clean \
    && rm -rf /var/lib/apt/lists/*


WORKDIR /app

COPY . /app/

RUN pip install --no-cache-dir -r requirements.txt

RUN npm install

WORKDIR /app
RUN npm run build

WORKDIR /app

EXPOSE 8000

CMD ["gunicorn", "blog_project.wsgi:application", "--bind", "0.0.0.0:8000"]

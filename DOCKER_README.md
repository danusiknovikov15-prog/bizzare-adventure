# Docker Development Guide

## Установка Docker

### Windows

1. Скачайте Docker Desktop для Windows с официального сайта:
   https://www.docker.com/products/docker-desktop/

2. Запустите установщик и следуйте инструкциям

3. После установки перезагрузите компьютер

4. Запустите Docker Desktop

5. Проверьте установку:
   ```bash
   docker --version
   docker-compose --version
   ```

### Linux (Ubuntu/Debian)

```bash
# Обновите список пакетов
sudo apt update

# Установите необходимые пакеты
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Добавьте официальный GPG ключ Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Добавьте репозиторий Docker
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Установите Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Добавьте пользователя в группу docker
sudo usermod -aG docker $USER

# Перезагрузите систему или выполните
newgrp docker

# Проверьте установку
docker --version
docker compose version
```

### macOS

1. Скачайте Docker Desktop для macOS:
   https://www.docker.com/products/docker-desktop/

2. Установите приложение перетаскиванием в папку Applications

3. Запустите Docker Desktop из Applications

4. Проверьте установку:
   ```bash
   docker --version
   docker-compose --version
   ```

## Запуск проекта с Docker

### Вариант 1: Использование Docker Compose (рекомендуется)

```bash
# Сборка и запуск контейнера
docker-compose up -d --build

# Проверка логов
docker-compose logs -f

# Остановка контейнера
docker-compose down
```

Приложение будет доступно на http://localhost:8000

### Вариант 2: Использование Docker напрямую

```bash
# Сборка образа
docker build -t platformer-game .

# Запуск контейнера
docker run -d -p 8000:8000 --name platformer-game platformer-game

# Проверка логов
docker logs -f platformer-game

# Остановка контейнера
docker stop platformer-game

# Удаление контейнера
docker rm platformer-game
```

## Полезные команды

```bash
# Просмотр запущенных контейнеров
docker ps

# Войти в контейнер
docker exec -it platformer-game /bin/bash

# Пересобрать образ
docker-compose up -d --build --force-recreate

# Очистка неиспользуемых образов
docker image prune -a
```

## Переменные окружения

Вы можете настроить следующие переменные окружения в `docker-compose.yml`:

- `DEBUG` - режим отладки (по умолчанию False в production)
- `SECRET_KEY` - секретный ключ Django (рекомендуется изменить для production)

## Production deployment

Для развёртывания на production:

1. Измените `SECRET_KEY` в settings.py на безопасный ключ
2. Убедитесь, что `DEBUG=False`
3. Добавьте ваш домен в `ALLOWED_HOSTS` в settings.py
4. Настройте SSL/TLS сертификаты (используйте nginx или traefik как reverse proxy)

## Публикация образа в Docker Hub

### Шаг 1: Регистрация на Docker Hub

1. Перейдите на https://hub.docker.com/
2. Создайте бесплатный аккаунт
3. Запомните ваш username

### Шаг 2: Авторизация в Docker

```bash
docker login
# Введите ваш username и password от Docker Hub
```

### Шаг 3: Загрузка образа (автоматически)

Используйте подготовленный скрипт:

**Windows:**
```bash
docker-push.bat
```

**Linux/macOS:**
```bash
chmod +x docker-push.sh
./docker-push.sh
```

Скрипт автоматически:
- Спросит ваш Docker Hub username
- Соберёт образ с правильным тегом
- Авторизует вас в Docker Hub
- Загрузит образ в Docker Hub

### Шаг 4: Использование образа из Docker Hub

После успешной загрузки, любой пользователь сможет запустить вашу игру командой:

```bash
docker pull ВАШ_USERNAME/platformer-game:latest
docker run -d -p 8000:8000 ВАШ_USERNAME/platformer-game:latest
```

Или через docker-compose, обновив файл:

```yaml
version: '3.8'

services:
  web:
    image: ВАШ_USERNAME/platformer-game:latest
    container_name: platformer-game
    ports:
      - "8000:8000"
    restart: unless-stopped
```

### Ручная загрузка (если скрипт не работает)

```bash
# 1. Соберите образ с вашим username
docker build -t ВАШ_USERNAME/platformer-game:latest .

# 2. Авторизуйтесь в Docker Hub
docker login

# 3. Загрузите образ
docker push ВАШ_USERNAME/platformer-game:latest
```

## Структура проекта

- `Dockerfile` - конфигурация Docker образа
- `docker-compose.yml` - конфигурация Docker Compose
- `.dockerignore` - файлы, игнорируемые при сборке образа
- `requirements.txt` - Python зависимости
- `docker-push.bat` - скрипт для загрузки в Docker Hub (Windows)
- `docker-push.sh` - скрипт для загрузки в Docker Hub (Linux/macOS)

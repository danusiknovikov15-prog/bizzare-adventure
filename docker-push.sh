#!/bin/bash
# Скрипт для сборки и публикации Docker образа в Docker Hub

echo "===================================="
echo "Docker Build and Push Script"
echo "===================================="
echo ""

# Укажите ваш Docker Hub username
read -p "Введите ваш Docker Hub username: " DOCKER_USERNAME

# Название образа
IMAGE_NAME="platformer-game"

# Версия образа (можно изменить)
VERSION="latest"

# Полное имя образа
FULL_IMAGE_NAME="$DOCKER_USERNAME/$IMAGE_NAME:$VERSION"

echo ""
echo "Сборка Docker образа: $FULL_IMAGE_NAME"
echo ""

# Сборка образа
docker build -t "$FULL_IMAGE_NAME" .

if [ $? -ne 0 ]; then
    echo ""
    echo "[ОШИБКА] Не удалось собрать образ!"
    exit 1
fi

echo ""
echo "[УСПЕХ] Образ успешно собран!"
echo ""

# Проверка авторизации в Docker Hub
echo "Проверка авторизации в Docker Hub..."
docker login

if [ $? -ne 0 ]; then
    echo ""
    echo "[ОШИБКА] Не удалось авторизоваться в Docker Hub!"
    exit 1
fi

echo ""
echo "Загрузка образа в Docker Hub: $FULL_IMAGE_NAME"
echo ""

# Загрузка образа
docker push "$FULL_IMAGE_NAME"

if [ $? -ne 0 ]; then
    echo ""
    echo "[ОШИБКА] Не удалось загрузить образ в Docker Hub!"
    exit 1
fi

echo ""
echo "===================================="
echo "[УСПЕХ] Образ успешно загружен!"
echo "===================================="
echo ""
echo "Ваш образ доступен по адресу:"
echo "docker pull $FULL_IMAGE_NAME"
echo ""
echo "Или на Docker Hub:"
echo "https://hub.docker.com/r/$DOCKER_USERNAME/$IMAGE_NAME"
echo ""

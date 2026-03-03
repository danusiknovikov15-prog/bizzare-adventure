@echo off
REM Скрипт для сборки и публикации Docker образа в Docker Hub

echo ====================================
echo Docker Build and Push Script
echo ====================================
echo.

REM Укажите ваш Docker Hub username
set /p DOCKER_USERNAME="Введите ваш Docker Hub username: "

REM Название образа
set IMAGE_NAME=platformer-game

REM Версия образа (можно изменить)
set VERSION=latest

REM Полное имя образа
set FULL_IMAGE_NAME=%DOCKER_USERNAME%/%IMAGE_NAME%:%VERSION%

echo.
echo Сборка Docker образа: %FULL_IMAGE_NAME%
echo.

REM Сборка образа
docker build -t %FULL_IMAGE_NAME% .

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ОШИБКА] Не удалось собрать образ!
    pause
    exit /b 1
)

echo.
echo [УСПЕХ] Образ успешно собран!
echo.

REM Проверка авторизации в Docker Hub
echo Проверка авторизации в Docker Hub...
docker login

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ОШИБКА] Не удалось авторизоваться в Docker Hub!
    pause
    exit /b 1
)

echo.
echo Загрузка образа в Docker Hub: %FULL_IMAGE_NAME%
echo.

REM Загрузка образа
docker push %FULL_IMAGE_NAME%

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ОШИБКА] Не удалось загрузить образ в Docker Hub!
    pause
    exit /b 1
)

echo.
echo ====================================
echo [УСПЕХ] Образ успешно загружен!
echo ====================================
echo.
echo Ваш образ доступен по адресу:
echo docker pull %FULL_IMAGE_NAME%
echo.
echo Или на Docker Hub:
echo https://hub.docker.com/r/%DOCKER_USERNAME%/%IMAGE_NAME%
echo.

pause

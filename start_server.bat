@echo off
title Game Server
echo Starting Django server...
echo.
echo Server will be available at: http://127.0.0.1:8000/
echo Press Ctrl+C to stop the server
echo.
cd /d "c:\Users\danus\Documents\da game"
"C:\Users\danus\AppData\Local\Programs\Python\Python312\python.exe" manage.py runserver
pause

@echo off
cd /d "%~dp0"
call npm install
if errorlevel 1 (
    echo Error al instalar las dependencias.
    pause
    exit /b 1
)
call npm run dev
pause

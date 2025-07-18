@echo off
title ML Clone - Interactive Launcher
chcp 65001 >nul

echo =============================
echo  Iniciando ML Clone
echo =============================

:: Crear carpeta de logs si no existe
if not exist logs (
  mkdir logs
)

:: Obtener fecha y hora actual para el nombre del log
for /f "tokens=1-5 delims=/: " %%a in ("%date% %time%") do (
  set YYYY=%%c
  set MM=%%b
  set DD=%%a
  set HH=%%d
  set MIN=%%e
)

:: Formatear hora para que no tenga caracteres no válidos
set LOG_FILENAME=ml_clone_%YYYY%-%MM%-%DD%_%HH%-%MIN%.log

:: Verificar Node.js
where node >nul 2>&1
if errorlevel 1 (
  echo [X] Node.js no está instalado. Por favor instálalo desde https://nodejs.org
  pause
  exit /b
)

:: Verificar live-server
where live-server >nul 2>&1
if errorlevel 1 (
  echo [!] Instalando live-server globalmente...
  npm install -g live-server
)

:: Borrar logs anteriores si existen
if exist backend.log del /f /q backend.log
if exist frontend.log del /f /q frontend.log

:: Iniciar backend
echo [1/2] Iniciando backend en puerto 3001...
cd backend
start "" /B cmd /c "node app.js >> ..\backend.log 2>&1"
cd ..

:: Esperar unos segundos
timeout /t 2 >nul

:: Iniciar frontend
echo [2/2] Iniciando frontend en puerto 3000...
cd frontend
start "" /B cmd /c "live-server --port=3000 --host=0.0.0.0 >> ..\frontend.log 2>&1"
cd ..

echo -----------------------------
echo Accedé desde tu navegador:
for /f "tokens=2 delims=:" %%f in ('ipconfig ^| findstr /c:"IPv4"') do (
    for /f "tokens=* delims= " %%i in ("%%f") do echo     http://%%i:3000
)
echo -----------------------------
echo.
echo Para detener el sistema escribí: stop
echo.

:loop
set /p input="> "
if /i "%input%"=="stop" goto :stop
goto loop

:stop
echo Cerrando procesos...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM live-server.exe >nul 2>&1

:: Fusionar logs en carpeta /logs
type backend.log > logs\%LOG_FILENAME%
type frontend.log >> logs\%LOG_FILENAME%

:: Limpiar temporales
del /f /q backend.log frontend.log

echo Logs guardados en logs\%LOG_FILENAME%
echo Listo. Sesión finalizada.
pause
exit

@echo off
echo ==========================================
echo   LiveInside - Iniciando Servidor
echo ==========================================
echo.

echo Verificando instalacion...
if not exist "node_modules\" (
    echo ERROR: Dependencias no instaladas
    echo Ejecuta primero: setup.bat
    pause
    exit /b 1
)

echo Iniciando servidor de desarrollo...
echo.
echo ==========================================
echo   La aplicacion se abrira automaticamente
echo   URL: http://localhost:3000
echo ==========================================
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

npm run dev
pause

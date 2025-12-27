@echo off
echo ==========================================
echo   LiveInside - Setup Automatico
echo ==========================================
echo.

echo [1/4] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no esta instalado
    echo Por favor instala Node.js desde https://nodejs.org
    pause
    exit /b 1
)
echo ✓ Node.js detectado

echo.
echo [2/4] Instalando dependencias...
echo (Esto puede tardar unos minutos)
call npm install
if errorlevel 1 (
    echo ERROR: Fallo la instalacion de dependencias
    pause
    exit /b 1
)
echo ✓ Dependencias instaladas

echo.
echo [3/4] Verificando instalacion...
if not exist "node_modules\" (
    echo ERROR: Carpeta node_modules no encontrada
    pause
    exit /b 1
)
echo ✓ Instalacion verificada

echo.
echo [4/4] Preparando para iniciar...
echo.
echo ==========================================
echo   ✓ Setup completado exitosamente!
echo ==========================================
echo.
echo Para iniciar la aplicacion:
echo   npm run dev
echo.
echo La aplicacion se abrira en:
echo   http://localhost:3000
echo.
echo Documentacion:
echo   - README.md          (Documentacion completa)
echo   - QUICKSTART.md      (Guia rapida)
echo   - ESTRUCTURA.md      (Estructura del proyecto)
echo   - TECHNICAL_DECISIONS.md (Decisiones tecnicas)
echo.
echo ==========================================
pause

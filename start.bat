@echo off
chcp 65001 > nul
title Fio Condutor - Iniciando Aplicação

echo ====================================
echo   FIO CONDUTOR - ATELIÊ DE COSTURA
echo ====================================
echo.

REM Verificar se o Docker está instalado
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Docker não encontrado!
    echo Por favor, instale o Docker Desktop: https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)

REM Verificar se o Docker está rodando
docker ps >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Docker não está rodando!
    echo Por favor, inicie o Docker Desktop e tente novamente.
    echo.
    pause
    exit /b 1
)

echo [1/4] Iniciando banco de dados PostgreSQL...
cd backend\src\database
docker-compose -f compose.yaml up -d
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao iniciar o banco de dados!
    echo.
    pause
    exit /b 1
)
echo [✓] Banco de dados iniciado com sucesso!
echo.

REM Aguardar 5 segundos para o banco estar pronto
echo [2/4] Aguardando banco de dados ficar pronto...
timeout /t 5 /nobreak > nul
echo [✓] Banco de dados pronto!
echo.

REM Voltar para a raiz do projeto
cd ..\..\..

echo [3/4] Iniciando servidor backend (Node.js)...
cd backend
start "Fio Condutor - Backend" cmd /k "npm run dev"
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao iniciar o backend!
    echo Certifique-se de que as dependências foram instaladas: npm install
    echo.
    pause
    exit /b 1
)
echo [✓] Backend iniciado!
echo.

REM Aguardar 5 segundos para o backend iniciar
timeout /t 5 /nobreak > nul

echo [4/4] Iniciando aplicação frontend (Next.js)...
cd ..\frontend
start "Fio Condutor - Frontend" cmd /k "npm run dev"
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao iniciar o frontend!
    echo Certifique-se de que as dependências foram instaladas: npm install
    echo.
    pause
    exit /b 1
)
echo [✓] Frontend iniciado!
echo.

echo ====================================
echo   APLICAÇÃO INICIADA COM SUCESSO!
echo ====================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:3000
echo Database: localhost:5432
echo.
echo Pressione qualquer tecla para abrir o navegador...
pause > nul

REM Abrir o navegador
start http://localhost:3000

echo.
echo Para parar a aplicação:
echo 1. Feche as janelas do backend e frontend
echo 2. Execute: docker-compose -f backend\src\database\compose.yaml down
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause > nul

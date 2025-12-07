@echo off
chcp 65001 > nul
title Fio Condutor - Iniciando Aplicação

REM Armazenar diretório raiz do projeto
set PROJECT_ROOT=%cd%

echo ====================================
echo   FIO CONDUTOR - ESCOLA DE CORTE E COSTURA
echo ====================================
echo.
echo Copyright (c) 2025 André Júnior Lopes Cardoso
echo TODOS OS DIREITOS RESERVADOS
echo.
echo ⚠️  SOFTWARE PROPRIETÁRIO
echo ⚠️  USO NÃO AUTORIZADO PROIBIDO
echo ⚠️  Veja LICENSE e NOTICE
echo ====================================
echo.

REM Verificar se o Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js não encontrado!
    echo Por favor, instale o Node.js: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo [✓] Node.js encontrado!
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
echo [✓] Docker encontrado!

REM Verificar se o Docker está rodando
docker ps >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Docker não está rodando!
    echo Por favor, inicie o Docker Desktop e tente novamente.
    echo.
    pause
    exit /b 1
)

REM Verificar e instalar PM2 se necessário
echo [1/9] Verificando PM2...
call npm list -g pm2 >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [1/9] Instalando PM2 globalmente...
    call npm install -g pm2
    echo [✓] PM2 instalado com sucesso!
    echo.
) else (
    echo [✓] PM2 já está instalado!
    echo.
)

echo [2/9] Iniciando banco de dados PostgreSQL...
cd "%PROJECT_ROOT%\backend\src\database"
docker compose -f compose.yaml up -d
cd "%PROJECT_ROOT%"
echo [✓] Banco de dados iniciado!
echo.

echo [3/9] Aguardando banco de dados ficar pronto...
set "DB_CONTAINER_NAME=fio-condutor-db"
set "MAX_ATTEMPTS=20"
set "ATTEMPT_COUNT=0"
:check_db
set /a ATTEMPT_COUNT+=1
if %ATTEMPT_COUNT% gtr %MAX_ATTEMPTS% (
    echo [ERRO] O banco de dados não ficou pronto a tempo.
    pause
    exit /b 1
)
echo Verificando conexão com o banco de dados (tentativa %ATTEMPT_COUNT%)...
docker exec "%DB_CONTAINER_NAME%" pg_isready -U docker -d fiocondutor -h localhost -p 5432 >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    timeout /t 3 /nobreak > nul
    goto check_db
)
echo [✓] Banco de dados pronto para conexões!
echo.

echo [4/9] Instalando dependências do backend...
cd "%PROJECT_ROOT%\backend"
call npm install --legacy-peer-deps
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao instalar dependências do backend!
    echo.
    pause
    exit /b 1
)
cd "%PROJECT_ROOT%"
echo [✓] Dependências do backend instaladas!
echo.

echo [5/9] Aplicando migrações do banco de dados...
cd "%PROJECT_ROOT%\backend"
call npx prisma generate
call npx prisma migrate deploy
call npx prisma db seed
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao aplicar migrações do banco de dados!
    echo.
    pause
    exit /b 1
)
cd "%PROJECT_ROOT%"
echo [✓] Migrações do banco de dados aplicadas!
echo.

echo [6/9] Buildando backend...
cd "%PROJECT_ROOT%\backend"
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao buildar backend!
    echo.
    pause
    exit /b 1
)
cd "%PROJECT_ROOT%"
echo [✓] Backend buildado!
echo.

echo [7/9] Instalando dependências do frontend...
cd "%PROJECT_ROOT%\frontend"
call npm install --legacy-peer-deps
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao instalar dependências do frontend!
    echo.
    pause
    exit /b 1
)
cd "%PROJECT_ROOT%"
echo [✓] Dependências do frontend instaladas!
echo.

echo [8/9] Buildando frontend...
cd "%PROJECT_ROOT%\frontend"
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao buildar frontend!
    echo.
    pause
    exit /b 1
)
cd "%PROJECT_ROOT%"
echo [✓] Frontend buildado!
echo.

echo [9/9] Iniciando serviços com PM2...
REM Parar processos antigos se existirem
call pm2 delete all >nul 2>&1

REM Iniciar backend (versão buildada)
cd "%PROJECT_ROOT%\backend"
call pm2 start dist/src/server.js --name "fio-condutor-backend"
cd "%PROJECT_ROOT%"
timeout /t 5 /nobreak > nul
echo [✓] Backend iniciado!
echo.

REM Iniciar frontend (versão buildada)
cd "%PROJECT_ROOT%\frontend"
call pm2 start server.js --name "fio-condutor-frontend"
cd "%PROJECT_ROOT%"
timeout /t 5 /nobreak > nul
echo [✓] Frontend iniciado!
echo.

call pm2 save >nul 2>&1

echo ====================================
echo   APLICAÇÃO INICIADA COM SUCESSO!
echo ====================================
echo.
echo Backend:  http://localhost:3005
echo Frontend: http://localhost:3000
echo Database: localhost:5432
echo.
echo Status dos processos:
call pm2 status
echo.
echo Para visualizar logs em tempo real:
echo   pm2 logs
echo.
echo Para parar a aplicação, execute:
echo   stop.bat
echo.
echo Abrindo navegador em 5 segundos...
timeout /t 5 /nobreak > nul
start http://localhost:3000
echo.
echo Pressione qualquer tecla para sair do script...
pause > nul

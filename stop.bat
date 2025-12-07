@echo off
chcp 65001 > nul
title Fio Condutor - Parando Aplicação

echo ====================================
echo   FIO CONDUTOR - PARANDO SERVIÇOS
echo ====================================
echo.

echo [1/3] Parando processos PM2...
pm2 stop all >nul 2>&1
pm2 delete all >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [✓] Processos PM2 parados!
) else (
    echo [!] Nenhum processo PM2 ativo ou erro ao parar.
)
echo.

echo [2/3] Parando containers Docker...
cd backend\src\database
docker-compose -f compose.yaml down
if %ERRORLEVEL% EQU 0 (
    echo [✓] Containers Docker parados!
) else (
    echo [!] Nenhum container em execução ou erro ao parar.
)
echo.

cd ..\..\..

echo [3/3] Limpando...
echo [✓] Limpeza concluída!
echo.

echo ====================================
echo   TODOS OS SERVIÇOS FORAM PARADOS
echo ====================================
echo.
pause

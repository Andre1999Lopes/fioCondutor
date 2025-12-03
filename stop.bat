@echo off
chcp 65001 > nul
title Fio Condutor - Parando Aplicação

echo ====================================
echo   FIO CONDUTOR - PARANDO SERVIÇOS
echo ====================================
echo.

echo [1/3] Parando containers Docker...
cd backend\src\database
docker-compose -f compose.yaml down
if %ERRORLEVEL% EQU 0 (
    echo [✓] Containers Docker parados!
) else (
    echo [!] Nenhum container em execução ou erro ao parar.
)
echo.

cd ..\..\..

echo [2/3] Encerrando processos Node.js (backend e frontend)...
taskkill /F /FI "WINDOWTITLE eq Fio Condutor - Backend*" > nul 2>&1
taskkill /F /FI "WINDOWTITLE eq Fio Condutor - Frontend*" > nul 2>&1
echo [✓] Processos Node.js encerrados!
echo.

echo [3/3] Limpando...
echo [✓] Limpeza concluída!
echo.

echo ====================================
echo   TODOS OS SERVIÇOS FORAM PARADOS
echo ====================================
echo.
pause

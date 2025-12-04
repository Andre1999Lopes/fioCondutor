#!/bin/bash
set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${RED}========================================${NC}"
echo -e "${RED}💣 Destruir Infraestrutura${NC}"
echo -e "${RED}========================================${NC}\n"

# Verificar se está na pasta backend
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Execute este script da pasta backend!${NC}"
    exit 1
fi

# Verificar se EB está configurado
if [ ! -d ".elasticbeanstalk" ]; then
    echo -e "${RED}❌ Nenhuma aplicação EB encontrada nesta pasta.${NC}"
    exit 1
fi

# Listar ambientes
echo -e "${YELLOW}📋 Ambientes disponíveis:${NC}\n"
eb list

echo -e "\n${RED}⚠️  ATENÇÃO: Esta ação irá:${NC}"
echo -e "  - ${RED}Deletar o ambiente Elastic Beanstalk${NC}"
echo -e "  - ${RED}Deletar o banco de dados RDS${NC}"
echo -e "  - ${RED}Deletar todos os dados permanentemente${NC}"
echo -e "  - ${RED}Esta ação NÃO PODE ser desfeita!${NC}\n"

read -p "Nome do ambiente para deletar (ou Enter para usar atual): " ENV_NAME

if [ -z "$ENV_NAME" ]; then
    # Usar ambiente atual
    echo -e "\n${YELLOW}Usando ambiente atual...${NC}"
    CURRENT_ENV=$(eb status | grep "Environment name" | awk '{print $3}')
    echo -e "Ambiente: ${RED}$CURRENT_ENV${NC}\n"
    
    read -p "Confirma a destruição de '$CURRENT_ENV'? Digite 'DESTRUIR' para confirmar: " CONFIRM
    
    if [ "$CONFIRM" != "DESTRUIR" ]; then
        echo -e "${GREEN}Operação cancelada. Nada foi deletado.${NC}"
        exit 0
    fi
    
    echo -e "\n${RED}💣 Destruindo ambiente...${NC}"
    eb terminate --force
else
    echo -e "Ambiente: ${RED}$ENV_NAME${NC}\n"
    
    read -p "Confirma a destruição de '$ENV_NAME'? Digite 'DESTRUIR' para confirmar: " CONFIRM
    
    if [ "$CONFIRM" != "DESTRUIR" ]; then
        echo -e "${GREEN}Operação cancelada. Nada foi deletado.${NC}"
        exit 0
    fi
    
    echo -e "\n${RED}💣 Destruindo ambiente...${NC}"
    eb terminate $ENV_NAME --force
fi

echo -e "\n${GREEN}✅ Infraestrutura destruída com sucesso!${NC}"
echo -e "${YELLOW}O banco de dados RDS também foi removido.${NC}\n"

# Limpar arquivo de info se existir
if [ -f ".eb-info.txt" ]; then
    rm .eb-info.txt
    echo -e "${GREEN}✅ Arquivo .eb-info.txt removido${NC}"
fi

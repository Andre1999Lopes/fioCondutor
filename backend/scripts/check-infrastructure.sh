#!/bin/bash
set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}📊 Status da Infraestrutura${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Verificar se está na pasta backend
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Execute este script da pasta backend!${NC}"
    exit 1
fi

# Verificar se EB está configurado
if [ ! -d ".elasticbeanstalk" ]; then
    echo -e "${YELLOW}⚠️  Nenhuma aplicação EB encontrada.${NC}"
    exit 0
fi

echo -e "${YELLOW}📋 Ambientes:${NC}"
eb list
echo

echo -e "${YELLOW}📊 Status detalhado:${NC}"
eb status
echo

echo -e "${YELLOW}💾 Informações do RDS:${NC}"
eb printenv | grep -E "RDS_|DATABASE_" || echo "Nenhuma informação de banco encontrada"
echo

echo -e "${YELLOW}🌐 Health:${NC}"
eb health --refresh

if [ -f ".eb-info.txt" ]; then
    echo -e "\n${BLUE}📄 Informações salvas:${NC}"
    cat .eb-info.txt
fi

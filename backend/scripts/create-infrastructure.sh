#!/bin/bash
set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🚀 Criando Infraestrutura Completa${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Verificar se está na pasta backend
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Execute este script da pasta backend!${NC}"
    exit 1
fi

# Verificar se EB CLI está instalado
if ! command -v eb &> /dev/null; then
    echo -e "${RED}❌ EB CLI não encontrado. Instale com: pip install awsebcli${NC}"
    exit 1
fi

# Perguntar nome do ambiente
read -p "Nome do ambiente (ex: production, staging): " ENV_NAME
ENV_NAME=${ENV_NAME:-production}

APP_NAME="fio-condutor-$ENV_NAME"

echo -e "\n${YELLOW}📋 Configuração:${NC}"
echo -e "  Aplicação: ${GREEN}$APP_NAME${NC}"
echo -e "  Banco de dados: ${GREEN}PostgreSQL 16.3 (db.t3.micro)${NC}"
echo -e "  Região: ${GREEN}us-east-1${NC}\n"

read -p "Continuar? (s/N): " CONFIRM
if [[ ! $CONFIRM =~ ^[Ss]$ ]]; then
    echo -e "${YELLOW}Operação cancelada.${NC}"
    exit 0
fi

echo -e "\n${BLUE}1/5${NC} ${YELLOW}Inicializando Elastic Beanstalk...${NC}"
if [ ! -d ".elasticbeanstalk" ]; then
    eb init $APP_NAME \
        --region us-east-1 \
        --platform "Node.js 20" \
        --keyname aws-eb-keypair
    echo -e "${GREEN}✅ Aplicação inicializada${NC}"
else
    echo -e "${GREEN}✅ Aplicação já inicializada${NC}"
fi

echo -e "\n${BLUE}2/5${NC} ${YELLOW}Criando ambiente com RDS PostgreSQL...${NC}"
echo -e "${YELLOW}⏳ Isso pode levar 10-15 minutos...${NC}\n"

eb create $APP_NAME \
    --database \
    --database.engine postgres \
    --database.version 16.3 \
    --database.size 20 \
    --database.instance db.t3.micro \
    --database.username fiocondutoruser \
    --envvars NODE_ENV=production \
    --instance-type t3.micro \
    --single

echo -e "\n${GREEN}✅ Ambiente criado!${NC}"

echo -e "\n${BLUE}3/5${NC} ${YELLOW}Configurando variáveis de ambiente...${NC}\n"

# Gerar JWT_SECRET ou pedir
echo -e "${YELLOW}Configurando JWT_SECRET...${NC}"
read -p "Gerar JWT_SECRET automaticamente? (S/n): " AUTO_JWT
if [[ ! $AUTO_JWT =~ ^[Nn]$ ]]; then
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('base64'))")
    echo -e "${GREEN}✅ JWT_SECRET gerado automaticamente${NC}"
else
    read -sp "Digite o JWT_SECRET: " JWT_SECRET
    echo
fi

# FRONT_URL
echo -e "\n${YELLOW}Configurando FRONT_URL...${NC}"
read -p "URL do Frontend (ex: https://seu-app.vercel.app): " FRONT_URL
FRONT_URL=${FRONT_URL:-"http://localhost:3000"}

# Admin Email
echo -e "\n${YELLOW}Configurando dados do Admin inicial...${NC}"
read -p "Email do Admin (padrão: admin@admin.com): " ADMIN_EMAIL
ADMIN_EMAIL=${ADMIN_EMAIL:-"admin@admin.com"}

# Admin Name
read -p "Nome do Admin (padrão: Administrador): " ADMIN_NAME
ADMIN_NAME=${ADMIN_NAME:-"Administrador"}

# Admin Password
read -sp "Senha do Admin (padrão: Admin1238@): " ADMIN_PASSWORD
echo
ADMIN_PASSWORD=${ADMIN_PASSWORD:-"Admin1238@"}

echo -e "\n${YELLOW}⏳ Aplicando variáveis de ambiente...${NC}"
eb setenv \
  JWT_SECRET="$JWT_SECRET" \
  FRONT_URL="$FRONT_URL" \
  PORT="8080" \
  ADMIN_EMAIL="$ADMIN_EMAIL" \
  ADMIN_NAME="$ADMIN_NAME" \
  ADMIN_PASSWORD="$ADMIN_PASSWORD"

echo -e "${GREEN}✅ Variáveis configuradas${NC}"

echo -e "\n${BLUE}4/5${NC} ${YELLOW}Fazendo deploy da aplicação...${NC}"
eb deploy

echo -e "\n${BLUE}5/5${NC} ${YELLOW}Verificando status...${NC}"
eb status

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Infraestrutura criada com sucesso!${NC}"
echo -e "${GREEN}========================================${NC}\n"

# Obter URL
URL=$(eb status | grep "CNAME" | awk '{print $2}')
echo -e "${BLUE}🌐 URL da API:${NC} http://$URL"

echo -e "\n${YELLOW}📝 Próximos passos:${NC}"
echo -e "  1. Configure a variável NEXT_PUBLIC_API_URL no Vercel com: http://$URL"
echo -e "  2. Configure CORS no backend para aceitar o domínio da Vercel"
echo -e "  3. Para destruir tudo: ./scripts/destroy-infrastructure.sh\n"

# Salvar informações
cat > .eb-info.txt << EOF
Ambiente: $APP_NAME
URL: http://$URL
Data de criação: $(date)

Variáveis Configuradas:
- JWT_SECRET: [DEFINIDO]
- FRONT_URL: $FRONT_URL
- PORT: 8080
- ADMIN_EMAIL: $ADMIN_EMAIL
- ADMIN_NAME: $ADMIN_NAME
- ADMIN_PASSWORD: [DEFINIDO]
- DATABASE_URL: [Configurado automaticamente pelo RDS]
EOF

echo -e "${GREEN}✅ Informações salvas em .eb-info.txt${NC}"

echo -e "\n${BLUE}📋 Resumo das Variáveis:${NC}"
echo -e "  JWT_SECRET: ${GREEN}[CONFIGURADO]${NC}"
echo -e "  FRONT_URL: ${GREEN}$FRONT_URL${NC}"
echo -e "  PORT: ${GREEN}8080${NC}"
echo -e "  ADMIN_EMAIL: ${GREEN}$ADMIN_EMAIL${NC}"
echo -e "  ADMIN_NAME: ${GREEN}$ADMIN_NAME${NC}"
echo -e "  ADMIN_PASSWORD: ${GREEN}[CONFIGURADO]${NC}"
echo -e "  DATABASE_URL: ${GREEN}[Auto - RDS]${NC}\n"

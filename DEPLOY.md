# 🚀 Guia de Deploy - Fio Condutor

Deploy do monorepo: Frontend na Vercel e Backend + PostgreSQL no AWS Elastic Beanstalk.

---

## 📋 Pré-requisitos

### AWS (Backend):

```bash
# Instalar AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip && sudo ./aws/install

# Configurar credenciais
aws configure

# Instalar EB CLI
pip install awsebcli
```

**Permissões IAM Necessárias:**

O usuário IAM precisa das seguintes permissões (policies):

1. **AdministratorAccess-AWSElasticBeanstalk** (Managed Policy)
2. **AmazonRDSFullAccess** (Managed Policy) - Para criar banco
3. **AmazonEC2FullAccess** (Managed Policy) - Para criar instâncias
4. **AmazonS3FullAccess** (Managed Policy) - Para armazenar código
5. **IAMFullAccess** (Managed Policy) - Para criar roles

**Ou crie uma policy customizada com estas permissões:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "elasticbeanstalk:*",
        "ec2:*",
        "rds:*",
        "s3:*",
        "cloudformation:*",
        "autoscaling:*",
        "elasticloadbalancing:*",
        "iam:CreateRole",
        "iam:CreateInstanceProfile",
        "iam:AddRoleToInstanceProfile",
        "iam:PassRole",
        "iam:GetRole",
        "iam:PutRolePolicy",
        "iam:AttachRolePolicy"
      ],
      "Resource": "*"
    }
  ]
}
```

**Como criar usuário IAM:**

1. Acesse [IAM Console](https://console.aws.amazon.com/iam/)
2. **Users** → **Create user**
3. Nome: `eb-deploy-user`
4. Marque: **Programmatic access**
5. Anexe as policies acima
6. Copie **Access Key ID** e **Secret Access Key**
7. Use no `aws configure`

### Vercel (Frontend):

- Conta no [vercel.com](https://vercel.com)
- Repositório no GitHub

---

## ⚡ Deploy Backend + Banco (AWS)

### Criar Infraestrutura Completa

**Um comando cria tudo:**

- ✅ Elastic Beanstalk (Node.js 20)
- ✅ RDS PostgreSQL 16.3 (db.t3.micro, 20GB)
- ✅ Conexão automática
- ✅ Migrations + Seed automáticos

```bash
cd backend
./scripts/create-infrastructure.sh
```

O script solicitará:

- Nome do ambiente (ex: production)
- JWT_SECRET (pode gerar automaticamente)
- URL do Frontend
- Dados do admin inicial

**Tempo:** 10-15 minutos

### Destruir Tudo

```bash
cd backend
./scripts/destroy-infrastructure.sh
# Digite: DESTRUIR (para confirmar)
```

⚠️ Remove backend, banco de dados e todos os dados permanentemente!

---

## 🌐 Deploy Frontend (Vercel)

1. Acesse [vercel.com](https://vercel.com)
2. Importe o repositório
3. Configure:
   - **Root Directory:** `frontend`
   - **Framework:** Next.js (detectado automaticamente)
4. Adicione variável de ambiente:
   ```
   NEXT_PUBLIC_API_URL=http://seu-backend.elasticbeanstalk.com
   ```
5. Deploy automático a cada push na `main`

---

## 🔧 Configurar Variáveis de Ambiente

### Durante criação:

O script `create-infrastructure.sh` solicita automaticamente.

### Adicionar depois:

```bash
cd backend
eb setenv \
  JWT_SECRET="novo-valor" \
  FRONT_URL="https://seu-app.vercel.app" \
  ADMIN_EMAIL="admin@example.com"
```

### Ver variáveis:

```bash
eb printenv
```

### Gerar JWT_SECRET:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

---

## 📊 Comandos Úteis

```bash
cd backend

# Ver status
./scripts/check-infrastructure.sh

# Atualizar código
eb deploy

# Ver logs
eb logs
eb logs --stream  # tempo real

# SSH no servidor
eb ssh

# Ver health
eb health
```

---

## 🔍 Troubleshooting

### Erro de conexão com banco

```bash
eb printenv | grep RDS_
eb ssh
cd /var/app/current
npm run prisma:generate
```

### Erro em migrations

```bash
eb ssh
cd /var/app/current
npm run prisma:migrate:deploy
```

### Ver logs completos

```bash
eb logs --all
```

### Acessar banco (via SSH)

```bash
eb ssh
psql $DATABASE_URL
```

### Rollback

```bash
eb appversions
eb deploy --version <version-label>
```

---

## 💰 Custos Estimados (us-east-1)

- EC2 (t3.micro): ~$7.50/mês
- RDS PostgreSQL (db.t3.micro): ~$15/mês
- Storage (20GB): ~$2/mês
- **Total AWS:** ~$25/mês
- **Vercel:** Grátis (hobby)

---

## 🏗️ Arquitetura

```
Vercel (Frontend - Next.js)
         ↓ HTTPS
AWS Elastic Beanstalk (Backend - Node.js)
         ↓ VPC
AWS RDS PostgreSQL (Banco de Dados)
```

---

## 📁 Arquivos de Configuração

- `/vercel.json` - Config do frontend
- `/backend/.ebextensions/` - Configs do Elastic Beanstalk
- `/backend/scripts/create-infrastructure.sh` - Criar tudo
- `/backend/scripts/destroy-infrastructure.sh` - Destruir tudo
- `/backend/scripts/check-infrastructure.sh` - Ver status
- `/backend/PERMISSOES-IAM.md` - Guia detalhado de permissões IAM

---

**Pronto! Use `./scripts/create-infrastructure.sh` para começar.** 🚀

📝 **Importante:** Veja `backend/PERMISSOES-IAM.md` para detalhes sobre permissões AWS necessárias.

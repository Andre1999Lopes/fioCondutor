# 🚀 Scripts de Inicialização - Fio Condutor

## Scripts disponíveis para Windows

### `start.bat` - Iniciar toda a aplicação

**Como usar:**

1. Dê um **duplo clique** no arquivo `start.bat` na raiz do projeto
2. O script irá:
   - ✅ Verificar se o Docker está instalado e rodando
   - ✅ Iniciar o banco de dados PostgreSQL (Docker)
   - ✅ Iniciar o servidor backend (Node.js)
   - ✅ Iniciar a aplicação frontend (Next.js)
   - ✅ Abrir automaticamente no navegador

**URLs após inicialização:**

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Database: localhost:5432

---

### `stop.bat` - Parar toda a aplicação

**Como usar:**

1. Dê um **duplo clique** no arquivo `stop.bat`
2. O script irá:
   - ⏹️ Parar todos os containers Docker
   - ⏹️ Encerrar processos do backend e frontend
   - ⏹️ Fazer limpeza

---

## 📋 Requisitos

### Antes de usar os scripts, certifique-se de ter:

1. **Docker Desktop instalado e rodando**

   - Download: https://www.docker.com/products/docker-desktop
   - O Docker precisa estar aberto antes de executar o `start.bat`

2. **Node.js instalado** (v18 ou superior)

   - Download: https://nodejs.org/

3. **Dependências instaladas**

   Execute uma vez antes de usar os scripts:

   ```bash
   # No diretório backend
   cd backend
   npm install

   # No diretório frontend
   cd ../frontend
   npm install
   ```

---

## ⚙️ Configuração inicial (primeira vez)

1. **Instale as dependências:**

   ```bash
   cd backend
   npm install

   cd ../frontend
   npm install
   ```

2. **Configure as variáveis de ambiente:**

   **Backend** (`backend/.env`):

   ```env
   DATABASE_URL="postgresql://admin:senha123@localhost:5432/fio_condutor"
   JWT_SECRET="seu-secret-super-seguro-aqui"
   PORT=3001
   ```

   **Frontend** (`frontend/.env.local`):

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

3. **Execute as migrações do banco de dados:**

   ```bash
   cd backend
   npx prisma migrate dev
   ```

4. **Agora é só usar o `start.bat`!**

---

## 🐛 Solução de problemas

### "Docker não encontrado"

- Instale o Docker Desktop: https://www.docker.com/products/docker-desktop

### "Docker não está rodando"

- Abra o Docker Desktop e aguarde iniciar completamente
- Tente executar `start.bat` novamente

### "Porta já está em uso"

- Backend (3001): Outro processo pode estar usando a porta

  ```bash
  # Encontrar e matar processo na porta 3001
  netstat -ano | findstr :3001
  taskkill /PID <numero_do_pid> /F
  ```

- Frontend (3000): Outro processo pode estar usando a porta
  ```bash
  # Encontrar e matar processo na porta 3000
  netstat -ano | findstr :3000
  taskkill /PID <numero_do_pid> /F
  ```

### "Erro ao conectar ao banco de dados"

- Aguarde alguns segundos após iniciar o Docker
- Verifique se o container está rodando: `docker ps`
- Reinicie o backend manualmente

---

## 📝 Notas

- Os scripts abrem novas janelas do terminal para backend e frontend
- Você pode ver os logs em tempo real nessas janelas
- Para parar tudo, use o `stop.bat` ou feche as janelas manualmente
- O banco de dados mantém os dados mesmo após parar (usa volumes Docker)

---

## 🔄 Alternativas manuais

Se preferir iniciar manualmente:

```bash
# 1. Banco de dados
cd backend/src/database
docker-compose -f compose.yaml up -d

# 2. Backend (em outro terminal)
cd backend
npm run dev

# 3. Frontend (em outro terminal)
cd frontend
npm run dev
```

Para parar manualmente:

```bash
# Parar banco de dados
cd backend/src/database
docker-compose -f compose.yaml down

# Fechar terminais do backend e frontend (Ctrl+C)
```

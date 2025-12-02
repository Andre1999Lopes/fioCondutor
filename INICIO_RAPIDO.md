# 🚀 Guia de Início Rápido - Fio Condutor

## 📋 Pré-requisitos

- **Node.js** 18+ instalado ([Download](https://nodejs.org))
- **npm** ou **yarn** (vem com Node.js)
- **Git** (opcional)

## 🎯 Setup Inicial (Primeira Vez)

### Passo 1: Abrir Terminal

**Windows (PowerShell ou CMD)**
```powershell
# Navegue até a pasta do projeto
cd c:\Users\andre\Desktop\fioCondutor
```

### Passo 2: Instalar Dependências do Backend

```powershell
cd backend
npm install
```

**Aguarde a instalação completa...**

### Passo 3: Instalar Dependências do Frontend

```powershell
cd ..\frontend
npm install
```

**Aguarde a instalação completa...**

## 🚀 Executar Projeto (Todos os Dias)

### Opção 1: Dois Terminais Separados (Recomendado)

**Terminal 1 - Backend:**
```powershell
cd c:\Users\andre\Desktop\fioCondutor\backend
npm run dev
```

**Resultado esperado:**
```
Server running at http://localhost:3000
```

**Terminal 2 - Frontend:**
```powershell
cd c:\Users\andre\Desktop\fioCondutor\frontend
npm run dev
```

**Resultado esperado:**
```
▲ Next.js 16.0.6
  ✓ Ready in 1.2s
  ➜ Local:        http://localhost:3000
```

### Opção 2: Powershell Concurrently (Se instalado)

```powershell
npm install -g concurrently
cd c:\Users\andre\Desktop\fioCondutor
concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
```

## 🌐 Acessar a Aplicação

1. Abra o navegador
2. Acesse: **http://localhost:3000**
3. Você será redirecionado para a página de login

## 🔐 Login Padrão

**Para testar, primeiro crie uma conta:**

1. Clique em "Cadastre-se"
2. Preencha: Nome, Email, Senha
3. Clique em "Cadastrar"
4. Você será automaticamente logado

**Ou teste com dados criados manualmente no backend**

## 📱 Funcionalidades Principais

### Dashboard
- Estatísticas gerais
- Pendências de pagamento
- Resumo de alunos e turmas

### Alunos
- Listar todos
- Criar novo
- Editar informações
- Deletar

### Turmas
- Visualizar turmas
- Criar novas turmas
- Gerenciar dados

### Matrículas
- Matricular aluno
- Ver matrículas
- Desmatricular

### Pagamentos
- Registrar pagamentos
- Marcar como pago
- Filtrar por status

## 🛠️ Troubleshooting

### ❌ "Port 3000 already in use" (Backend)

**Solução 1:** Feche outras aplicações usando porta 3000

**Solução 2:** Use porta diferente
```powershell
# Windows
$env:PORT=3001
npm run dev
```

### ❌ "Port 3000 already in use" (Frontend)

```powershell
# Windows
$env:PORT=3001
npm run dev
```

Acesse: http://localhost:3001

### ❌ "Module not found" ou "Dependencies not installed"

**Solução:**
```powershell
# Limpar cache
rm -r node_modules
rm package-lock.json

# Reinstalar
npm install
npm run dev
```

### ❌ API não conecta / 404 errors

1. Verifique se backend está rodando (http://localhost:3000/api/auth/perfil)
2. Verifique URL da API em: `frontend/.env.local`
3. Deve ser: `NEXT_PUBLIC_API_URL=http://localhost:3000/api`

### ❌ Login não funciona

1. Verifique banco de dados do backend
2. Crie novo usuário através do cadastro
3. Verifique console do navegador (F12) para erros

## 📦 Estrutura do Projeto

```
fioCondutor/
├── backend/              ← API Node.js
│   ├── src/
│   ├── prisma/
│   └── package.json
│
├── frontend/             ← Next.js React
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── package.json
│
├── GUIA_VISUAL.md        ← Visualização das páginas
└── README.md
```

## 🔧 Comandos Úteis

### Backend

```powershell
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start

# Migrar banco de dados
npx prisma migrate dev
```

### Frontend

```powershell
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start

# Lint
npm run lint
```

## 📚 Documentação

- **Backend**: `/backend/README.md`
- **Frontend**: `/frontend/FRONTEND_README.md`
- **Guia Visual**: `/GUIA_VISUAL.md`
- **Desenvolvimento**: `/frontend/DESENVOLVIMENTO.md`

## 💡 Dicas

1. **Abra o navegador em dois monitors** - Um para frontend, outro para backend logs
2. **Use VS Code** - Instale "Thunder Client" ou "REST Client" para testar API
3. **DevTools do navegador** - Use F12 para ver erros
4. **Limpar localStorage** - Se tiver problemas de token: 
   ```javascript
   localStorage.clear(); // No console do navegador
   ```

## ✅ Checklist de Verificação

- [ ] Node.js 18+ instalado (`node --version`)
- [ ] npm funcionando (`npm --version`)
- [ ] Backend respondendo (`npm run dev` na pasta backend)
- [ ] Frontend iniciando (`npm run dev` na pasta frontend)
- [ ] Acessar http://localhost:3000
- [ ] Conseguir criar conta
- [ ] Conseguir fazer login
- [ ] Dashboard carrega

## 🆘 Precisa de Ajuda?

1. Verifique este documento novamente
2. Consulte os READMEs nas pastas
3. Veja o GUIA_VISUAL.md para entender o layout
4. Verifique console do navegador (F12)
5. Verifique logs do backend

## 🎉 Pronto!

Se tudo correu bem, você deve estar vendo a aplicação rodando. Explore os recursos e divirta-se!

---

**Última atualização**: Dezembro 2024
**Status**: ✅ 100% Funcional

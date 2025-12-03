# 🎨 Fio Condutor - Sistema de Gestão de Ateliê de Costura

> **Solução completa** para gerenciar alunos, turmas, matrículas e pagamentos de um ateliê de costura.

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![Version](https://img.shields.io/badge/version-1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Índice

- [🚀 Quick Start](#-quick-start)
- [📚 Documentação](#-documentação)
- [🏗️ Arquitetura](#-arquitetura)
- [✨ Funcionalidades](#-funcionalidades)
- [🎯 Status](#-status)

---

## 🚀 Quick Start

### 🪟 Windows (Método mais fácil!)

**Duplo clique em `start.bat`** na raiz do projeto e pronto! 🎉

Veja mais detalhes em: [SCRIPTS_WINDOWS.md](./SCRIPTS_WINDOWS.md)

---

### Primeira Vez?

1. **Leia:** [INICIO_RAPIDO.md](./INICIO_RAPIDO.md) (5 minutos)

2. **Instale dependências:**

```bash
cd backend && npm install
cd ../frontend && npm install
```

3. **Execute:**

   **Opção 1 - Script automático (Windows):**

   ```bash
   # Duplo clique no arquivo start.bat
   ```

   **Opção 2 - Manual:**

   ```bash
   # Terminal 1 - Banco de dados
   cd backend/src/database
   docker-compose -f compose.yaml up -d

   # Terminal 2 - Backend
   cd backend && npm run dev

   # Terminal 3 - Frontend
   cd frontend && npm run dev
   ```

4. **Acesse:** http://localhost:3000

---

## 📚 Documentação

| Documento                                                        | Objetivo           | Leitura |
| ---------------------------------------------------------------- | ------------------ | ------- |
| **[SUMARIO_EXECUTIVO.md](./SUMARIO_EXECUTIVO.md)**               | O que foi entregue | 3 min   |
| **[INICIO_RAPIDO.md](./INICIO_RAPIDO.md)**                       | Como executar      | 5 min   |
| **[SCRIPTS_WINDOWS.md](./SCRIPTS_WINDOWS.md)**                   | Scripts Windows    | 3 min   |
| **[INDEX.md](./INDEX.md)**                                       | Mapa do projeto    | 7 min   |
| **[GUIA_VISUAL.md](./GUIA_VISUAL.md)**                           | Layout das páginas | 10 min  |
| **[CHECKLIST.md](./CHECKLIST.md)**                               | Validação completa | 5 min   |
| **[RESUMO_FINAL.md](./RESUMO_FINAL.md)**                         | Detalhes técnicos  | 8 min   |
| **[frontend/FRONTEND_README.md](./frontend/FRONTEND_README.md)** | Docs frontend      | 10 min  |
| **[backend/README.md](./backend/README.md)**                     | Docs backend       | 10 min  |

---

## 🏗️ Arquitetura

```
                    FRONTEND
            ┌─────────────────────┐
            │   Next.js + React   │
            │   TypeScript        │
            │   Tailwind CSS      │
            └──────────────┬──────┘
                          │
                    Axios + JWT
                          │
            ┌─────────────────────┐
            │    BACKEND API      │
            │  Node.js + Express  │
            │   Prisma + SQLite   │
            └─────────────────────┘
```

---

## ✨ Funcionalidades

### 🔐 Autenticação

- ✅ Login com JWT
- ✅ Registro de nova conta
- ✅ Sessão persistente
- ✅ Auto-logout

### 👥 Gestão de Alunos

- ✅ Listar alunos
- ✅ Criar aluno
- ✅ Editar aluno
- ✅ Deletar aluno
- ✅ Buscar por nome/email

### 🏫 Gestão de Turmas

- ✅ Listar turmas
- ✅ Criar turma
- ✅ Editar turma
- ✅ Deletar turma
- ✅ Status (ativa/inativa)

### 📚 Gestão de Matrículas

- ✅ Matricular aluno
- ✅ Listar matrículas
- ✅ Desmatricular
- ✅ Filtrar por status

### 💳 Controle de Pagamentos

- ✅ Registrar pagamento
- ✅ Marcar como pago
- ✅ Listar pendências
- ✅ Filtrar por status
- ✅ Arrecadação

### 📊 Dashboard

- ✅ Estatísticas gerais
- ✅ Tabela de inadimplências
- ✅ Dados em tempo real

---

## 🎯 Status

### ✅ Frontend - 100% Completo

| Feature         | Status |
| --------------- | ------ |
| Login/Registro  | ✅     |
| Dashboard       | ✅     |
| CRUD Alunos     | ✅     |
| CRUD Turmas     | ✅     |
| CRUD Matrículas | ✅     |
| CRUD Pagamentos | ✅     |
| Responsividade  | ✅     |
| API Integration | ✅     |
| Documentação    | ✅     |

### ✅ Backend - 100% Funcional

| Feature         | Status |
| --------------- | ------ |
| Autenticação    | ✅     |
| CRUD Alunos     | ✅     |
| CRUD Turmas     | ✅     |
| CRUD Matrículas | ✅     |
| CRUD Pagamentos | ✅     |
| Dashboard       | ✅     |
| Database        | ✅     |

---

## 💻 Stack Tecnológico

### Frontend

- **Next.js** 16 - Framework React SSR
- **React** 19 - UI Library
- **TypeScript** - Type Safety
- **Tailwind CSS** 4 - Styling
- **React Query** 5 - Data Fetching
- **Zustand** - State Management
- **Axios** - HTTP Client

### Backend

- **Node.js** - Runtime
- **Express** - Web Framework
- **TypeScript** - Type Safety
- **Prisma** - ORM
- **SQLite** - Database
- **JWT** - Authentication

---

## 🚀 Deployment

### Vercel (Recomendado)

```bash
# Frontend (Vercel)
cd frontend
vercel deploy

# Backend (Railway/Heroku)
cd backend
# Deploy em sua plataforma preferida
```

### Docker

```bash
# Frontend
docker build -f frontend/Dockerfile -t fio-condutor-frontend .

# Backend
docker build -f backend/Dockerfile -t fio-condutor-backend .

docker-compose up
```

---

## 📱 Responsividade

- ✅ Mobile (0-639px)
- ✅ Tablet (640-1023px)
- ✅ Desktop (1024px+)

---

## 🔐 Segurança

- ✅ JWT Authentication
- ✅ Protected Routes
- ✅ Input Validation
- ✅ CORS Enabled
- ✅ Environment Variables

---

## 📊 Endpoints da API

### Autenticação

```
POST   /api/auth/login
POST   /api/auth/registrar
GET    /api/auth/perfil
```

### Dados

```
GET    /api/alunos           GET    /api/turmas
POST   /api/alunos           POST   /api/turmas
PUT    /api/alunos/:id       PUT    /api/turmas/:id
DELETE /api/alunos/:id       DELETE /api/turmas/:id

GET    /api/matriculas       GET    /api/pagamentos
POST   /api/matriculas       POST   /api/pagamentos
DELETE /api/matriculas/:id   PUT    /api/pagamentos/:id/status
                             DELETE /api/pagamentos/:id

GET    /api/dashboard/resumo
GET    /api/dashboard/inadimplencia
```

---

## 🛠️ Troubleshooting

### Port 3000 em uso?

```bash
# Use porta diferente
export PORT=3001
npm run dev
```

### Dependências não instaladas?

```bash
rm -r node_modules package-lock.json
npm install
npm run dev
```

### API não conecta?

1. Verifique se backend está rodando
2. Verifique .env.local
3. Veja console do navegador (F12)

**Mais?** Veja [INICIO_RAPIDO.md](./INICIO_RAPIDO.md)

---

## 📝 Estrutura do Projeto

```
fioCondutor/
├── backend/                 ← API Node.js
│   ├── src/
│   ├── prisma/
│   └── package.json
│
├── frontend/                ← Next.js React
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── package.json
│
├── SUMARIO_EXECUTIVO.md     ← O que foi feito
├── INICIO_RAPIDO.md         ← Como começar
├── INDEX.md                 ← Mapa geral
├── GUIA_VISUAL.md           ← Layout das páginas
├── CHECKLIST.md             ← Validação
├── RESUMO_FINAL.md          ← Detalhes técnicos
└── README.md                ← Este arquivo
```

---

## 🎓 Para Começar

### Step 1: Setup

```bash
cd fioCondutor
cd backend && npm install
cd ../frontend && npm install
```

### Step 2: Execute

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

### Step 3: Explore

- Acesse http://localhost:3000
- Crie uma conta
- Explore o dashboard

---

## 🚀 Próximos Passos

- [ ] Adicionar gráficos
- [ ] Exportação de relatórios
- [ ] Notificações em tempo real
- [ ] Tema escuro
- [ ] Suporte offline

---

## 📞 Suporte

### Dúvidas sobre...

**Setup/Instalação**
→ [INICIO_RAPIDO.md](./INICIO_RAPIDO.md)

**O que foi feito**
→ [SUMARIO_EXECUTIVO.md](./SUMARIO_EXECUTIVO.md)

**Mapa do projeto**
→ [INDEX.md](./INDEX.md)

**Layout visual**
→ [GUIA_VISUAL.md](./GUIA_VISUAL.md)

**Código frontend**
→ [frontend/FRONTEND_README.md](./frontend/FRONTEND_README.md)

**Código backend**
→ [backend/README.md](./backend/README.md)

---

## 📄 Licença

MIT License - Livre para usar, modificar e distribuir.

---

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ para **Fio Condutor**

- **Status:** ✅ Production Ready
- **Versão:** 1.0
- **Data:** Dezembro 2024

---

## ⭐ Features Highlights

🌟 **Autenticação completa** com JWT  
🌟 **7 páginas funcionais** totalmente integradas  
🌟 **20+ endpoints** consumidos com sucesso  
🌟 **100% responsivo** em todos os dispositivos  
🌟 **TypeScript** para type safety  
🌟 **Documentação completa** com 8 arquivos

---

**Pronto para usar? Comece em [INICIO_RAPIDO.md](./INICIO_RAPIDO.md)** 🚀

---

_Última atualização: Dezembro 2024_

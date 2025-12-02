# Fio Condutor - Frontend

Frontend moderno para o sistema de gestão de ateliê de costura "Fio Condutor".

## 🚀 Características

- ✅ Autenticação com JWT
- ✅ Dashboard com estatísticas em tempo real
- ✅ CRUD completo de alunos
- ✅ Gestão de turmas
- ✅ Controle de matrículas
- ✅ Gestão de pagamentos e finanças
- ✅ Interface responsiva
- ✅ Design moderno com Tailwind CSS

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Backend do Fio Condutor rodando em http://localhost:3000

## 🛠️ Instalação

1. **Clone e acesse o diretório do frontend:**

```bash
cd frontend
```

2. **Instale as dependências:**

```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env.local` na raiz do projeto (se já não existir):

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🚀 Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📦 Build para Produção

```bash
npm run build
npm run start
# ou
yarn build
yarn start
```

## 🏗️ Estrutura do Projeto

```
frontend/
├── app/
│   ├── (auth)/           # Páginas de autenticação
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/      # Páginas do dashboard
│   │   ├── alunos/
│   │   ├── turmas/
│   │   ├── matriculas/
│   │   ├── pagamentos/
│   │   └── page.tsx      # Dashboard principal
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx          # Redirecionamento inicial
├── components/
│   ├── dashboard-layout.tsx    # Layout do dashboard
│   ├── protected-route.tsx     # Proteção de rotas
│   └── ui/                     # Componentes reutilizáveis
├── lib/
│   ├── api/
│   │   ├── api.ts         # Endpoints da API
│   │   └── client.ts      # Cliente HTTP (Axios)
│   ├── hooks/
│   │   └── use-auth.tsx   # Hook de autenticação
│   └── utils/
│       └── cn.ts          # Utilitários
├── store/
│   └── auth-store.ts      # Estado global (Zustand)
└── package.json
```

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação:

- **Login**: Acesse `/login` para fazer login
- **Registro**: Acesse `/register` para criar uma nova conta
- **Token**: Armazenado em `localStorage` e incluído automaticamente em todas as requisições
- **Proteção**: Rotas do dashboard são protegidas e redirecionam para login se desautenticado

## 🎯 Páginas Principais

### 1. **Login** (`/login`)
- Autenticação com email e senha
- Link para criar nova conta

### 2. **Registro** (`/register`)
- Criação de nova conta
- Validação de campos
- Auto-login após registro

### 3. **Dashboard** (`/dashboard`)
- Estatísticas gerais
- Cards com: Total de Alunos, Turmas Ativas, Matrículas, Arrecadação
- Tabela de pendências de pagamento

### 4. **Alunos** (`/dashboard/alunos`)
- Listar todos os alunos
- Criar novo aluno
- Editar informações
- Deletar aluno
- Busca por nome ou email

### 5. **Turmas** (`/dashboard/turmas`)
- Listar turmas em grid
- Criar nova turma
- Editar detalhes
- Deletar turma
- Status da turma (ativa/inativa)

### 6. **Matrículas** (`/dashboard/matriculas`)
- Listar matrículas
- Matricular novo aluno
- Desmatricular
- Filtrar por status

### 7. **Pagamentos** (`/dashboard/pagamentos`)
- Listar pagamentos
- Registrar novo pagamento
- Marcar como pago
- Filtrar por status (Pendente, Pago, Vencido)

## 🛠️ Tecnologias Utilizadas

- **Next.js 16** - Framework React com SSR
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query** - Gerenciamento de dados
- **Zustand** - Estado global
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones
- **Radix UI** - Componentes base

## 📝 Variáveis de Ambiente

```
# URL da API (obrigatório)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🚧 Próximos Passos

- [ ] Adicionar gráficos de dados (Charts)
- [ ] Relatórios em PDF
- [ ] Exportação de dados (CSV/Excel)
- [ ] Notificações push
- [ ] Tema escuro
- [ ] Suporte offline
- [ ] Integração com WhatsApp
- [ ] Sistema de backup

## 🤝 Contribuindo

Pull requests são bem-vindos. Para mudanças maiores, abra uma issue primeiro.

## 📄 Licença

Este projeto é código aberto e disponível sob a licença MIT.

## 📞 Suporte

Em caso de dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.

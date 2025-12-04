# 🎨 Fio Condutor - Sistema de Gestão do Ateliê Ponto a Ponto

> **Solução simples** para gerenciar alunos, turmas, matrículas e pagamentos de uma escola de corte e costura.

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![Version](https://img.shields.io/badge/version-1.0-blue)
![License](https://img.shields.io/badge/license-Propriet%C3%A1rio-red)

> 🚨 **AVISO LEGAL:** Software proprietário - Todos os direitos reservados.
> Uso, cópia e distribuição proibidos sem autorização. Veja [LICENSE](./LICENSE)

---

## 📋 Índice

- [🚀 Como Usar](#-como-usar)
- [� O que foi Entregue](#-o-que-foi-entregue)
- [✨ Funcionalidades](#-funcionalidades)
- [📄 Licença](#-licença)

---

## 🚀 Como Usar

### 🪟 Windows - Método Rápido

1. **Duplo clique em `start.bat`** na raiz do projeto
2. Aguarde os serviços iniciarem
3. O navegador abrirá automaticamente em http://localhost:3000
4. Faça login ou crie uma conta

**Para parar:** Duplo clique em `stop.bat`

---

### ⚙️ Primeira Execução

Antes de usar o script pela primeira vez:

```bash
# 1. Instale as dependências do backend
cd backend
npm install

# 2. Instale as dependências do frontend
cd ../frontend
npm install

# 3. Configure o banco de dados
cd ../backend
npx prisma migrate dev
```

**Pronto!** Agora use o `start.bat` sempre que quiser executar o sistema.

---

## 📦 O que foi Entregue

### 🖥️ Sistema Completo com 7 Páginas

#### 1. 🔐 **Autenticação**

- **Login** - Acesso ao sistema
- **Registro** - Criar nova conta

#### 2. 📊 **Dashboard**

- Resumo geral do ateliê
- Total de alunos cadastrados
- Quantidade de turmas ativas
- Total de matrículas
- Arrecadação mensal
- Lista de inadimplências

#### 3. 👥 **Gestão de Alunos**

- Visualizar todos os alunos
- Cadastrar novo aluno
- Editar informações
- Excluir aluno
- Buscar por nome ou email

#### 4. 🏫 **Gestão de Turmas**

- Visualizar todas as turmas
- Criar nova turma
- Editar turma (horários, dias, capacidade)
- Excluir turma
- Marcar turma como ativa/inativa

#### 5. 📝 **Controle de Matrículas**

- Matricular aluno em turma
- Ver todas as matrículas
- Desmatricular aluno
- Filtrar por status

#### 6. 💰 **Gestão de Pagamentos**

- Registrar novo pagamento
- Marcar pagamento como pago
- Ver pagamentos pendentes e vencidos
- Filtrar por status (pago/pendente/vencido)
- Excluir pagamento

### ✅ Recursos Implementados

- ✅ **Interface Responsiva** - Funciona em desktop, tablet e celular
- ✅ **Autenticação Segura** - Login com senha criptografada
- ✅ **Busca e Filtros** - Encontre informações rapidamente
- ✅ **Formulários Validados** - Previne erros de entrada
- ✅ **Feedback Visual** - Mensagens de sucesso e erro
- ✅ **Carregamento Suave** - Indicadores de loading
- ✅ **Scripts Automatizados** - Inicie tudo com um clique (Windows)

### 🎨 Design Profissional

- Interface limpa e moderna
- Cores harmoniosas
- Ícones intuitivos
- Layout organizado
- Fácil navegação

---

## Funcionalidades

### 🔐 Login e Segurança

- Login com email e senha
- Registro de novos usuários
- Senha criptografada
- Sessão persistente
- Logout automático em caso de erro

### 👥 Alunos

- Cadastrar novo aluno com todas as informações
- Editar dados dos alunos
- Excluir aluno do sistema
- Buscar aluno por nome ou email
- Ver lista completa de alunos

### 🏫 Turmas

- Criar turmas com horários e dias da semana
- Definir capacidade máxima de alunos
- Editar informações da turma
- Desativar/ativar turmas
- Excluir turmas
- Visualizar turmas em cards organizados

### Matrículas

- Matricular aluno em turma disponível
- Ver todas as matrículas ativas
- Desmatricular aluno
- Filtrar matrículas por status
- Ver histórico de matrículas

### 💰 Pagamentos

- Registrar pagamentos de alunos
- Marcar pagamentos como "pago"
- Ver pagamentos pendentes
- Identificar pagamentos vencidos
- Filtrar por status (pago/pendente/vencido)
- Excluir registros de pagamento
- Acompanhar arrecadação

### 📊 Dashboard Central

- Visualizar total de alunos
- Ver quantidade de turmas ativas
- Conferir total de matrículas
- Acompanhar arrecadação do mês
- Lista de alunos inadimplentes
- Resumo geral do ateliê

---

## 📄 Licença

**SOFTWARE PROPRIETÁRIO - TODOS OS DIREITOS RESERVADOS**

Este software é propriedade exclusiva de André Júnior Lopes Cardoso.

### Proibições:

- ❌ Uso não autorizado
- ❌ Cópia ou reprodução
- ❌ Modificação
- ❌ Distribuição ou compartilhamento
- ❌ Uso comercial

### Contato:

Para solicitar autorização: **work.andrejuniorlopes@gmail.com**

Veja mais em: [LICENSE](./LICENSE) | [NOTICE](./NOTICE)

---

## Desenvolvedor

**André Júnior Lopes Cardoso**

Copyright © 2025 - Todos os direitos reservados

- 🎯 Status: Production Ready
- 📦 Versão: 1.0.0
- 📅 Data: Dezembro 2025

---

## Sobre o Projeto

O **Fio Condutor** é um sistema completo de gestão desenvolvido especialmente para ateliês de costura.

Com ele, você pode:

- ✅ Organizar seus alunos
- ✅ Gerenciar turmas e horários
- ✅ Controlar matrículas
- ✅ Acompanhar pagamentos
- ✅ Ver tudo em um dashboard central

**Simples, rápido e eficiente!** 🎨✂️

---

**Fio Condutor** - Gestão inteligente para seu ateliê 🧵

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

_Última atualização: Dezembro 2025_

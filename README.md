# 🎨 Fio Condutor - Sistema de Gestão do [Ateliê Ponto a Ponto](https://instagram.com/pontoapontomoc)

> **Solução simples** para gerenciar alunos, turmas, matrículas e pagamentos da escola de corte e costura Ponto a Ponto.

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

1. Siga os passos descritos em `SCRIPTS_WINDOWS.md` (incluindo preencher as variáveis de ambiente de exemplo em `backend/.env` e `frontend/.env.local`) antes de executar o `start.bat`.  
2. **Duplo clique em `start.bat`** na raiz do projeto
3. Aguarde os serviços iniciarem
4. O navegador abrirá automaticamente em http://localhost:3000
5. Faça login ou crie uma conta

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

## 📦 O que foi entregue (resumo)

Este repositório contém a API backend e a aplicação frontend do sistema Fio Condutor. Principais entregáveis:

- Autenticação (login e registro)
- Dashboard com métricas e lista de inadimplências
- Gestão de alunos (CRUD e busca)
- Gestão de turmas (CRUD e ativação)
- Controle de matrículas (matricular/desmatricular, filtros)
- Gestão de pagamentos (registrar, marcar como pago, relatórios)

### ✅ Recursos principais

- Interface responsiva e feedbacks visuais
- Autenticação segura (JWT) e senhas criptografadas
- Formulários validados, filtros de busca e ordenação
- Scripts automatizados para iniciar a stack no Windows (`start.bat` / `stop.bat`)
- TypeScript e Prisma para integridade e tipagem

> Para instruções completas de uso e configuração (variáveis de ambiente, build, migrações), veja a seção **Como Usar** acima e o arquivo `SCRIPTS_WINDOWS.md`.

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

O **Fio Condutor** é um sistema completo de gestão desenvolvido especialmente para a escola de corte e costura Ponto a Ponto.

Com ele, você pode:

- ✅ Organizar seus alunos
- ✅ Gerenciar turmas e horários
- ✅ Controlar matrículas
- ✅ Acompanhar pagamentos
- ✅ Ver tudo em um dashboard central

**Simples, rápido e eficiente!** 🎨✂️

---

## ⭐ Features Highlights

🌟 **Autenticação completa** com JWT  
🌟 **7 páginas funcionais** totalmente integradas  
🌟 **20+ endpoints** consumidos com sucesso  
🌟 **100% responsivo** em todos os dispositivos  
🌟 **TypeScript** para type safety  
🌟 **Documentação completa** com 8 arquivos

---

_Última atualização: Dezembro 2025_

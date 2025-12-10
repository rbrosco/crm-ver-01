# 🚀 Guia de Instalação e Uso - CRM React

## ✅ Status da Aplicação

A aplicação está **100% funcional** e configurada com PostgreSQL!

## 📋 Pré-requisitos Instalados

- ✅ Node.js e npm
- ✅ PostgreSQL
- ✅ Todas as dependências instaladas

## 🎯 Acesso Rápido

### Credenciais de Login
```
Username: admin
Password: admin
```

### URLs da Aplicação
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

## 🏃 Como Executar

### Opção 1: Executar Tudo de Uma Vez
```bash
npm run dev:all
```

### Opção 2: Executar Separadamente

**Terminal 1 - Backend:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## 📦 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev              # Inicia frontend (porta 3000)
npm run dev:server       # Inicia backend (porta 3001)
npm run dev:all          # Inicia ambos simultaneamente
```

### Banco de Dados
```bash
npm run prisma:generate  # Gera o cliente Prisma
npm run migrate          # Executa migrações
npm run seed             # Popula banco com dados de teste
npm run prisma:studio    # Abre interface visual do banco
```

### Produção
```bash
npm run build            # Compila para produção
npm run preview          # Visualiza build de produção
```

## 🗄️ Banco de Dados

### Configuração Atual
- **Banco**: PostgreSQL
- **Host**: localhost:5432
- **Database**: crm_db
- **Schema**: public

### Dados de Teste
Após executar `npm run seed`, você terá:
- ✅ 1 usuário admin
- ✅ 3 clientes de exemplo

### Gerenciar Banco de Dados

**Ver dados no Prisma Studio:**
```bash
npm run prisma:studio
```

**Resetar dados:**
```bash
# Limpa todas as tabelas e recria
npm run migrate
npm run seed
```

## 🔧 Variáveis de Ambiente (.env)

```env
# Banco de Dados
DATABASE_URL="postgresql://postgres:senha@localhost:5432/crm_db?schema=public"

# API Google Gemini (para análise IA)
GEMINI_API_KEY=sua_chave_aqui

# Segurança
JWT_SECRET=seu_secret_jwt

# Servidor
PORT=3001
VITE_API_URL=http://localhost:3001/api
```

## 🎨 Funcionalidades Implementadas

### ✅ Frontend
- Dashboard com estatísticas em tempo real
- CRUD completo de clientes
- Filtros por status e dias de assinatura
- Busca e ordenação
- Importação de clientes (CSV)
- Interface responsiva
- Análise com IA (Google Gemini)

### ✅ Backend
- API RESTful com Express
- Autenticação JWT
- Conexão PostgreSQL via Prisma
- Validação de dados
- Tratamento de erros
- CORS configurado

### ✅ Banco de Dados
- PostgreSQL com Prisma ORM
- Migrações automatizadas
- Seeds para dados de teste
- Índices otimizados

## 🧪 Testando a Aplicação

### 1. Verificar se está rodando
```bash
# Verificar processos
ps aux | grep -E "vite|tsx"

# Testar API (se tiver curl)
curl http://localhost:3001/api/health
```

### 2. Testar Login
1. Acesse http://localhost:3000
2. Use: `admin` / `admin`
3. Você verá o dashboard com 3 clientes de exemplo

### 3. Testar Funcionalidades
- ✅ Adicionar novo cliente
- ✅ Editar cliente existente
- ✅ Excluir cliente
- ✅ Filtrar por status
- ✅ Buscar clientes
- ✅ Ver estatísticas

## 📊 Estrutura do Projeto

```
crm-react-ver1/
├── components/           # Componentes React
│   ├── AIAnalystModal.tsx
│   ├── ClientForm.tsx
│   ├── ClientList.tsx
│   ├── Login.tsx
│   └── StatCard.tsx
├── server/              # Backend Node.js
│   ├── routes/
│   │   ├── auth.ts     # Rotas de autenticação
│   │   └── clients.ts  # Rotas de clientes
│   ├── db.ts           # Conexão PostgreSQL
│   ├── index.ts        # Servidor Express
│   ├── seed.ts         # Seeds do banco
│   └── migrate.ts      # Migração de dados
├── prisma/
│   ├── schema.prisma   # Schema do banco
│   └── migrations/     # Migrações
├── src/
│   └── api.ts          # Cliente API frontend
├── App.tsx             # Componente principal
├── index.tsx           # Entry point
└── package.json        # Dependências e scripts
```

## 🐛 Troubleshooting

### Backend não inicia
```bash
# Verificar se PostgreSQL está rodando
pg_isready -h localhost -p 5432

# Verificar logs do servidor
npm run dev:server
```

### Frontend não carrega
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Erro de conexão com banco
```bash
# Verificar variável DATABASE_URL no .env
# Regenerar cliente Prisma
npm run prisma:generate
```

### Porta já em uso
```bash
# Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9

# Matar processo na porta 3001
lsof -ti:3001 | xargs kill -9
```

## 🔐 Segurança

- ✅ Senhas com hash bcrypt
- ✅ JWT para autenticação
- ✅ Variáveis sensíveis em .env
- ✅ .env não versionado (no .gitignore)
- ✅ Validação de dados no backend

## 📝 Próximos Passos

1. Adicione sua chave do Google Gemini no `.env` para usar análise IA
2. Customize o tema e cores no frontend
3. Adicione mais funcionalidades conforme necessário
4. Configure deploy para produção

## 🎉 Tudo Pronto!

A aplicação está 100% funcional. Execute `npm run dev:all` e acesse http://localhost:3000

**Enjoy coding! 🚀**

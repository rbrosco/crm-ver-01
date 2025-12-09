# 🗄️ Migração para PostgreSQL - CRM Dashboard

Este projeto foi atualizado para usar PostgreSQL com Prisma ORM.

## 📋 Pré-requisitos

1. **Node.js** instalado
2. **PostgreSQL** rodando localmente ou use Prisma Postgres

## 🚀 Como Configurar

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

Edite `.env.local` e configure:
- `DATABASE_URL`: URL de conexão do PostgreSQL
- `GEMINI_API_KEY`: Chave da API do Google Gemini
- `JWT_SECRET`: Secret para JWT (mude em produção)

### 3. Iniciar Prisma Postgres (Opção Local)

Se não tem PostgreSQL instalado, use Prisma Postgres:
```bash
npx prisma dev
```

Isso iniciará um servidor PostgreSQL local nas portas 51213-51215.

### 4. Executar Migrations

```bash
npm run migrate
```

Isso criará as tabelas no banco de dados.

### 5. Gerar Prisma Client

```bash
npm run prisma:generate
```

## 🔄 Migrar Dados do localStorage

Se você já tem dados no localStorage do navegador:

### Passo 1: Exportar dados do navegador
1. Abra http://localhost:3000 no navegador
2. Abra o Console (F12)
3. Execute:
```javascript
console.log(JSON.stringify(JSON.parse(localStorage.getItem('crm_clients'))))
```
4. Copie o resultado

### Passo 2: Salvar em arquivo
Salve o JSON copiado em um arquivo `migrate-data.json`

### Passo 3: Executar migração
```bash
MIGRATION_DATA=$(cat migrate-data.json) npm run migrate:data
```

## 🎯 Executar o Projeto

### Modo Desenvolvimento (Frontend + Backend)
```bash
npm run dev:all
```

Isso iniciará:
- Frontend em http://localhost:3000
- Backend API em http://localhost:3001

### Apenas Frontend
```bash
npm run dev
```

### Apenas Backend
```bash
npm run dev:server
```

## 📡 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login

### Clientes
- `GET /api/clients` - Listar todos
- `GET /api/clients/:id` - Buscar por ID
- `POST /api/clients` - Criar novo
- `PUT /api/clients/:id` - Atualizar
- `DELETE /api/clients/:id` - Excluir
- `POST /api/clients/import` - Importar em massa

## 🛠️ Scripts Úteis

```bash
# Rodar migrations
npm run migrate

# Migrar dados do localStorage
npm run migrate:data

# Abrir Prisma Studio (GUI para visualizar DB)
npm run prisma:studio

# Gerar Prisma Client
npm run prisma:generate

# Build para produção
npm run build
```

## 📁 Estrutura do Projeto

```
server/
  ├── index.ts          # Servidor Express
  ├── routes/
  │   ├── auth.ts       # Rotas de autenticação
  │   └── clients.ts    # Rotas de clientes
  └── migrate.ts        # Script de migração

prisma/
  ├── schema.prisma     # Schema do banco
  └── migrations/       # Migrations

src/
  └── api.ts           # Cliente API para frontend
```

## ⚙️ Configuração do Vite

O arquivo `vite.config.ts` foi atualizado para passar as variáveis de ambiente para o frontend.

## 🔐 Segurança

- Todas as rotas de clientes requerem autenticação JWT
- Token é armazenado no localStorage
- Senhas podem ser hasheadas com bcrypt (estrutura pronta)

## 📝 Notas

- O sistema mantém compatibilidade com localStorage como fallback
- A API usa autenticação básica (admin/admin) - expanda conforme necessário
- Índices criados para otimizar queries de vencimento e status de pagamento

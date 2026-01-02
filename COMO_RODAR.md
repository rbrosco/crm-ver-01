# 🚀 Como Rodar o CRM DASHBOARD

## 📋 Pré-requisitos

- Node.js v18+ (recomendado v24+)
- PostgreSQL 12+
- PM2 (para produção)
- npm ou yarn

## 🔧 Configuração Inicial

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Banco de Dados

Edite o arquivo `.env` com suas credenciais do PostgreSQL:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
JWT_SECRET=seu_secret_jwt_aqui
PORT=3001
VITE_API_URL=http://localhost:3001/api
```

### 3. Criar Extensão PostgreSQL

O banco precisa da extensão `pgcrypto` para gerar UUIDs:

```bash
# Conecte ao seu banco e execute:
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

Ou use o comando direto:

```bash
source .env
psql "$DATABASE_URL" -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
```

### 4. Criar Tabelas (Migrations)

```bash
npm run db:push
```

Ou aplique manualmente o SQL em `drizzle/0000_vengeful_blazing_skull.sql`:
psql "$DATABASE_URL" < drizzle/0000_vengeful_blazing_skull.sql
```

### 5. Popular Banco com Dados Iniciais (Seed)

```bash
npm run seed
```

Isso cria:
- Usuário `admin` com senha `admin`
- 3 clientes de exemplo

## 🎯 Executando em Desenvolvimento

### Opção 1: Servidor e Frontend Separados

**Terminal 1 - Backend (API):**
```bash
npm run dev:server
```
- Roda na porta **3001**
- Endpoint: `http://localhost:3001/api`

**Terminal 2 - Frontend (Vite):**
```bash
npm run dev
```
- Roda na porta **3000**
- URL: `http://localhost:3000`
- Proxy automático: `/api` → `http://localhost:3001/api`

### Opção 2: Tudo de Uma Vez

```bash
npm run dev:all
```

## 🏭 Executando em Produção (PM2)

### Configuração PM2

O projeto já está configurado com PM2. Para iniciar ambos os processos:

**1. Iniciar Backend (API):**
```bash
pm2 start npm --name crm-api -- run dev:server
```

**2. Iniciar Frontend (Vite Dev Server):**
```bash
pm2 start npm --name crm-ver-01 -- run dev
```

**3. Verificar Status:**
```bash
pm2 ls
```

Você deve ver:
```
┌────┬────────────┬──────┬───────┬──────────┐
│ id │ name       │ mode │ ↺     │ status   │
├────┼────────────┼──────┼───────┼──────────┤
│ 0  │ crm-api    │ fork │ 0     │ online   │
│ 1  │ crm-ver-01 │ fork │ 0     │ online   │
└────┴────────────┴──────┴───────┴──────────┘
```

**4. Ver Logs:**
```bash
# Logs do backend
pm2 logs crm-api

# Logs do frontend
pm2 logs crm-ver-01

# Todos os logs
pm2 logs
```

**5. Recarregar após mudanças:**
```bash
# Rebuild frontend
npm run build
pm2 reload all --update-env
```

**6. Configurar PM2 para iniciar no boot:**
```

### Teste de Conexão com Banco
```bash
node test/testConnection.js
```
### Teste de Criação de Cliente
```bash
```

## 🔑 Credenciais Padrão

**Login do Sistema:**
- Usuário: `admin`
- Senha: `admin`

## 🌐 URLs de Acesso

**Desenvolvimento:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001/api`
- Health Check: `http://localhost:3001/api/health`

**Produção (se estiver rodando em servidor):**
- Frontend: `http://SEU_IP:3000`
- Backend API: `http://SEU_IP:3001/api`

## 📊 Estrutura das Rotas da API

### Autenticação
- `POST /api/auth/login` - Login (retorna JWT token)

### Clientes
- `GET /api/clients` - Listar todos os clientes
- `GET /api/clients/:id` - Buscar cliente por ID
- `POST /api/clients` - Criar novo cliente
- `PUT /api/clients/:id` - Atualizar cliente
- `DELETE /api/clients/:id` - Excluir cliente
- `POST /api/clients/import` - Importar múltiplos clientes

**Todas as rotas de clientes requerem autenticação via header:**
```
Authorization: Bearer SEU_TOKEN_JWT
```

## 🔧 Comandos Úteis

```bash
# Ver informações do banco
npm run db:studio

# Gerar nova migration
npm run db:generate

# Rebuild do frontend
npm run build

# Preview da build
npm run preview

# Parar processos PM2
pm2 stop all

# Deletar processos PM2
pm2 delete all

# Monitorar processos PM2
pm2 monit
```

## 🐛 Troubleshooting

### Erro: "Erro ao salvar cliente no servidor"

**Causa:** Backend não está rodando ou proxy não configurado.

**Solução:**
1. Verifique se o backend está online:
   ```bash
   curl http://localhost:3001/api/health
   ```

2. Verifique se o proxy está funcionando:
   ```bash
   curl http://localhost:3000/api/health
   ```

3. Reinicie os processos PM2:
   ```bash
   pm2 restart all
   ```

### Erro: "null value in column 'id' violates not-null constraint"

**Causa:** Tabelas criadas sem defaults corretos para UUID.

**Solução:**
```bash
source .env
psql "$DATABASE_URL" -c "ALTER TABLE \"User\" ALTER COLUMN id SET DEFAULT gen_random_uuid();"
1. Limpe cache do navegador (Ctrl+Shift+Del)
2. Rebuild o frontend:
   ```bash
   npm run build
   pm2 reload crm-ver-01
   ```

### Erro de conexão com banco

**Solução:**
1. Verifique se PostgreSQL está rodando:
   ```bash
   systemctl status postgresql
   ```

2. Teste a conexão:
   ```bash
   source .env
   psql "$DATABASE_URL" -c "SELECT 1;"
   ```

3. Verifique as credenciais no `.env`

## 📝 Notas Importantes

- **Segurança:** Mude o `JWT_SECRET` para produção
- **Senha Admin:** Altere a senha padrão após primeiro login
- **CORS:** O backend aceita requisições de qualquer origem (configurar em produção)
- **Proxy Vite:** Em desenvolvimento, o Vite faz proxy de `/api` para `localhost:3001`
- **localStorage:** Tokens JWT são armazenados no localStorage do navegador
- **Dados:** Clientes são salvos APENAS no banco PostgreSQL (não usa localStorage)

## 🎉 Pronto!

Agora você pode acessar `http://localhost:3000` e começar a usar o CRM!

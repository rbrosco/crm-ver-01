#!/bin/bash

echo "==================================="
echo "🧪 Testando API do CRM"
echo "==================================="
echo ""

# Test 1: Health Check
echo "1️⃣ Health Check..."
response=$(wget -qO- http://localhost:3001/api/health 2>&1)
if [ $? -eq 0 ]; then
    echo "✅ API está online"
    echo "   Response: $response"
else
    echo "❌ API não está respondendo"
    exit 1
fi
echo ""

# Test 2: Login
echo "2️⃣ Testando Login (admin/cmldgs@2002025)..."
login_response=$(wget --post-data='{"username":"admin","password":"cmldgs@2002025"}' \
    --header='Content-Type: application/json' \
    -qO- http://localhost:3001/api/auth/login 2>&1)

if echo "$login_response" | grep -q "token"; then
    echo "✅ Login bem-sucedido"
    echo "   Token recebido!"
    
    # Extract token (basic extraction)
    token=$(echo $login_response | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "   Token: ${token:0:50}..."
else
    echo "❌ Falha no login"
    echo "   Response: $login_response"
fi
echo ""

# Test 3: Get Clients (with auth)
if [ ! -z "$token" ]; then
    echo "3️⃣ Buscando clientes (com autenticação)..."
    clients_response=$(wget --header="Authorization: Bearer $token" \
        -qO- http://localhost:3001/api/clients 2>&1)
    
    if [ $? -eq 0 ]; then
        echo "✅ Clientes recuperados com sucesso"
        # Count clients
        client_count=$(echo "$clients_response" | grep -o '"id"' | wc -l)
        echo "   Total de clientes: $client_count"
    else
        echo "❌ Erro ao buscar clientes"
    fi
else
    echo "3️⃣ ⏭️  Pulando teste de clientes (sem token)"
fi
echo ""

echo "==================================="
echo "✅ Testes concluídos!"
echo "==================================="

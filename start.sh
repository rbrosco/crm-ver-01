#!/bin/bash

echo "🚀 Iniciando CRM Application..."
echo ""

# Kill any existing processes
echo "🧹 Limpando processos antigos..."
pkill -f "tsx watch server" 2>/dev/null
pkill -f "vite" 2>/dev/null
sleep 2

# Start backend
echo "🔧 Iniciando backend..."
cd /srv/site/crm-react-ver1
npm run dev:server > /tmp/crm-server.log 2>&1 &
SERVER_PID=$!
echo "   Backend PID: $SERVER_PID"

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Iniciando frontend..."
npm run dev > /tmp/crm-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

# Wait for services to be ready
echo ""
echo "⏳ Aguardando serviços iniciarem..."
sleep 5

# Check if processes are running
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Backend rodando (PID: $SERVER_PID)"
else
    echo "❌ Backend falhou ao iniciar"
    echo "Logs:"
    tail -10 /tmp/crm-server.log
fi

if ps -p $FRONTEND_PID > /dev/null; then
    echo "✅ Frontend rodando (PID: $FRONTEND_PID)"
else
    echo "❌ Frontend falhou ao iniciar"
    echo "Logs:"
    tail -10 /tmp/crm-frontend.log
fi

echo ""
echo "=================================="
echo "🎉 CRM Application Iniciado!"
echo "=================================="
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔌 Backend:  http://localhost:3001"
echo ""
echo "🔑 Login: configure o usuário/admin via ADMIN_PASSWORD ou verifique o arquivo .admin_password (somente administrador)."
echo ""
echo "📋 Ver logs:"
echo "   Backend:  tail -f /tmp/crm-server.log"
echo "   Frontend: tail -f /tmp/crm-frontend.log"
echo ""
echo "🛑 Parar serviços:"
echo "   kill $SERVER_PID $FRONTEND_PID"
echo ""

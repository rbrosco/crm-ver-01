#!/bin/bash

# Iniciar o servidor em segundo plano
npm run dev:server &
SERVER_PID=$!

# Aguardar o servidor inicializar
sleep 3

# Executar o teste
node /srv/site/server/test/createClientTest.js

# Verificar os dados no banco
PGPASSWORD='H8kYpTzX1fCg3vRj7dNmLqB5eA0sWjIu' psql -h localhost -U postgres -d crm_db -c "SELECT * FROM \"Client\";"

# Parar o servidor
kill $SERVER_PID

echo "Teste concluído!"

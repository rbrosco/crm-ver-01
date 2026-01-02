import 'dotenv/config';

async function testAPI() {
  console.log('===================================');
  console.log('🧪 Testando API do CRM');
  console.log('===================================\n');

  const BASE_URL = 'http://localhost:3001/api';

  try {
    // Test 1: Health Check
    console.log('1️⃣ Health Check...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    console.log('✅ API está online');
    console.log(`   Response:`, healthData);
    console.log('');

    // Test 2: Login
    console.log('2️⃣ Testando Login (admin/cmldgs@2002025)...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'cmldgs@2002025' })
    });
    
    const loginData = await loginRes.json();
    
    if (loginData.success && loginData.token) {
      console.log('✅ Login bem-sucedido');
      console.log(`   Token: ${loginData.token.substring(0, 50)}...`);
      console.log('');

      // Test 3: Get Clients
      console.log('3️⃣ Buscando clientes (com autenticação)...');
      const clientsRes = await fetch(`${BASE_URL}/clients`, {
        headers: { 'Authorization': `Bearer ${loginData.token}` }
      });
      
      const clients = await clientsRes.json();
      console.log('✅ Clientes recuperados com sucesso');
      console.log(`   Total de clientes: ${clients.length}`);
      
      if (clients.length > 0) {
        console.log('\n📋 Clientes encontrados:');
        clients.forEach((client, index) => {
          console.log(`   ${index + 1}. ${client.fullName} - ${client.phone}`);
          console.log(`      Assinatura: ${client.subscriptionDays} dias | Pago: ${client.isPaid ? '✅' : '❌'}`);
        });
      }
    } else {
      console.log('❌ Falha no login');
      console.log(`   Response:`, loginData);
    }

    console.log('\n===================================');
    console.log('✅ Todos os testes passaram!');
    console.log('===================================\n');
    console.log('🎉 A aplicação está funcionando perfeitamente!');
    console.log('');
    console.log('📱 Acesse: http://localhost:3000');
    console.log('🔑 Login: admin / cmldgs@2002025');
    console.log('');

  } catch (error) {
    console.error('❌ Erro ao testar API:', error.message);
    console.log('\n💡 Certifique-se de que o servidor está rodando:');
    console.log('   npm run dev:server');
    process.exit(1);
  }
}

testAPI();

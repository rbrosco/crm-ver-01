import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateFromLocalStorage() {
  console.log('🔄 Iniciando migração do localStorage para PostgreSQL...\n');

  // Get data from localStorage (you'll need to paste the JSON here)
  // For now, this is a template - you can run this in the browser console:
  // JSON.stringify(JSON.parse(localStorage.getItem('crm_clients')))
  
  const localStorageData = JSON.parse(process.env.MIGRATION_DATA || '[]');

  if (localStorageData.length === 0) {
    console.log('⚠️  Nenhum dado encontrado para migrar.');
    console.log('\nPara migrar dados do localStorage:');
    console.log('1. Abra o navegador e vá para: http://localhost:3000');
    console.log('2. Abra o Console (F12)');
    console.log('3. Execute: JSON.stringify(JSON.parse(localStorage.getItem("crm_clients")))');
    console.log('4. Copie o resultado e salve em um arquivo migrate-data.json');
    console.log('5. Execute: MIGRATION_DATA=$(cat migrate-data.json) tsx server/migrate.ts\n');
    return;
  }

  try {
    // Import all clients
    const result = await prisma.client.createMany({
      data: localStorageData.map((client: any) => ({
        id: client.id,
        fullName: client.fullName,
        phone: client.phone,
        country: client.country,
        macAddress: client.macAddress,
        entryDate: client.entryDate,
        subscriptionDays: client.subscriptionDays,
        isPaid: client.isPaid
      })),
      skipDuplicates: true
    });

    console.log(`✅ Migração concluída!`);
    console.log(`📊 ${result.count} clientes importados para o PostgreSQL\n`);
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateFromLocalStorage();

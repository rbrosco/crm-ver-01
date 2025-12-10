import 'dotenv/config';
import { db } from './db';
import { users, clients } from './schema';
import bcrypt from 'bcrypt';

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin', 10);
    
    await db.insert(users).values({
      username: 'admin',
      password: hashedPassword,
    }).onConflictDoNothing();

    console.log('✅ Usuário admin criado/atualizado:');
    console.log('   Username: admin');
    console.log('   Password: admin\n');

    // Create some sample clients
    const sampleClients = [
      {
        fullName: 'João Silva',
        phone: '+55 11 98765-4321',
        country: 'Brasil',
        macAddress: '00:1B:44:11:3A:B7',
        entryDate: new Date().toISOString().split('T')[0],
        subscriptionDays: 30,
        isPaid: true,
      },
      {
        fullName: 'Maria Santos',
        phone: '+55 21 91234-5678',
        country: 'Brasil',
        macAddress: 'A4:83:E7:4C:2D:91',
        entryDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        subscriptionDays: 10,
        isPaid: true,
      },
      {
        fullName: 'Pedro Costa',
        phone: '+55 85 99876-5432',
        country: 'Brasil',
        macAddress: '2C:54:91:88:C9:E3',
        entryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        subscriptionDays: 30,
        isPaid: false,
      },
    ];

    await db.insert(clients).values(sampleClients).onConflictDoNothing();

    console.log(`✅ ${sampleClients.length} clientes de exemplo criados\n`);
    console.log('🎉 Seed concluído com sucesso!');
    console.log('\n🚀 Você pode fazer login com:');
    console.log('   Username: admin');
    console.log('   Password: admin\n');

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

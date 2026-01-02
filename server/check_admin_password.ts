import 'dotenv/config';
import bcrypt from 'bcrypt';
import { db } from './db';
import { users } from './schema';
import { eq } from 'drizzle-orm';

async function main() {
  const password = process.env.ADMIN_PASSWORD || process.argv[2];

  try {
    const result = await db.select().from(users).where(eq(users.username, 'admin'));

    if (!result || result.length === 0) {
      console.log('❌ Usuário `admin` não encontrado no banco de dados.');
      process.exit(1);
    }

    const user = result[0];
    console.log('✅ Usuário `admin` encontrado no banco.');

    if (!password) {
      console.log('ℹ️ Senha não fornecida. Passe via `ADMIN_PASSWORD` env ou como argumento para verificar.');
      process.exit(0);
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      console.log('🔒 Senha fornecida CONFERE com o hash armazenado.');
      process.exit(0);
    } else {
      console.log('⚠️ Senha fornecida NÃO confere com o hash armazenado.');
      process.exit(2);
    }
  } catch (err) {
    console.error('❌ Erro ao verificar usuário admin:', err);
    process.exit(3);
  }
}

main();

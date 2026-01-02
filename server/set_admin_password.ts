import 'dotenv/config';
import bcrypt from 'bcrypt';
import { db } from './db';
import { users } from './schema';
import { eq } from 'drizzle-orm';

async function main() {
  const password = process.env.ADMIN_PASSWORD || process.argv[2];

  if (!password) {
    console.error('Erro: for fornecida a senha. Use ADMIN_PASSWORD env ou passe como argumento.');
    process.exit(1);
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    // Try to update existing admin user
    const updated = await db.update(users).set({ password: hashed }).where(eq(users.username, 'admin')).returning();

    if (updated && updated.length > 0) {
      console.log('✅ Senha do usuário admin atualizada com sucesso (hash armazenado).');
    } else {
      // Insert admin user if it does not exist
      await db.insert(users).values({ username: 'admin', password: hashed }).onConflictDoNothing();
      console.log('✅ Usuário admin criado com a senha informada (hash armazenado).');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Erro ao atualizar/criar usuário admin:', err);
    process.exit(2);
  }
}

main();

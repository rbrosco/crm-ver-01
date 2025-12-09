import 'dotenv/config';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;

console.log('Testing database connection...');
console.log('DATABASE_URL:', connectionString);

const pool = new pg.Pool({ connectionString });

try {
  const result = await pool.query('SELECT NOW()');
  console.log('✅ Database connected successfully!');
  console.log('Current time from DB:', result.rows[0].now);
  
  // Test Client table
  const clientsResult = await pool.query('SELECT COUNT(*) FROM "Client"');
  console.log('Number of clients:', clientsResult.rows[0].count);
  
  await pool.end();
  process.exit(0);
} catch (error) {
  console.error('❌ Database connection failed:', error);
  process.exit(1);
}

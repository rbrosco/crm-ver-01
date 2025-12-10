import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

console.log('DATABASE_URL:', connectionString ? 'Loaded successfully' : 'NOT FOUND');

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const pool = new pg.Pool({ 
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test the connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Create Drizzle instance
export const db = drizzle(pool, { schema });

export default pool;

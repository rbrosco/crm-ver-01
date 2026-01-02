import 'dotenv/config';
import axios from 'axios';
import { spawn } from 'child_process';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

console.log('🚀 Starting server...');
const server = spawn('npm', ['run', 'dev:server'], {
  stdio: ['ignore', 'pipe', 'pipe']
});

// Wait for server to start
await new Promise(resolve => {
  server.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(output);
    if (output.includes('Server running')) {
      resolve();
    }
  });
});

console.log('\n✅ Server started, waiting 2 seconds...\n');
await new Promise(resolve => setTimeout(resolve, 2000));

try {
  // Step 1: Login
  console.log('1️⃣  Testing login...');
  const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
    username: 'admin',
    password: 'cmldgs@2002025'
  });
  console.log('✅ Login successful, token obtained');
  const token = loginResponse.data.token;

  // Step 2: Create client
  console.log('\n2️⃣  Testing client creation...');
  const clientResponse = await axios.post('http://localhost:3001/api/clients', {
    fullName: 'John Doe',
    phone: '123456789',
    country: 'USA',
    macAddress: '00:1B:44:11:3A:B7',
    entryDate: '2025-12-07',
    subscriptionDays: 30,
    isPaid: true
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  console.log('✅ Client created successfully:', clientResponse.data);

  // Step 3: Verify in database
  console.log('\n3️⃣  Verifying in database...');
  const result = await pool.query('SELECT * FROM "Client"');
  console.log('✅ Clients in database:', result.rows.length);
  if (result.rows.length > 0) {
    console.log('   Latest client:', result.rows[0]);
  }

  console.log('\n🎉 All tests passed!');
  
} catch (error) {
  console.error('\n❌ Test failed:', error.message);
  if (error.response) {
    console.error('   Response:', error.response.data);
  }
} finally {
  await pool.end();
  server.kill();
  process.exit(0);
}

import axios from 'axios';

(async () => {
  try {
    // Primeiro, fazer login para obter o token
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      username: 'admin',
      password: 'admin'
    });

    const token = loginResponse.data.token;
    console.log('Login successful, token obtained');

    // Depois, criar um cliente usando o token
    const response = await axios.post('http://localhost:3001/api/clients', {
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

    console.log('Client created successfully:', response.data);

    // Verificar se o cliente foi criado consultando todos os clientes
    const clientsResponse = await axios.get('http://localhost:3001/api/clients', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Total clients in database:', clientsResponse.data.length);
    console.log('Clients:', clientsResponse.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
})();
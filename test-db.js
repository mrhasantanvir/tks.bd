const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    console.log('Attempting to connect to MySQL at 127.0.0.1:3306...');
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      database: 'mysql'
    });
    console.log('SUCCESS: Connected to MySQL server!');
    await connection.end();
  } catch (err) {
    console.error('FAILED to connect:');
    console.error(err.message);
  }
}

testConnection();

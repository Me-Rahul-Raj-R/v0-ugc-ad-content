const mysql = require('mysql2/promise');
require('dotenv').config();

const { initializeDatabase, getPool, dbConfig } = require('./config/db');

async function testDatabase() {
  console.log('====================================================');
  console.log('         MySQL Database Connection Test             ');
  console.log('====================================================');
  console.log('Configuration:');
  console.log(`- Host:     ${dbConfig.host}`);
  console.log(`- Port:     ${dbConfig.port}`);
  console.log(`- User:     ${dbConfig.user}`);
  console.log(`- Password: ${dbConfig.password ? '****** (Set)' : '(Empty / None)'}`);
  console.log(`- Database: ${dbConfig.database}`);
  console.log('----------------------------------------------------');

  // Step 1: Test Server Connection
  console.log('\n[1/4] Connecting to MySQL Server...');
  let serverConn;
  try {
    serverConn = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
    });
    const [versionRes] = await serverConn.query('SELECT VERSION() AS version');
    console.log(`[OK] Connected successfully to MySQL server! (Version: ${versionRes[0].version})`);
    await serverConn.end();
  } catch (err) {
    console.error(`[ERROR] Connection failed: ${err.message}`);
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\nTroubleshooting Tip:');
      console.log(`   The MySQL server is running, but access was denied for user "${dbConfig.user}".`);
      console.log('   Please set your MySQL root password in "backend/.env":');
      console.log('   DB_PASSWORD=your_actual_mysql_password\n');
    } else if (err.code === 'ECONNREFUSED') {
      console.log('\nTroubleshooting Tip:');
      console.log(`   MySQL server is not running on ${dbConfig.host}:${dbConfig.port}.`);
      console.log('   Please start the MySQL service or MySQL Workbench.\n');
    }
    process.exit(1);
  }

  // Step 2: Initialize Database and Tables
  console.log('\n[2/4] Initializing Database & Tables...');
  try {
    await initializeDatabase();
    console.log(`[OK] Database "${dbConfig.database}" and tables verified/created.`);
  } catch (err) {
    console.error(`[ERROR] Database initialization failed: ${err.message}`);
    process.exit(1);
  }

  // Step 3: Verify Tables & Counts
  console.log('\n[3/4] Checking Tables and Record Counts...');
  const pool = getPool();
  try {
    const [tables] = await pool.query('SHOW TABLES');
    const tableNames = tables.map(r => Object.values(r)[0]);
    console.log(`   Found ${tableNames.length} tables: ${tableNames.join(', ')}`);

    for (const table of tableNames) {
      const [countResult] = await pool.query(`SELECT COUNT(*) as count FROM \`${table}\``);
      console.log(`   - ${table.padEnd(20)} : ${countResult[0].count} records`);
    }
  } catch (err) {
    console.error(`[ERROR] Table verification failed: ${err.message}`);
    process.exit(1);
  }

  // Step 4: Test Read / Write operation
  console.log('\n[4/4] Testing Read/Write Operations...');
  try {
    const [insertRes] = await pool.query(
      'INSERT INTO products (name, description, category, price) VALUES (?, ?, ?, ?)',
      ['__DB_TEST_PRODUCT__', 'Temporary test product for health check', 'test', '₹0']
    );
    const testId = insertRes.insertId;

    const [selectRes] = await pool.query('SELECT * FROM products WHERE id = ?', [testId]);
    if (selectRes.length === 0) throw new Error('Could not retrieve inserted test record.');

    await pool.query('DELETE FROM products WHERE id = ?', [testId]);
    console.log('[OK] INSERT, SELECT, and DELETE operations completed successfully!');
  } catch (err) {
    console.error(`[ERROR] Read/Write test failed: ${err.message}`);
    process.exit(1);
  }

  console.log('\n====================================================');
  console.log('Database is working properly and ready for use!');
  console.log('====================================================\n');
  process.exit(0);
}

testDatabase();

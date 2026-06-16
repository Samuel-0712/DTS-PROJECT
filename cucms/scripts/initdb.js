// scripts/initdb.js — runs schema.sql then seed.sql against your MySQL server.
// Usage:  node scripts/initdb.js          (schema + seed)
//         node scripts/initdb.js --no-seed (schema only)
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true, // needed to run a whole .sql file at once
  });

  const schema = fs.readFileSync(path.join(__dirname, '..', 'schema.sql'), 'utf8');
  console.log('Applying schema.sql ...');
  await conn.query(schema);

  if (!process.argv.includes('--no-seed')) {
    const seed = fs.readFileSync(path.join(__dirname, '..', 'seed.sql'), 'utf8');
    console.log('Applying seed.sql ...');
    await conn.query(seed);
  }

  console.log('Database initialized.');
  await conn.end();
}

run().catch((err) => { console.error(err); process.exit(1); });

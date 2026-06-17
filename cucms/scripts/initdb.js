// scripts/initdb.js — runs schema.sql then seed.sql translated for SQLite.
// Usage:  node scripts/initdb.js          (schema + seed)
//         node scripts/initdb.js --no-seed (schema only)
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, '..', 'cucms.db');

function stripComments(sql) {
  // Strip block comments (/* ... */)
  let cleaned = sql.replace(/\/\*[\s\S]*?\*\//g, '');
  // Strip single-line comments (-- ...)
  cleaned = cleaned.replace(/--.*$/gm, '');
  return cleaned;
}

async function run() {
  // 1. Delete existing database file if it exists for a clean slate
  if (fs.existsSync(dbPath)) {
    try {
      fs.unlinkSync(dbPath);
      console.log('Removed existing SQLite database file.');
    } catch (err) {
      console.error('Failed to delete existing database file:', err);
    }
  }

  const db = new sqlite3.Database(dbPath);
  
  // Enable foreign keys
  await new Promise((resolve, reject) => {
    db.run('PRAGMA foreign_keys = ON;', (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  // 2. Read and parse schema.sql
  let schema = fs.readFileSync(path.join(__dirname, '..', 'schema.sql'), 'utf8');

  // Strip comments first to prevent splitting on semicolons inside comments
  schema = stripComments(schema);

  // Translate MySQL schema to SQLite
  schema = schema
    .replace(/CREATE DATABASE[\s\S]*?USE cucms;/gi, '') // Remove DB creation & selection
    .replace(/ENGINE\s*=\s*InnoDB/gi, '')               // Remove InnoDB specs
    .replace(/CHARACTER SET[\s\S]*?;/gi, '')            // Remove collation/charset trailing specs
    .replace(/INT AUTO_INCREMENT PRIMARY KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
    .replace(/ENUM\([^)]+\)/gi, 'TEXT')                 // Convert MySQL ENUM to TEXT
    .replace(/DATETIME/gi, 'TEXT');                     // SQLite stores datetimes as TEXT strings

  // Split schema into separate statements
  const schemaStatements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  console.log('Applying schema.sql to SQLite...');
  for (const stmt of schemaStatements) {
    await new Promise((resolve, reject) => {
      db.run(stmt, (err) => {
        if (err) {
          console.error('SQLite execution error on schema statement:', stmt);
          return reject(err);
        }
        resolve();
      });
    });
  }
  console.log('Schema applied successfully.');

  // 3. Read and parse seed.sql
  if (!process.argv.includes('--no-seed')) {
    let seed = fs.readFileSync(path.join(__dirname, '..', 'seed.sql'), 'utf8');

    // Strip comments
    seed = stripComments(seed);

    // Split seed into separate statements
    const seedStatements = seed
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log('Applying seed.sql to SQLite...');
    const variables = {};
    let lastInsertId = null;

    for (let stmt of seedStatements) {
      // Skip USE cucms
      if (/^\s*USE\s+/i.test(stmt)) continue;

      // Handle MySQL user variables: SET @var = val
      const setMatch = stmt.match(/^\s*SET\s+@(\w+)\s*=\s*['"]?([^'"]+)['"]?/i);
      if (setMatch) {
        const varName = setMatch[1];
        let varValue = setMatch[2];
        if (varValue === 'LAST_INSERT_ID()') {
          varValue = lastInsertId;
        }
        variables[varName] = varValue;
        continue;
      }

      // Replace user variables (@pw, @oid) in the statement
      for (const [varName, varValue] of Object.entries(variables)) {
        const regex = new RegExp('@' + varName + '\\b', 'g');
        stmt = stmt.replace(regex, typeof varValue === 'string' ? `'${varValue}'` : varValue);
      }

      // Execute statement
      lastInsertId = await new Promise((resolve, reject) => {
        db.run(stmt, function (err) {
          if (err) {
            console.error('SQLite execution error on seed statement:', stmt);
            return reject(err);
          }
          resolve(this.lastID);
        });
      });
    }
    console.log('Seed data applied successfully.');
  }

  console.log('SQLite database initialization complete.');
  db.close();
}

run().catch((err) => {
  console.error('Database initialization failed:', err);
  process.exit(1);
});

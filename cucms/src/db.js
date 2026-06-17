// src/db.js — SQLite compatibility wrapper that shims mysql2/promise connection pool.
// Translates transactions and sanitizes MySQL-specific query syntax at runtime.
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '..', 'cucms.db');

// Strip FOR UPDATE clauses and translate DATE_FORMAT to strftime
function sanitizeSql(sql) {
  let s = sql.replace(/\s+FOR\s+UPDATE/gi, '');
  s = s.replace(/DATE_FORMAT\(([^,]+),\s*([^)]+)\)/gi, 'strftime($2, $1)');
  return s;
}

// Map SQLite constraint errors to MySQL duplicate entry codes
function mapError(err) {
  if (err && (err.code === 'SQLITE_CONSTRAINT' || (err.message && err.message.includes('UNIQUE')))) {
    err.code = 'ER_DUP_ENTRY';
  }
  return err;
}

// Share a database instance for non-transactional queries
const globalDb = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('CUCMS: Failed to open SQLite database:', err);
});

// Enable foreign keys immediately
globalDb.run('PRAGMA foreign_keys = ON;');

function runQuery(dbInstance, sql, params = []) {
  const cleanSql = sanitizeSql(sql);
  const isSelect = /^\s*SELECT/i.test(cleanSql);

  // Map MySQL weekly date format to SQLite weekly date format
  const mappedParams = params.map(p => {
    if (p === '%x-W%v') return '%Y-W%W';
    return p;
  });

  return new Promise((resolve, reject) => {
    if (isSelect) {
      dbInstance.all(cleanSql, mappedParams, (err, rows) => {
        if (err) return reject(mapError(err));
        resolve(rows);
      });
    } else {
      dbInstance.run(cleanSql, mappedParams, function (err) {
        if (err) return reject(mapError(err));
        resolve({
          insertId: this.lastID,
          affectedRows: this.changes,
          changedRows: this.changes
        });
      });
    }
  });
}

async function query(sql, params = []) {
  return runQuery(globalDb, sql, params);
}

const pool = {
  getConnection: async () => {
    return new Promise((resolve, reject) => {
      const connDb = new sqlite3.Database(dbPath, (err) => {
        if (err) return reject(err);
        connDb.run('PRAGMA foreign_keys = ON;', (pragmaErr) => {
          if (pragmaErr) return reject(pragmaErr);

          const connWrapper = {
            execute: async (sql, params = []) => {
              const res = await runQuery(connDb, sql, params);
              return [res]; // Return array as [result] or [rows] to match mysql2
            },
            beginTransaction: async () => {
              return new Promise((res, rej) => {
                connDb.run('BEGIN TRANSACTION', (err) => {
                  if (err) return rej(err);
                  res();
                });
              });
            },
            commit: async () => {
              return new Promise((res, rej) => {
                connDb.run('COMMIT', (err) => {
                  if (err) return rej(err);
                  res();
                });
              });
            },
            rollback: async () => {
              return new Promise((res, rej) => {
                connDb.run('ROLLBACK', (err) => {
                  if (err) return rej(err);
                  res();
                });
              });
            },
            release: () => {
              connDb.close();
            }
          };
          resolve(connWrapper);
        });
      });
    });
  }
};

module.exports = { pool, query };

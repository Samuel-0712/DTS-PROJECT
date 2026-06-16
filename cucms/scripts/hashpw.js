// scripts/hashpw.js — generate a bcrypt hash for seeding.
// Usage:  node scripts/hashpw.js password123
const bcrypt = require('bcryptjs');
const pw = process.argv[2] || 'password123';
console.log(bcrypt.hashSync(pw, 10));

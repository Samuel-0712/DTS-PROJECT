// src/server.js — application entry point.
const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

// Routes
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/menu',    require('./routes/menu'));
app.use('/api/orders',  require('./routes/orders'));
app.use('/api/prepaid', require('./routes/prepaid'));
app.use('/api/reports', require('./routes/reports'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'cucms' }));

// 404 for anything unmatched
app.use((req, res) => res.status(404).json({ error: 'route not found' }));

// Central error handler — keeps DB internals out of the response.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`CUCMS backend listening on http://localhost:${PORT}`));

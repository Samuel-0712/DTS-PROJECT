// src/routes/menu.js — menu item management.
const express = require('express');
const { query } = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/menu?cafeteria_id=1&available=true   (public list for ordering)
router.get('/', async (req, res, next) => {
  try {
    const { cafeteria_id, available } = req.query;
    let sql = 'SELECT menu_item_id, name, price, is_available, cafeteria_id FROM menu_item';
    const where = [];
    const params = [];
    if (cafeteria_id) { where.push('cafeteria_id = ?'); params.push(cafeteria_id); }
    if (available === 'true') { where.push('is_available = TRUE'); }
    if (where.length) sql += ' WHERE ' + where.join(' AND ');
    sql += ' ORDER BY name';
    res.json(await query(sql, params));
  } catch (err) { next(err); }
});

// POST /api/menu   (managers/admins only)   { name, price, cafeteria_id }
router.post('/', authenticate, authorize('manager', 'admin'), async (req, res, next) => {
  try {
    const { name, price, cafeteria_id } = req.body;
    if (!name || price == null || !cafeteria_id) {
      return res.status(400).json({ error: 'name, price, cafeteria_id are required' });
    }
    if (price < 0) return res.status(400).json({ error: 'price must be >= 0' });
    const rows = await query(
      'INSERT INTO menu_item (name, price, cafeteria_id) VALUES (?, ?, ?)',
      [name, price, cafeteria_id]
    );
    res.status(201).json({ menu_item_id: rows.insertId, name, price, cafeteria_id });
  } catch (err) { next(err); }
});

// PATCH /api/menu/:id   (managers/admins)   { price?, is_available? }
router.patch('/:id', authenticate, authorize('manager', 'admin'), async (req, res, next) => {
  try {
    const { price, is_available } = req.body;
    const sets = [];
    const params = [];
    if (price != null) {
      if (price < 0) return res.status(400).json({ error: 'price must be >= 0' });
      sets.push('price = ?'); params.push(price);
    }
    if (is_available != null) { sets.push('is_available = ?'); params.push(!!is_available); }
    if (!sets.length) return res.status(400).json({ error: 'nothing to update' });
    params.push(req.params.id);
    const rows = await query(
      `UPDATE menu_item SET ${sets.join(', ')} WHERE menu_item_id = ?`, params
    );
    if (rows.affectedRows === 0) return res.status(404).json({ error: 'menu item not found' });
    res.json({ menu_item_id: Number(req.params.id), updated: true });
  } catch (err) { next(err); }
});

module.exports = router;

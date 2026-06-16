// src/routes/reports.js — manager/admin reporting.
const express = require('express');
const { query } = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/reports/sales?period=daily|weekly|monthly
// Sales totals grouped by the chosen period.
router.get('/sales', authenticate, authorize('manager', 'admin'),
  async (req, res, next) => {
    try {
      const period = req.query.period || 'daily';
      const fmt = { daily: '%Y-%m-%d', weekly: '%x-W%v', monthly: '%Y-%m' }[period];
      if (!fmt) return res.status(400).json({ error: 'period must be daily, weekly or monthly' });

      const rows = await query(
        `SELECT DATE_FORMAT(o.placed_at, ?) AS period,
                COUNT(DISTINCT o.order_id)   AS orders,
                SUM(p.amount)                AS revenue
           FROM \`order\` o
           JOIN payment p ON p.order_id = o.order_id
          GROUP BY period
          ORDER BY period DESC`,
        [fmt]
      );
      res.json({ period, rows });
    } catch (err) { next(err); }
  });

// GET /api/reports/top-items?limit=5 — best-selling menu items by quantity
router.get('/top-items', authenticate, authorize('manager', 'admin'),
  async (req, res, next) => {
    try {
      // mysql2's prepared-statement protocol (pool.execute) rejects a bound
      // parameter for LIMIT ("Incorrect arguments to mysqld_stmt_execute"),
      // so coerce to a safe bounded integer and inline it instead.
      const raw = Number(req.query.limit);
      const limit = Number.isFinite(raw) ? Math.min(Math.max(Math.trunc(raw), 1), 50) : 5;
      const rows = await query(
        `SELECT m.menu_item_id, m.name,
                SUM(oi.quantity)                  AS units_sold,
                SUM(oi.quantity * oi.unit_price)  AS revenue
           FROM order_item oi
           JOIN menu_item m ON m.menu_item_id = oi.menu_item_id
          GROUP BY m.menu_item_id, m.name
          ORDER BY units_sold DESC
          LIMIT ${limit}`
      );
      res.json(rows);
    } catch (err) { next(err); }
  });

module.exports = router;

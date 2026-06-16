// src/routes/orders.js — the core transaction of the system.
const express = require('express');
const { pool, query } = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/orders
 * Body: {
 *   items: [{ menu_item_id, quantity }, ...],   // one or more
 *   payment_method: 'cash'|'bank_transfer'|'pos'|'prepaid'
 * }
 * The placing user is taken from the JWT (req.user.id).
 *
 * Business rules enforced here, all inside ONE transaction:
 *  - order must contain >= 1 item
 *  - unit_price is snapshotted from the menu at sale time
 *  - exactly one payment is recorded for the order
 *  - if paying by prepaid: the student's account is debited atomically,
 *    a prepaid_transaction(debit) is recorded, and the balance cannot go negative
 * If any step fails, nothing commits.
 */
router.post('/', authenticate, async (req, res, next) => {
  const { items, payment_method } = req.body;
  const placedBy = req.user.id;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'order must contain at least one item' });
  }
  const validMethods = ['cash', 'bank_transfer', 'pos', 'prepaid'];
  if (!validMethods.includes(payment_method)) {
    return res.status(400).json({ error: `payment_method must be one of ${validMethods.join(', ')}` });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Look up each item's current price and availability (lock rows for safety).
    let total = 0;
    const priced = [];
    for (const line of items) {
      if (!line.menu_item_id || !line.quantity || line.quantity <= 0) {
        throw { status: 400, message: 'each item needs a menu_item_id and a positive quantity' };
      }
      const [rows] = await conn.execute(
        'SELECT price, is_available FROM menu_item WHERE menu_item_id = ? FOR UPDATE',
        [line.menu_item_id]
      );
      if (rows.length === 0) {
        throw { status: 404, message: `menu item ${line.menu_item_id} not found` };
      }
      if (!rows[0].is_available) {
        throw { status: 409, message: `menu item ${line.menu_item_id} is unavailable` };
      }
      const unit = Number(rows[0].price);
      total += unit * line.quantity;
      priced.push({ ...line, unit_price: unit });
    }

    // 2. Create the order (served_by stays NULL until a steward serves it).
    const [orderRes] = await conn.execute(
      'INSERT INTO `order` (placed_by_user_id) VALUES (?)',
      [placedBy]
    );
    const orderId = orderRes.insertId;

    // 3. Insert the order items.
    for (const p of priced) {
      await conn.execute(
        'INSERT INTO order_item (order_id, menu_item_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [orderId, p.menu_item_id, p.quantity, p.unit_price]
      );
    }

    // 4. Handle prepaid payment: debit the student's account atomically.
    if (payment_method === 'prepaid') {
      const [acctRows] = await conn.execute(
        `SELECT pa.prepaid_account_id, pa.balance
           FROM prepaid_account pa
          WHERE pa.student_user_id = ? FOR UPDATE`,
        [placedBy]
      );
      if (acctRows.length === 0) {
        throw { status: 400, message: 'no prepaid account for this user' };
      }
      const acct = acctRows[0];
      if (Number(acct.balance) < total) {
        throw { status: 402, message: 'insufficient prepaid balance' };
      }
      await conn.execute(
        'UPDATE prepaid_account SET balance = balance - ? WHERE prepaid_account_id = ?',
        [total, acct.prepaid_account_id]
      );
      await conn.execute(
        `INSERT INTO prepaid_transaction (prepaid_account_id, txn_type, amount, paid_order_id)
         VALUES (?, 'debit', ?, ?)`,
        [acct.prepaid_account_id, total, orderId]
      );
    }

    // 5. Record the single payment for the order.
    await conn.execute(
      'INSERT INTO payment (order_id, method, amount) VALUES (?, ?, ?)',
      [orderId, payment_method, total]
    );

    await conn.commit();
    res.status(201).json({ order_id: orderId, total, payment_method, items: priced });
  } catch (err) {
    await conn.rollback();
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  } finally {
    conn.release();
  }
});

// PATCH /api/orders/:id/serve   (stewards)  — record who served the order
router.patch('/:id/serve', authenticate, authorize('steward', 'manager', 'admin'),
  async (req, res, next) => {
    try {
      const rows = await query(
        'UPDATE `order` SET served_by_user_id = ? WHERE order_id = ? AND served_by_user_id IS NULL',
        [req.user.id, req.params.id]
      );
      if (rows.affectedRows === 0) {
        return res.status(409).json({ error: 'order not found or already served' });
      }
      res.json({ order_id: Number(req.params.id), served_by: req.user.id });
    } catch (err) { next(err); }
  });

// GET /api/orders/:id  — full order with items and payment
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const [order] = await query(
      `SELECT o.order_id, o.placed_at, o.placed_by_user_id, o.served_by_user_id,
              p.method AS payment_method, p.amount AS payment_amount
         FROM \`order\` o
         LEFT JOIN payment p ON p.order_id = o.order_id
        WHERE o.order_id = ?`,
      [req.params.id]
    );
    if (!order) return res.status(404).json({ error: 'order not found' });
    order.items = await query(
      `SELECT oi.menu_item_id, m.name, oi.quantity, oi.unit_price
         FROM order_item oi JOIN menu_item m ON m.menu_item_id = oi.menu_item_id
        WHERE oi.order_id = ?`,
      [req.params.id]
    );
    res.json(order);
  } catch (err) { next(err); }
});

module.exports = router;

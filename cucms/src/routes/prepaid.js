// src/routes/prepaid.js — prepaid account & transactions.
const express = require('express');
const { pool, query } = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/prepaid/me — the logged-in student's account + recent transactions
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const [acct] = await query(
      'SELECT prepaid_account_id, balance FROM prepaid_account WHERE student_user_id = ?',
      [req.user.id]
    );
    if (!acct) return res.status(404).json({ error: 'no prepaid account for this user' });
    acct.transactions = await query(
      `SELECT prepaid_txn_id, txn_type, amount, created_at, paid_order_id
         FROM prepaid_transaction
        WHERE prepaid_account_id = ?
        ORDER BY created_at DESC LIMIT 50`,
      [acct.prepaid_account_id]
    );
    res.json(acct);
  } catch (err) { next(err); }
});

// POST /api/prepaid/topup  { amount }  — deposit, increasing the balance atomically
router.post('/topup', authenticate, async (req, res, next) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number' });
  }
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.execute(
      'SELECT prepaid_account_id FROM prepaid_account WHERE student_user_id = ? FOR UPDATE',
      [req.user.id]
    );
    if (rows.length === 0) throw { status: 404, message: 'no prepaid account for this user' };
    const acctId = rows[0].prepaid_account_id;

    await conn.execute(
      'UPDATE prepaid_account SET balance = balance + ? WHERE prepaid_account_id = ?',
      [amount, acctId]
    );
    await conn.execute(
      `INSERT INTO prepaid_transaction (prepaid_account_id, txn_type, amount)
       VALUES (?, 'deposit', ?)`,
      [acctId, amount]
    );
    await conn.commit();

    const [updated] = await conn.execute(
      'SELECT balance FROM prepaid_account WHERE prepaid_account_id = ?', [acctId]
    );
    res.json({ prepaid_account_id: acctId, balance: Number(updated[0].balance) });
  } catch (err) {
    await conn.rollback();
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  } finally {
    conn.release();
  }
});

module.exports = router;

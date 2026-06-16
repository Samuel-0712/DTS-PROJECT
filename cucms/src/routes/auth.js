// src/routes/auth.js — login and registration.
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, query } = require('../db');
const { SECRET } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login  { email, password }  -> { token, user }
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }
    const rows = await query(
      'SELECT user_id, user_name, password_hash, role, cafeteria_id FROM `user` WHERE user_email = ?',
      [email]
    );
    const user = rows[0];
    // Same generic message whether the email is unknown or the password is wrong.
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user.user_id, role: user.role, cafeteria_id: user.cafeteria_id },
      SECRET,
      { expiresIn: '8h' }
    );
    res.json({
      token,
      user: { id: user.user_id, name: user.user_name, role: user.role, cafeteria_id: user.cafeteria_id },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/register
//   { name, email, phone, password, role, cafeteria_id, matriculation_no?, staff_type? }
// Creates the USER row and, when role is student/staff, the matching subtype row,
// all inside one transaction so a half-created user can never exist.
router.post('/register', async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const { name, email, phone, password, role, cafeteria_id,
            matriculation_no, staff_type } = req.body;

    if (!name || !email || !password || !role || !cafeteria_id) {
      return res.status(400).json({ error: 'name, email, password, role, cafeteria_id are required' });
    }
    if (role === 'student' && !matriculation_no) {
      return res.status(400).json({ error: 'matriculation_no is required for students' });
    }

    const hash = await bcrypt.hash(password, 10);

    await conn.beginTransaction();
    const [result] = await conn.execute(
      `INSERT INTO \`user\` (user_name, user_email, user_phone_no, password_hash, role, cafeteria_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, phone || null, hash, role, cafeteria_id]
    );
    const userId = result.insertId;

    if (role === 'student') {
      await conn.execute(
        'INSERT INTO student (user_id, matriculation_no) VALUES (?, ?)',
        [userId, matriculation_no]
      );
    } else if (role === 'staff' || role === 'steward' || role === 'cook') {
      await conn.execute(
        'INSERT INTO staff_member (user_id, staff_type) VALUES (?, ?)',
        [userId, staff_type || role]
      );
    }
    await conn.commit();
    res.status(201).json({ id: userId, name, email, role });
  } catch (err) {
    await conn.rollback();
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'A user with that email or matric number already exists' });
    }
    next(err);
  } finally {
    conn.release();
  }
});

module.exports = router;

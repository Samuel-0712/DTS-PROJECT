-- ============================================================
--  CUCMS seed data  —  run AFTER schema.sql
--  Password hashes below are bcrypt for the password "password123"
--  (replace via the app's register endpoint in real use).
-- ============================================================
USE cucms;

-- Cafeterias
INSERT INTO cafeteria (name, location) VALUES
  ('Cafeteria 1', 'Block A, Ground Floor'),
  ('Cafeteria 2', 'Block C, First Floor');

-- Users  (all share the same demo password)
-- IMPORTANT: replace the @pw value below with a REAL bcrypt hash before running.
-- Generate one on your machine:   node scripts/hashpw.js password123
-- then paste its output between the quotes here.
SET @pw = '$2a$10$eF4bSFmJlpQBA4ahARKJte6xOAUJUnB6EBgiQydZk/PcWBygHr/Pa';

INSERT INTO `user` (user_name, user_email, user_phone_no, password_hash, role, cafeteria_id) VALUES
  ('Manager One',   'manager1@cu.edu', '08030000001', @pw, 'manager', 1),
  ('Steward One',   'steward1@cu.edu', '08030000002', @pw, 'steward', 1),
  ('Ada Student',   'ada@cu.edu',      '08030000003', @pw, 'student', 1),
  ('Ben Student',   'ben@cu.edu',      '08030000004', @pw, 'student', 1),
  ('Steward Two',   'steward2@cu.edu', '08030000005', @pw, 'steward', 2),
  ('Cook Staff',    'cook@cu.edu',     '08030000006', @pw, 'staff',   2);

-- Subtype rows
INSERT INTO student (user_id, matriculation_no) VALUES
  (3, '24CG030001'),
  (4, '24CG030002');

INSERT INTO staff_member (user_id, staff_type) VALUES
  (2, 'Steward'),
  (5, 'Steward'),
  (6, 'Cook');

-- Menu items
INSERT INTO menu_item (name, price, cafeteria_id) VALUES
  ('Jollof Rice',     800.00, 1),
  ('Fried Rice',      850.00, 1),
  ('Chicken',         700.00, 1),
  ('Bottled Water',   200.00, 1),
  ('Amala & Ewedu',   750.00, 2),
  ('Beans & Plantain',600.00, 2);

-- A prepaid account for Ada (student user_id = 3) with a starting balance
INSERT INTO prepaid_account (balance, student_user_id) VALUES (5000.00, 3);

-- A sample completed order: Ada orders Jollof + Chicken, served by Steward One,
-- paid by prepaid. (Mirrors what the POST /sales endpoint will do at runtime.)
INSERT INTO `order` (placed_by_user_id, served_by_user_id) VALUES (3, 2);
SET @oid = LAST_INSERT_ID();

INSERT INTO order_item (order_id, menu_item_id, quantity, unit_price) VALUES
  (@oid, 1, 1, 800.00),   -- Jollof Rice
  (@oid, 3, 1, 700.00);   -- Chicken

INSERT INTO payment (order_id, method, amount) VALUES (@oid, 'prepaid', 1500.00);

-- Record the matching prepaid debit and reduce the balance
INSERT INTO prepaid_transaction (prepaid_account_id, txn_type, amount, paid_order_id)
  VALUES (1, 'debit', 1500.00, @oid);
UPDATE prepaid_account SET balance = balance - 1500.00 WHERE prepaid_account_id = 1;

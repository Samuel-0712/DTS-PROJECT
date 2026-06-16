-- ============================================================
--  Covenant University Cafeteria Management System (CUCMS)
--  MySQL schema  —  derived from the normalized (BCNF) relations
-- ============================================================
--  Engine: InnoDB (required for FOREIGN KEY + transaction support)
--  Charset: utf8mb4
-- ============================================================

CREATE DATABASE IF NOT EXISTS cucms
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE cucms;

-- Drop in reverse dependency order so re-running is clean.
DROP TABLE IF EXISTS prepaid_transaction;
DROP TABLE IF EXISTS prepaid_account;
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS order_item;
DROP TABLE IF EXISTS `order`;
DROP TABLE IF EXISTS menu_item;
DROP TABLE IF EXISTS staff_member;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS cafeteria;

-- ------------------------------------------------------------
-- CAFETERIA (cafeteria_id, name, location)
-- ------------------------------------------------------------
CREATE TABLE cafeteria (
  cafeteria_id  INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  location      VARCHAR(150) NOT NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- USER (user_id, user_name, user_email, user_phone_no, cafeteria_id)
--   user_email is a second candidate key  -> UNIQUE
--   role distinguishes login/permission level
--   password_hash supports the authentication requirement
-- ------------------------------------------------------------
CREATE TABLE `user` (
  user_id        INT AUTO_INCREMENT PRIMARY KEY,
  user_name      VARCHAR(100) NOT NULL,
  user_email     VARCHAR(150) NOT NULL UNIQUE,
  user_phone_no  VARCHAR(20),
  password_hash  VARCHAR(255) NOT NULL,
  role           ENUM('student','staff','steward','manager','admin') NOT NULL,
  cafeteria_id   INT NOT NULL,
  CONSTRAINT fk_user_cafeteria
    FOREIGN KEY (cafeteria_id) REFERENCES cafeteria(cafeteria_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- STUDENT (user_id, matriculation_no)   disjoint subtype of USER
-- ------------------------------------------------------------
CREATE TABLE student (
  user_id           INT PRIMARY KEY,
  matriculation_no  VARCHAR(20) NOT NULL UNIQUE,
  CONSTRAINT fk_student_user
    FOREIGN KEY (user_id) REFERENCES `user`(user_id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- STAFF_MEMBER (user_id, staff_type)    disjoint subtype of USER
-- ------------------------------------------------------------
CREATE TABLE staff_member (
  user_id     INT PRIMARY KEY,
  staff_type  VARCHAR(50) NOT NULL,
  CONSTRAINT fk_staff_user
    FOREIGN KEY (user_id) REFERENCES `user`(user_id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- MENU_ITEM (menu_item_id, name, price, cafeteria_id)
--   price must be non-negative (business rule)
--   is_available lets vendors retire items without deleting history
-- ------------------------------------------------------------
CREATE TABLE menu_item (
  menu_item_id  INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  price         DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  is_available  BOOLEAN NOT NULL DEFAULT TRUE,
  cafeteria_id  INT NOT NULL,
  CONSTRAINT fk_menuitem_cafeteria
    FOREIGN KEY (cafeteria_id) REFERENCES cafeteria(cafeteria_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- ORDER (order_id, placed_at, placed_by_user_id, served_by_user_id)
--   NOTE: cafeteria_id intentionally removed (normalization fix —
--   it was the transitive dependency that broke 3NF/BCNF). The
--   order's cafeteria is derived via the serving user when needed.
--   served_by_user_id is NULL until an order is actually served.
-- ------------------------------------------------------------
CREATE TABLE `order` (
  order_id           INT AUTO_INCREMENT PRIMARY KEY,
  placed_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  placed_by_user_id  INT NOT NULL,
  served_by_user_id  INT NULL,
  CONSTRAINT fk_order_placedby
    FOREIGN KEY (placed_by_user_id) REFERENCES `user`(user_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_order_servedby
    FOREIGN KEY (served_by_user_id) REFERENCES `user`(user_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- ORDER_ITEM (order_item_id, order_id, menu_item_id, quantity, unit_price)
--   surrogate PK + composite UNIQUE so an item appears once per order
--   quantity must be positive; unit_price is the snapshot at sale time
-- ------------------------------------------------------------
CREATE TABLE order_item (
  order_item_id  INT AUTO_INCREMENT PRIMARY KEY,
  order_id       INT NOT NULL,
  menu_item_id   INT NOT NULL,
  quantity       INT NOT NULL CHECK (quantity > 0),
  unit_price     DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  CONSTRAINT uq_order_item UNIQUE (order_id, menu_item_id),
  CONSTRAINT fk_orderitem_order
    FOREIGN KEY (order_id) REFERENCES `order`(order_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_orderitem_menuitem
    FOREIGN KEY (menu_item_id) REFERENCES menu_item(menu_item_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- PAYMENT (payment_id, order_id, method, amount)
--   order_id UNIQUE  -> exactly one payment per order (business rule)
--   method enumerated per requirements (cash / transfer / POS / prepaid)
-- ------------------------------------------------------------
CREATE TABLE payment (
  payment_id  INT AUTO_INCREMENT PRIMARY KEY,
  order_id    INT NOT NULL UNIQUE,
  method      ENUM('cash','bank_transfer','pos','prepaid') NOT NULL,
  amount      DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  paid_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payment_order
    FOREIGN KEY (order_id) REFERENCES `order`(order_id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- PREPAID_ACCOUNT (prepaid_account_id, balance, student_user_id)
--   student_user_id UNIQUE -> at most one account per student
--   FK references STUDENT, enforcing "students only" rule
--   balance non-negative
-- ------------------------------------------------------------
CREATE TABLE prepaid_account (
  prepaid_account_id  INT AUTO_INCREMENT PRIMARY KEY,
  balance             DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
  student_user_id     INT NOT NULL UNIQUE,
  CONSTRAINT fk_prepaid_student
    FOREIGN KEY (student_user_id) REFERENCES student(user_id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- PREPAID_TRANSACTION
--   (prepaid_txn_id, prepaid_account_id, txn_type, amount, created_at, [paid_order_id])
--   paid_order_id nullable + UNIQUE -> a debit links to one order,
--     and an order is debited by at most one prepaid transaction
--   CHECK ties txn_type to whether an order is attached
-- ------------------------------------------------------------
CREATE TABLE prepaid_transaction (
  prepaid_txn_id      INT AUTO_INCREMENT PRIMARY KEY,
  prepaid_account_id  INT NOT NULL,
  txn_type            ENUM('deposit','debit') NOT NULL,
  amount              DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paid_order_id       INT NULL UNIQUE,
  CONSTRAINT fk_txn_account
    FOREIGN KEY (prepaid_account_id) REFERENCES prepaid_account(prepaid_account_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  -- RESTRICT (not SET NULL): a debit must always keep its order link, which
  -- the chk_txn_type CHECK below also requires. MySQL 8.0.16+ additionally
  -- forbids a column used by a referential action (SET NULL / ON UPDATE
  -- CASCADE) from also appearing in a CHECK constraint (error 3823).
  CONSTRAINT fk_txn_order
    FOREIGN KEY (paid_order_id) REFERENCES `order`(order_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  -- deposits must NOT reference an order; debits MUST reference one
  CONSTRAINT chk_txn_type CHECK (
    (txn_type = 'deposit' AND paid_order_id IS NULL) OR
    (txn_type = 'debit'   AND paid_order_id IS NOT NULL)
  )
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Helpful indexes for the common lookups
-- ------------------------------------------------------------
CREATE INDEX idx_user_cafeteria      ON `user`(cafeteria_id);
CREATE INDEX idx_menuitem_cafeteria  ON menu_item(cafeteria_id);
CREATE INDEX idx_order_placedby      ON `order`(placed_by_user_id);
CREATE INDEX idx_order_servedby      ON `order`(served_by_user_id);
CREATE INDEX idx_orderitem_order     ON order_item(order_id);
CREATE INDEX idx_txn_account         ON prepaid_transaction(prepaid_account_id);

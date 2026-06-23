# TABLES (VISUAL REPRESENTATION OF CUCMS DATABASE)

This document provides a visual representation of all tables and seeded records inside the **CUCMS SQLite Database**.

## Table: cafeteria

| cafeteria_id | name | location |
| --- | --- | --- |
| 1 | Cafeteria 1 | Block A, Ground Floor |
| 2 | Cafeteria 2 | Block C, First Floor |

---

## Table: user

| user_id | user_name | user_email | user_phone_no | password_hash | role | cafeteria_id |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Manager One | manager1@cu.edu | 08030000001 | $2a$10$eF4bSFmJlpQBA4ahARKJte6xOAUJUnB6EBgiQydZk/PcWBygHr/Pa | manager | 1 |
| 2 | Steward One | steward1@cu.edu | 08030000002 | $2a$10$eF4bSFmJlpQBA4ahARKJte6xOAUJUnB6EBgiQydZk/PcWBygHr/Pa | steward | 1 |
| 3 | Ada Student | ada@cu.edu | 08030000003 | $2a$10$eF4bSFmJlpQBA4ahARKJte6xOAUJUnB6EBgiQydZk/PcWBygHr/Pa | student | 1 |
| 4 | Ben Student | ben@cu.edu | 08030000004 | $2a$10$eF4bSFmJlpQBA4ahARKJte6xOAUJUnB6EBgiQydZk/PcWBygHr/Pa | student | 1 |
| 5 | Steward Two | steward2@cu.edu | 08030000005 | $2a$10$eF4bSFmJlpQBA4ahARKJte6xOAUJUnB6EBgiQydZk/PcWBygHr/Pa | steward | 2 |
| 6 | Cook Staff | cook@cu.edu | 08030000006 | $2a$10$eF4bSFmJlpQBA4ahARKJte6xOAUJUnB6EBgiQydZk/PcWBygHr/Pa | staff | 2 |

---

## Table: student

| user_id | matriculation_no |
| --- | --- |
| 3 | 24CG030001 |
| 4 | 24CG030002 |

---

## Table: staff_member

| user_id | staff_type |
| --- | --- |
| 2 | Steward |
| 5 | Steward |
| 6 | Cook |

---

## Table: prepaid_account

| prepaid_account_id | balance | student_user_id |
| --- | --- | --- |
| 1 | 1900 | 3 |

---

## Table: menu_item

| menu_item_id | name | price | is_available | cafeteria_id |
| --- | --- | --- | --- | --- |
| 1 | Jollof Rice | 800 | 1 | 1 |
| 2 | Fried Rice | 850 | 1 | 1 |
| 3 | Chicken | 700 | 1 | 1 |
| 4 | Bottled Water | 200 | 1 | 1 |
| 5 | Amala & Ewedu | 750 | 1 | 2 |
| 6 | Beans & Plantain | 600 | 1 | 2 |

---

## Table: order

| order_id | placed_at | placed_by_user_id | served_by_user_id |
| --- | --- | --- | --- |
| 1 | 2026-06-17 14:15:44 | 3 | 2 |
| 2 | 2026-06-17 14:17:14 | 3 | 2 |

---

## Table: order_item

| order_item_id | order_id | menu_item_id | quantity | unit_price |
| --- | --- | --- | --- | --- |
| 1 | 1 | 1 | 1 | 800 |
| 2 | 1 | 3 | 1 | 700 |
| 3 | 2 | 1 | 2 | 800 |

---

## Table: payment

| payment_id | order_id | method | amount | paid_at |
| --- | --- | --- | --- | --- |
| 1 | 1 | prepaid | 1500 | 2026-06-17 14:15:44 |
| 2 | 2 | prepaid | 1600 | 2026-06-17 14:17:14 |

---

## Table: prepaid_transaction

| prepaid_txn_id | prepaid_account_id | txn_type | amount | created_at | paid_order_id |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | debit | 1500 | 2026-06-17 14:15:44 | 1 |
| 2 | 1 | debit | 1600 | 2026-06-17 14:17:14 | 2 |

---


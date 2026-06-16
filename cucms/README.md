# CUCMS Backend — Covenant University Cafeteria Management System

A Node + Express + MySQL backend built directly from the group's normalized (BCNF)
schema and functional requirements.

## Stack
- **Node.js / Express** — REST API
- **MySQL** (InnoDB) — relational store, accessed with raw SQL via `mysql2`
- **bcryptjs** — password hashing
- **jsonwebtoken** — auth tokens
- Role-based access control (manager / steward / student / staff / admin)

## Project layout
```
schema.sql            -- the 10 BCNF tables, FKs, constraints, indexes
seed.sql              -- sample cafeterias, users, menu, one paid order
scripts/initdb.js     -- runs schema.sql then seed.sql
src/
  server.js           -- app entry point, wires routes
  db.js               -- MySQL connection pool + query helper
  middleware/auth.js  -- JWT auth + role authorization
  routes/
    auth.js           -- POST /login, /register
    menu.js           -- menu item CRUD (manager-gated writes)
    orders.js         -- place order + pay (the core transaction), serve, fetch
    prepaid.js        -- account balance, top-up, history
    reports.js        -- sales-by-period, top items (manager-only)
```

## Setup
1. Install MySQL 8.0+ (8.0.16+ recommended so CHECK constraints are enforced).
2. `npm install`
3. Copy `.env.example` to `.env` and set your MySQL credentials.
4. Generate a password hash and paste it into `seed.sql` (the `@pw` line):
   ```
   node scripts/hashpw.js password123
   ```
5. Create + seed the database:
   ```
   npm run initdb        # schema + sample data
   # or: node scripts/initdb.js --no-seed
   ```
6. Start the API:
   ```
   npm start             # http://localhost:3000
   ```

## Quick test
Seed users all share the password **password123**.

```bash
# 1. Log in as a student
curl -s -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"ada@cu.edu","password":"password123"}'
# -> copy the "token" from the response

# 2. List Cafeteria 1's available menu
curl -s "http://localhost:3000/api/menu?cafeteria_id=1&available=true"

# 3. Place a prepaid order (uses Ada's seeded balance)
curl -s -X POST http://localhost:3000/api/orders \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"items":[{"menu_item_id":1,"quantity":2}],"payment_method":"prepaid"}'

# 4. Check the updated balance
curl -s http://localhost:3000/api/prepaid/me -H "Authorization: Bearer <TOKEN>"
```

## API reference (summary)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | /api/auth/login | — | get a JWT |
| POST | /api/auth/register | — | create user (+ subtype) |
| GET  | /api/menu | — | list menu items |
| POST | /api/menu | manager | add menu item |
| PATCH| /api/menu/:id | manager | update price / availability |
| POST | /api/orders | any user | place order + pay (atomic) |
| PATCH| /api/orders/:id/serve | steward | mark order served |
| GET  | /api/orders/:id | any user | order with items + payment |
| GET  | /api/prepaid/me | student | balance + transactions |
| POST | /api/prepaid/topup | student | deposit funds |
| GET  | /api/reports/sales | manager | revenue by period |
| GET  | /api/reports/top-items | manager | best sellers |

## How the design maps to the code
- **Normalized relations → tables** in `schema.sql` (note `order` has no
  `cafeteria_id` — that was the transitive dependency removed for BCNF; the
  order's cafeteria is reached through the serving user).
- **Functional requirements → endpoints** (one or more per requirement).
- **Business rules → constraints + transactions**: one-payment-per-order
  (UNIQUE on `payment.order_id`), at-most-one-account-per-student (UNIQUE on
  `prepaid_account.student_user_id`), deposit-vs-debit consistency (CHECK on
  `prepaid_transaction`), and the place-order flow runs as a single SQL
  transaction so stock/payment/balance never end up half-updated.

## Notes / next steps
- MySQL < 8.0.16 ignores CHECK constraints; the critical ones (positive
  amounts, sufficient balance) are also enforced in the app layer, so behavior
  is correct regardless — but upgrade if you can.
- There is no inventory/stock-count table in the supplied schema, so orders do
  not decrement stock. If your spec later adds stock levels, the place-order
  transaction is where that decrement belongs.
- A frontend is out of scope here; the document's "Frontend App" section can
  consume these endpoints.

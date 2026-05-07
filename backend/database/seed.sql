-- Seed data for Work Zone — run after schema.sql.
-- Safe to re-run: every insert is gated by a NOT EXISTS check.

-- Admin account. Default credentials:
--   email:    admin@workzone.com
--   password: Admin@123
-- The bcrypt hash below was generated locally with bcryptjs (cost 10).
-- Change the password after first login by re-hashing and running an UPDATE.
INSERT INTO users
  (full_name, email, phone, password_hash, role, status, address_line, city, pincode)
SELECT
  'Work Zone Admin',
  'admin@workzone.com',
  '9999999999',
  '$2a$10$.CM1IEGtPF5xwmWTiMg92OnymgekZrukkdewioWmooA9pRBRaYcBW',
  'admin',
  'active',
  'HQ',
  'Hyderabad',
  '500081'
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'admin@workzone.com'
);

-- Three demo plans so the public Plans page is not empty.
INSERT INTO plans
  (name, description, price, duration_days, visits_per_month, features, is_active)
SELECT
  'Starter Plan',
  'Light help for a small flat — cleaning and laundry only.',
  1999,
  30,
  4,
  JSON_ARRAY('cleaning', 'laundry'),
  TRUE
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE name = 'Starter Plan');

INSERT INTO plans
  (name, description, price, duration_days, visits_per_month, features, is_active)
SELECT
  'Standard Plan',
  'Best for small families — cleaning, cooking, and laundry.',
  4999,
  30,
  12,
  JSON_ARRAY('cleaning', 'cooking', 'laundry'),
  TRUE
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE name = 'Standard Plan');

INSERT INTO plans
  (name, description, price, duration_days, visits_per_month, features, is_active)
SELECT
  'Premium Plan',
  'Full-service support — everything in Standard plus pet walking and grocery runs.',
  7999,
  30,
  24,
  JSON_ARRAY('cleaning', 'cooking', 'laundry', 'pet_walking', 'grocery_runs'),
  TRUE
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE name = 'Premium Plan');

-- =====================================================
--  Base de datos relacional - Mi Farmacia
-- =====================================================
-- Uso recomendado:
-- 1) Crear DB (una sola vez): CREATE DATABASE mi_farmacia;
-- 2) Conectarte a mi_farmacia en pgAdmin
-- 3) Ejecutar este script completo

BEGIN;

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  firebase_uid VARCHAR(128) UNIQUE,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash TEXT,
  role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS brands (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(120) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_types (
  id BIGSERIAL PRIMARY KEY,
  category_id BIGINT NOT NULL REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(140) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (category_id, name),
  UNIQUE (category_id, slug),
  UNIQUE (id, category_id)
);

CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  brand_id BIGINT NOT NULL REFERENCES brands(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  category_id BIGINT NOT NULL REFERENCES categories(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  type_id BIGINT NOT NULL,
  description TEXT,
  details TEXT,
  benefits JSONB NOT NULL DEFAULT '[]'::jsonb,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url TEXT,
  requires_prescription BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_product_type_by_category
    FOREIGN KEY (type_id, category_id)
    REFERENCES product_types(id, category_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS shopping_carts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id BIGSERIAL PRIMARY KEY,
  cart_id BIGINT NOT NULL REFERENCES shopping_carts(id) ON UPDATE CASCADE ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0 AND quantity <= 20),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (cart_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'completed', 'cancelled')),
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('mercadopago', 'wompi', 'stripe')),
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (total = subtotal - discount)
);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON UPDATE CASCADE ON DELETE SET NULL,
  product_name_snapshot VARCHAR(180) NOT NULL,
  product_brand_snapshot VARCHAR(100),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  line_total NUMERIC(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

CREATE INDEX IF NOT EXISTS idx_products_category_type_active
  ON products (category_id, type_id, is_active);

CREATE INDEX IF NOT EXISTS idx_products_name
  ON products (name);

CREATE INDEX IF NOT EXISTS idx_orders_user_created
  ON orders (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_items_order
  ON order_items (order_id);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart
  ON cart_items (cart_id);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_brands_updated_at ON brands;
CREATE TRIGGER trg_brands_updated_at
BEFORE UPDATE ON brands
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_categories_updated_at ON categories;
CREATE TRIGGER trg_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_product_types_updated_at ON product_types;
CREATE TRIGGER trg_product_types_updated_at
BEFORE UPDATE ON product_types
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_carts_updated_at ON shopping_carts;
CREATE TRIGGER trg_carts_updated_at
BEFORE UPDATE ON shopping_carts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_cart_items_updated_at ON cart_items;
CREATE TRIGGER trg_cart_items_updated_at
BEFORE UPDATE ON cart_items
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

INSERT INTO categories (name, slug)
VALUES
  ('Medicamentos', 'medicamentos'),
  ('Cuidado Personal', 'cuidado-personal'),
  ('Suplementos', 'suplementos'),
  ('Higiene', 'higiene')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO product_types (category_id, name, slug)
VALUES
  ((SELECT id FROM categories WHERE slug = 'medicamentos'), 'Analgésicos', 'analgesicos'),
  ((SELECT id FROM categories WHERE slug = 'medicamentos'), 'Antiinflamatorios', 'antiinflamatorios'),
  ((SELECT id FROM categories WHERE slug = 'medicamentos'), 'Resfríos', 'resfrios'),
  ((SELECT id FROM categories WHERE slug = 'medicamentos'), 'Gastrointestinales', 'gastrointestinales'),
  ((SELECT id FROM categories WHERE slug = 'cuidado-personal'), 'Cabello', 'cabello'),
  ((SELECT id FROM categories WHERE slug = 'higiene'), 'Bucal', 'bucal'),
  ((SELECT id FROM categories WHERE slug = 'suplementos'), 'Vitaminas', 'vitaminas')
ON CONFLICT (category_id, slug) DO NOTHING;

INSERT INTO brands (name)
VALUES
  ('Genfar'),
  ('MK'),
  ('COMTREX'),
  ('American Generics'),
  ('NATURE''S GARDEN')
ON CONFLICT (name) DO NOTHING;

INSERT INTO products (
  name,
  slug,
  brand_id,
  category_id,
  type_id,
  description,
  details,
  benefits,
  price,
  stock,
  image_url,
  requires_prescription,
  is_active
)
VALUES
  (
    'Ibuprofeno 400mg',
    'ibuprofeno-400mg',
    (SELECT id FROM brands WHERE name = 'Genfar'),
    (SELECT id FROM categories WHERE slug = 'medicamentos'),
    (SELECT id FROM product_types WHERE slug = 'analgesicos' AND category_id = (SELECT id FROM categories WHERE slug = 'medicamentos')),
    'Analgésico y antiinflamatorio de rápida acción para dolores y fiebre.',
    '400mg por tableta | 20 tabletas | Recubierto de película',
    '["Alivia dolor", "Reduce inflamación", "Baja fiebre"]'::jsonb,
    6.50,
    120,
    '/images/medicamentos/analgesicos/1)ibuprofeno-400mg.jpg',
    FALSE,
    TRUE
  ),
  (
    'Ibuprofeno 800mg',
    'ibuprofeno-800mg',
    (SELECT id FROM brands WHERE name = 'Genfar'),
    (SELECT id FROM categories WHERE slug = 'medicamentos'),
    (SELECT id FROM product_types WHERE slug = 'analgesicos' AND category_id = (SELECT id FROM categories WHERE slug = 'medicamentos')),
    'Analgésico y antiinflamatorio para dolor intenso y fiebre.',
    '800mg por tableta | 20 tabletas | Recubierto de película',
    '["Alivia dolor intenso", "Reduce inflamación", "Baja fiebre"]'::jsonb,
    9.90,
    80,
    '/images/medicamentos/analgesicos/2)ibuprofeno-800mg.jpg',
    FALSE,
    TRUE
  ),
  (
    'Paracetamol Jarabe Infantil',
    'paracetamol-jarabe-infantil',
    (SELECT id FROM brands WHERE name = 'MK'),
    (SELECT id FROM categories WHERE slug = 'medicamentos'),
    (SELECT id FROM product_types WHERE slug = 'analgesicos' AND category_id = (SELECT id FROM categories WHERE slug = 'medicamentos')),
    'Jarabe infantil para aliviar dolor y fiebre.',
    '120ml | Apto para niños | Fácil dosificación',
    '["Alivia fiebre", "Reduce dolor infantil", "Sabor agradable"]'::jsonb,
    8.50,
    65,
    '/images/medicamentos/analgesicos/4)Paracetamol-Jarabe-Infantil-MK-120Ml.jpg',
    FALSE,
    TRUE
  ),
  (
    'Paracetamol Comprimidos',
    'paracetamol-comprimidos',
    (SELECT id FROM brands WHERE name = 'COMTREX'),
    (SELECT id FROM categories WHERE slug = 'medicamentos'),
    (SELECT id FROM product_types WHERE slug = 'analgesicos' AND category_id = (SELECT id FROM categories WHERE slug = 'medicamentos')),
    'Analgésico rápido para dolores leves y fiebre.',
    '500mg por tableta | 10 comprimidos | Acción rápida',
    '["Alivia dolor rápidamente", "Reduce fiebre", "Fácil de usar"]'::jsonb,
    6.20,
    150,
    '/images/medicamentos/analgesicos/5)Paracetamol-Comprimidos-COMTREX-10Tabletas.jpg',
    FALSE,
    TRUE
  ),
  (
    'Paracetamol Temperyl',
    'paracetamol-temperyl',
    (SELECT id FROM brands WHERE name = 'NATURE''S GARDEN'),
    (SELECT id FROM categories WHERE slug = 'medicamentos'),
    (SELECT id FROM product_types WHERE slug = 'analgesicos' AND category_id = (SELECT id FROM categories WHERE slug = 'medicamentos')),
    'Analgésico para dolor y fiebre.',
    '500mg por tableta | Recubierto',
    '["Alivia dolor", "Reduce fiebre"]'::jsonb,
    7.80,
    90,
    '/images/medicamentos/analgesicos/6)Paracetamol-Temperyl-Tableta-NATURES-GARDEN.jpg',
    FALSE,
    TRUE
  ),
  (
    'Naproxeno 500mg',
    'naproxeno-500mg',
    (SELECT id FROM brands WHERE name = 'American Generics'),
    (SELECT id FROM categories WHERE slug = 'medicamentos'),
    (SELECT id FROM product_types WHERE slug = 'analgesicos' AND category_id = (SELECT id FROM categories WHERE slug = 'medicamentos')),
    'Analgésico y antiinflamatorio de acción prolongada.',
    '500mg por tableta | 10 tabletas recubiertas',
    '["Alivia dolor intenso", "Reduce inflamación", "Acción prolongada"]'::jsonb,
    10.50,
    75,
    '/images/medicamentos/analgesicos/7)comprar-en-cafam-naproxeno-500-mg-caja-con-10-tabletas-recubiertas-precio.jpg',
    FALSE,
    TRUE
  )
ON CONFLICT (slug) DO NOTHING;

CREATE OR REPLACE VIEW v_products_api AS
SELECT
  p.id,
  p.name,
  b.name AS brand,
  p.price,
  p.image_url AS image,
  p.description,
  p.details,
  p.benefits,
  c.name AS category,
  t.name AS type,
  p.stock,
  p.requires_prescription,
  p.is_active
FROM products p
JOIN brands b ON b.id = p.brand_id
JOIN categories c ON c.id = p.category_id
JOIN product_types t ON t.id = p.type_id
WHERE p.is_active = TRUE;

COMMIT;
-- ==========================================
-- SHUDDHAM WELLNESS - FULL DATABASE SETUP
-- Combined Schema + Ayurvedic Catalog Seed
-- ==========================================

-- 1. EXTENSIONS
create extension if not exists "pgcrypto";

-- 2. CUSTOM TYPES (ENUMS)
do $$ 
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('customer', 'admin');
  end if;
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type order_status as enum ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_gateway') then
    create type payment_gateway as enum ('stripe', 'razorpay', 'cod');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type payment_status as enum ('pending', 'paid', 'failed', 'refunded');
  end if;
end $$;

-- 3. UTILITY FUNCTION
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

-- 4. DROP EXISTING TABLES (Reset Schema)
drop table if exists reviews cascade;
drop table if exists order_items cascade;
drop table if exists orders cascade;
drop table if exists addresses cascade;
drop table if exists cart_items cascade;
drop table if exists product_tags cascade;
drop table if exists product_images cascade;
drop table if exists products cascade;
drop table if exists categories cascade;
drop table if exists carts cascade;
drop table if exists users cascade;

-- 5. TABLES

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid not null unique,
  email text not null unique,
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  role user_role not null default 'customer',
  default_address_id uuid,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id)
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text not null,
  image text not null,
  featured boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete restrict,
  slug text not null unique,
  name text not null,
  subtitle text not null,
  short_description text not null,
  description text not null,
  sku text not null unique,
  price integer not null,
  compare_at_price integer,
  currency text not null default 'INR',
  stock integer not null default 0,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  primary_image text,
  certifications jsonb not null default '[]'::jsonb,
  nutrition_highlights jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  rating numeric(3,2) not null default 0,
  review_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  image_url text not null,
  blurhash text,
  alt_text text,
  width integer,
  height integer,
  sort_order integer default 0,
  is_primary boolean default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists product_tags (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  tag text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references carts(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  quantity integer not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique(cart_id, product_id)
);

create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'India',
  label text not null default 'Home',
  is_default boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete restrict,
  address_id uuid references addresses(id) on delete set null,
  order_number text not null unique,
  status order_status not null default 'pending',
  payment_gateway payment_gateway not null,
  payment_status payment_status not null default 'pending',
  subtotal integer not null,
  shipping_amount integer not null default 0,
  discount_amount integer not null default 0,
  tax_amount integer not null default 0,
  total_amount integer not null,
  currency text not null default 'INR',
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  product_slug text not null,
  image text not null,
  quantity integer not null,
  unit_price integer not null,
  total_price integer not null,
  product_snapshot jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  title text not null,
  body text not null,
  rating integer not null check (rating between 1 and 5),
  verified_purchase boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique(user_id, product_id)
);

-- 5. TRUNCATE CATALOG DATA (Ensures only new items show)
TRUNCATE TABLE order_items RESTART IDENTITY CASCADE;
TRUNCATE TABLE reviews RESTART IDENTITY CASCADE;
TRUNCATE TABLE products RESTART IDENTITY CASCADE;
TRUNCATE TABLE categories RESTART IDENTITY CASCADE;

-- 6. INSERT NEW CATEGORIES
INSERT INTO categories (id, name, slug, description, image, featured) VALUES
('c0000000-0000-0000-0000-000000000001', 'Immunity & Health', 'immunity-health', 'Traditional formulations to fortify your natural defenses and overall vitality.', '/assets/images/Screenshot 2026-04-09 224849.png', true),
('c0000000-0000-0000-0000-000000000002', 'Mental Wellness', 'mental-wellness', 'Ayurvedic adaptogens for cognitive clarity, stress relief, and restorative calm.', '/assets/images/Screenshot 2026-04-09 224750.png', true),
('c0000000-0000-0000-0000-000000000003', 'Skin & Beauty', 'skin-beauty', 'Holistic care for a natural, healthy glow using pure botanical extracts.', '/assets/images/Screenshot 2026-04-09 224936.png', true),
('c0000000-0000-0000-0000-000000000004', 'Herbal Teas', 'herbal-teas', 'Soothing infusions of therapeutic herbs designed for mindful daily rituals.', '/assets/images/Screenshot 2026-04-09 224826.png', true);

-- 7. INSERT NEW PRODUCTS
INSERT INTO products (
  id, category_id, slug, name, subtitle, short_description, description, sku, price, compare_at_price, 
  currency, stock, is_active, is_featured, primary_image, certifications, nutrition_highlights, metadata, rating, review_count
) VALUES
-- Mental Wellness
(gen_random_uuid(), 'c0000000-0000-0000-0000-000000000002', 'brahmi-leaf-powder', 'Brahmi Leaf Powder', 'Pure Bacopa Monnieri for Cognitive Support', 'Traditional Herb of Grace ground for mental clarity and memory.', 'Our Brahmi Leaf Powder is sourced from organic farms and air-dried to preserve its vital nutrients. Known as a potent brain tonic, it helps in sharpening focus and reducing mental fatigue.', 'SHUD-MENT-BRA', 399, 449, 'INR', 45, true, true, '/assets/images/Screenshot 2026-04-09 224750.png', '["FSSAI Certified", "Lab Tested"]', '["Bacoside rich"]', '{"weight": "100g"}', 4.8, 56),
(gen_random_uuid(), 'c0000000-0000-0000-0000-000000000002', 'calm-mind-capsules', 'Calm Mind Capsules', 'Advanced Adaptogenic Blend', 'Potent extracts of Shankhpushpi, Brahmi, and Jatamansi.', 'Formulated for modern high-stress lifestyles. These capsules combine traditional brain-soothing herbs to help regulate cortisol and promote deep, restorative sleep.', 'SHUD-MENT-CLM', 499, 599, 'INR', 30, true, true, '/assets/images/Screenshot 2026-04-09 224837.png', '["GMP Certified"]', '["Standardized extracts"]', '{"quantity": "60 Capsules"}', 4.9, 42),
(gen_random_uuid(), 'c0000000-0000-0000-0000-000000000002', 'shankhpushpi-syrup', 'Shankhpushpi Syrup', 'Traditional Brain Tonic for All Ages', 'Enhances memory, concentration, and focus naturally.', 'A classic Ayurvedic formulation used for centuries to support learning and recall. It cools the mind and helps manage exam-day or work-related anxiety.', 'SHUD-MENT-SHK', 249, 299, 'INR', 65, true, false, '/assets/images/Screenshot 2026-04-09 224902.png', '["Ayurvedic Medicine"]', '["Convolvulus extract"]', '{"volume": "200 ml"}', 4.5, 78),

-- Herbal Teas
(gen_random_uuid(), 'c0000000-0000-0000-0000-000000000004', 'tulsi-green-tea', 'Tulsi Green Tea', 'Antioxidant-Rich Holy Basil Blend', 'A refreshing infusion for detox and stress relief.', 'A harmonious blend of fine Green Tea and organic Tulsi leaves. This tea provides a natural energy boost while supporting your body response to everyday stress.', 'SHUD-TEAS-TLS', 199, NULL, 'INR', 120, true, true, '/assets/images/Screenshot 2026-04-09 224826.png', '["Organic Certified"]', '["High EGCG"]', '{"count": "25 Tea Bags"}', 4.7, 89),
(gen_random_uuid(), 'c0000000-0000-0000-0000-000000000004', 'chamomile-dream-tea', 'Chamomile Dream Tea', 'Soothing Whole-Flower Infusion', 'Naturally caffeine-free tea for better sleep.', 'Hand-picked whole Chamomile flowers that release a sweet, apple-like aroma. The perfect night-time ritual for relaxing the nervous system and easing digestion.', 'SHUD-TEAS-CHM', 249, NULL, 'INR', 50, true, false, '/assets/images/Screenshot 2026-04-09 224954.png', '["Non-GMO"]', '["Apigenin rich"]', '{"weight": "50g"}', 4.8, 38),

-- Immunity & Health
(gen_random_uuid(), 'c0000000-0000-0000-0000-000000000001', 'tulsi-immunity-drops', 'Tulsi Immunity Drops', 'Concentrated 5-Species Tulsi Extract', 'Immunity in every drop. Pure liquid Tulsi for water and tea.', 'A concentrated aqueous extract of Rama, Krishna, Kapoor, Van, and Shukla Tulsi. Just 2-3 drops help clear the respiratory tract and strengthen seasonal immunity.', 'SHUD-IMMU-TLS', 199, NULL, 'INR', 200, true, false, '/assets/images/Screenshot 2026-04-09 224849.png', '["FSSAI Certified"]', '["Polyphenol rich"]', '{"volume": "30 ml"}', 4.6, 154),
(gen_random_uuid(), 'c0000000-0000-0000-0000-000000000001', 'amla-vitamin-c', 'Amla Vitamin C Tablets', 'Whole-Food Vitamin C from Wild Amla', 'Daily immunity and skin brightness from nature source.', 'Pure Amla extract tablets that provide a bioavailable form of Vitamin C. Supports collagen production, glowing skin, and robust immune defenses.', 'SHUD-IMMU-AML', 349, 399, 'INR', 90, true, false, '/assets/images/Screenshot 2026-04-09 224924.png', '["100% Vegan"]', '["Whole food C"]', '{"count": "60 Tablets"}', 4.7, 230),
(gen_random_uuid(), 'c0000000-0000-0000-0000-000000000001', 'turmeric-golden-milk', 'Turmeric Golden Milk', 'Curcumin-Rich Healing Blend', 'Instant Haldi Doodh mix with Black Pepper and Ginger.', 'A ready-to-use latte mix with high-curcumin turmeric. The addition of black pepper ensures maximum absorption for its anti-inflammatory benefits.', 'SHUD-IMMU-TUR', 299, 349, 'INR', 75, true, true, '/assets/images/Screenshot 2026-04-09 225004.png', '["Lab Tested"]', '["Piperine added"]', '{"weight": "150g"}', 4.7, 92),
(gen_random_uuid(), 'c0000000-0000-0000-0000-000000000001', 'ashwagandha-root-powder', 'Ashwagandha Root Powder', 'The Vitality Super-Root', 'Strength and stress resilience in its purest form.', 'Pure, raw Ashwagandha root powder known for its adaptogenic power. Helps the body manage cortisol levels and supports physical endurance.', 'SHUD-IMMU-ASH', 449, 499, 'INR', 55, true, true, '/assets/images/Screenshot 2026-04-09 225016.png', '["Organic Roots"]', '["Withanolide rich"]', '{"weight": "200g"}', 4.9, 145),

-- Skin & Beauty
(gen_random_uuid(), 'c0000000-0000-0000-0000-000000000003', 'neem-purifying-mask', 'Neem Purifying Mask', 'Deep Pore Cleansing with Clay & Neem', 'Targets acne and controls excess oil for clear skin.', 'Breathe life into your skin with the potent antibacterial action of Neem and Multani Mitti. This mask pulls out impurities while soothing inflammation and irritation.', 'SHUD-SKIN-NEE', 349, 399, 'INR', 80, true, true, '/assets/images/Screenshot 2026-04-09 224913.png', '["Derm Tested"]', '["Natural clay"]', '{"weight": "100g"}', 4.8, 112),
(gen_random_uuid(), 'c0000000-0000-0000-0000-000000000003', 'saffron-glow-face-oil', 'Saffron Glow Face Oil', 'Kashmiri Kesar & Ancient Herbs', 'Ultra-premium Kumkumadi oil for timeless radiance.', 'Infused with Grade-A Kashmiri Saffron, this face oil penetrates deep into the skin layers to reduce pigmentation, fine lines, and uneven texture.', 'SHUD-SKIN-SAF', 799, 999, 'INR', 25, true, true, '/assets/images/Screenshot 2026-04-09 224936.png', '["Kumkumadi mix"]', '["Kashmiri Saffron"]', '{"volume": "15 ml"}', 4.9, 64),
(gen_random_uuid(), 'c0000000-0000-0000-0000-000000000003', 'aloe-vera-gel', 'Aloe Vera Gel', '99% Pure Hydration for Skin & Hair', 'Multi-purpose soothing gel for cooling and moisture.', 'Cold-stabilized Aloe Vera gel that acts as a natural moisturizer. Perfect for soothing sunburnt skin, hydrating dry patches, or as a light-weight hair mask.', 'SHUD-SKIN-ALO', 199, 249, 'INR', 150, true, false, '/assets/images/Screenshot 2026-04-09 225029.png', '["Paraben Free"]', '["Fresh Aloe"]', '{"volume": "250 ml"}', 4.6, 187);

-- 8. INDEXES & RLS
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_slug on products(slug);
create index if not exists idx_products_active on products(is_active);
create index if not exists idx_products_featured on products(is_featured);

alter table categories enable row level security;
alter table products enable row level security;

do $$ 
begin
  if not exists (select 1 from pg_policies where policyname = 'Anyone can view categories') then
    create policy "Anyone can view categories" on categories for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Anyone can view active products') then
    create policy "Anyone can view active products" on products for select using (is_active = true);
  end if;
end $$;

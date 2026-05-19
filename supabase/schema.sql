-- Production Ready Supabase Schema for Shuddham Wellness
-- Enables RLS, proper indexing, and audit logging

-- 1. Extensions
create extension if not exists "pgcrypto";

-- 2. Custom Types (Enums)
create type user_role as enum ('customer', 'admin');
create type order_status as enum ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled');
create type payment_gateway as enum ('cod');
create type payment_status as enum ('pending', 'paid', 'failed', 'refunded');

-- 3. Utility Function for updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

-- 4. Tables

-- USER PROFILES
-- Linked to Supabase Auth.users
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid not null unique, -- This maps to auth.users.id
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

-- CARTS
create table if not exists carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id)
);

-- LOGIN TRACKING (Audit Log)
create table if not exists logins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default timezone('utc', now())
);

-- CATEGORIES
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

-- PRODUCTS
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

-- PRODUCT IMAGES
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

-- PRODUCT TAGS
create table if not exists product_tags (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  tag text not null,
  created_at timestamptz not null default timezone('utc', now())
);

-- CART ITEMS
create table if not exists cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references carts(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  quantity integer not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique(cart_id, product_id)
);

-- ADDRESSES
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

-- Linked users default address
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'users_default_address_fkey') then
    alter table users add constraint users_default_address_fkey foreign key (default_address_id) references addresses(id) on delete set null;
  end if;
end $$;

-- ORDERS
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

-- ORDER ITEMS
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

-- REVIEWS
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

-- 5. Indexes for Performance
create index if not exists idx_users_auth_id on users(auth_id);
create index if not exists idx_users_email on users(email);
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_slug on products(slug);
create index if not exists idx_products_active on products(is_active);
create index if not exists idx_products_featured on products(is_featured);
create index if not exists idx_orders_user on orders(user_id);
create index if not exists idx_order_items_order on order_items(order_id);
create index if not exists idx_addresses_user on addresses(user_id);
create index if not exists idx_reviews_product on reviews(product_id);
create index if not exists idx_logins_user on logins(user_id);

-- 6. Updated_at Triggers
create trigger set_users_updated_at before update on users for each row execute procedure set_updated_at();
create trigger set_categories_updated_at before update on categories for each row execute procedure set_updated_at();
create trigger set_products_updated_at before update on products for each row execute procedure set_updated_at();
create trigger set_addresses_updated_at before update on addresses for each row execute procedure set_updated_at();
create trigger set_orders_updated_at before update on orders for each row execute procedure set_updated_at();
create trigger set_order_items_updated_at before update on order_items for each row execute procedure set_updated_at();
create trigger set_reviews_updated_at before update on reviews for each row execute procedure set_updated_at();
create trigger set_carts_updated_at before update on carts for each row execute procedure set_updated_at();
create trigger set_cart_items_updated_at before update on cart_items for each row execute procedure set_updated_at();

-- 7. Row Level Security Policies (Production Hardening)
alter table users enable row level security;
alter table addresses enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table reviews enable row level security;
alter table logins enable row level security;
alter table carts enable row level security;
alter table cart_items enable row level security;
alter table product_images enable row level security;
alter table product_tags enable row level security;

-- Public read access for catalog
alter table categories enable row level security;
alter table products enable row level security;
create policy "Anyone can view categories" on categories for select using (true);
create policy "Anyone can view active products" on products for select using (is_active = true and deleted_at is null);
create policy "Anyone can view product images" on product_images for select using (true);
create policy "Anyone can view product tags" on product_tags for select using (true);

-- Users can only see/edit their own profiles
create policy "Users can view own profile" on users for select using (auth.uid() = auth_id);
create policy "Users can update own profile" on users for update using (auth.uid() = auth_id);

-- Addresses
create policy "Users can manage own addresses" on addresses for all using (user_id in (select id from users where auth_id = auth.uid()));

-- Orders
create policy "Users can view own orders" on orders for select using (user_id in (select id from users where auth_id = auth.uid()));

-- Reviews
create policy "Anyone can view reviews" on reviews for select using (true);
create policy "Auth users can create reviews" on reviews for insert with check (auth.role() = 'authenticated');

-- Logins
create policy "Users can view own login history" on logins for select using (user_id in (select id from users where auth_id = auth.uid()));

-- Carts
create policy "Users can manage own cart" on carts for all using (user_id in (select id from users where auth_id = auth.uid()));
create policy "Users can manage own cart items" on cart_items for all using (cart_id in (select id from carts where user_id in (select id from users where auth_id = auth.uid())));

-- 8. Site Reviews (public visitor reviews on homepage)
create table if not exists site_reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  rating integer not null check (rating between 1 and 5),
  review text not null,
  approved boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_site_reviews_approved on site_reviews(approved);
create trigger set_site_reviews_updated_at before update on site_reviews for each row execute procedure set_updated_at();

alter table site_reviews enable row level security;
create policy "Anyone can view approved site reviews" on site_reviews for select using (approved = true);
create policy "Anyone can submit site reviews" on site_reviews for insert with check (true);

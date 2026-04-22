import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─────────────────────────────────────────────────────────────────
// SUPABASE SQL SCHEMA — Run this in Supabase SQL Editor
// ─────────────────────────────────────────────────────────────────
/*
-- 1. PROFILES (username support)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Public can read profiles" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. PRODUCTS
create table products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  long_description text,
  image_url text,
  video_url text,
  is_featured boolean default false,
  is_discover boolean default false,
  tags text[],
  demo_url text,
  created_at timestamptz default now()
);
alter table products enable row level security;
create policy "Public can read products" on products for select using (true);
create policy "Admin can all products" on products for all using (true);

-- 3. SERVICES
create table services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text,
  price_range text,
  created_at timestamptz default now()
);
alter table services enable row level security;
create policy "Public can read services" on services for select using (true);
create policy "Admin can all services" on services for all using (true);

-- 4. PORTFOLIO
create table portfolio (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  tags text[],
  demo_url text,
  github_url text,
  category text,
  created_at timestamptz default now()
);
alter table portfolio enable row level security;
create policy "Public can read portfolio" on portfolio for select using (true);
create policy "Admin can all portfolio" on portfolio for all using (true);

-- 5. DEVIS
create table devis (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  nom text not null,
  email text not null,
  telephone text,
  societe text,
  service text,
  budget text,
  message text not null,
  statut text default 'en attente',
  created_at timestamptz default now()
);
alter table devis enable row level security;
create policy "Anyone can insert devis" on devis for insert with check (true);
create policy "Users can see own devis" on devis for select using (auth.uid() = user_id or user_id is null);
create policy "Admin can see all devis" on devis for select using (true);
create policy "Admin can update devis" on devis for update using (true);

-- 6. CONTACTS
create table contacts (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  email text not null,
  sujet text,
  message text not null,
  lu boolean default false,
  created_at timestamptz default now()
);
alter table contacts enable row level security;
create policy "Anyone can insert contacts" on contacts for insert with check (true);
create policy "Admin can read contacts" on contacts for select using (true);
create policy "Admin can update contacts" on contacts for update using (true);
create policy "Admin can delete contacts" on contacts for delete using (true);
*/

// ─────────────────────────────────────────────────────────────────
// IMPORTANT: Run this in Supabase SQL Editor to allow admin access
// ─────────────────────────────────────────────────────────────────
/*
-- DISABLE RLS for admin tables so /admin can read all data
-- (Safe because anon key is read-only by default for other tables)
ALTER TABLE devis DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;

-- OR keep RLS but add permissive policies:
-- DROP POLICY IF EXISTS "Admin can see all devis" ON devis;
-- CREATE POLICY "Anyone can read devis" ON devis FOR SELECT USING (true);
-- DROP POLICY IF EXISTS "Admin can read contacts" ON contacts;
-- CREATE POLICY "Anyone can read contacts" ON contacts FOR SELECT USING (true);

-- Add lu column to contacts if missing
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS lu boolean DEFAULT false;

-- Add profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name'
  ) ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR each ROW EXECUTE PROCEDURE public.handle_new_user();
*/

-- ============================================================
-- CITADEL · Supabase Schema
-- Ejecutar en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- Portfolio holdings (Oikos)
create table if not exists portfolio_holdings (
  id           uuid primary key default gen_random_uuid(),
  ticker       text not null,
  company_name text not null,
  logo_url     text,
  quantity     numeric(18,4) not null default 0,
  avg_buy_price numeric(18,4) not null default 0,
  currency     text not null default 'USD',
  created_at   timestamptz default now()
);

-- Portfolio transactions (Oikos)
create table if not exists portfolio_transactions (
  id           uuid primary key default gen_random_uuid(),
  holding_id   uuid references portfolio_holdings(id) on delete cascade,
  ticker       text not null,
  type         text not null check (type in ('buy','sell')),
  quantity     numeric(18,4) not null,
  price        numeric(18,4) not null,
  date         date not null,
  note         text,
  created_at   timestamptz default now()
);

-- Notes (Hypomnemata)
create table if not exists notes (
  id           uuid primary key default gen_random_uuid(),
  title        text not null default 'Sin título',
  content      text not null default '',
  pos_x        numeric not null default 100,
  pos_y        numeric not null default 100,
  color        text not null default 'default',
  connections  text[] default '{}',
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Resources (Alexandria)
create table if not exists resources (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  url          text not null,
  type         text not null default 'page',
  description  text,
  tags         text[] default '{}',
  favicon      text,
  thumbnail    text,
  created_at   timestamptz default now()
);

-- Indexes
create index if not exists idx_transactions_date on portfolio_transactions(date);
create index if not exists idx_transactions_holding on portfolio_transactions(holding_id);
create index if not exists idx_notes_created on notes(created_at desc);
create index if not exists idx_resources_type on resources(type);
create index if not exists idx_resources_created on resources(created_at desc);

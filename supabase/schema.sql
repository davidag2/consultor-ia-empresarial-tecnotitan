create extension if not exists pgcrypto;

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text,
  preferred_language text not null default 'es'
    check (preferred_language in ('es', 'en', 'pt')),
  contact_name text,
  contact_email text,
  created_at timestamptz not null default now()
);

create table if not exists public.diagnostic_modules (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_es text not null,
  name_en text not null,
  name_pt text not null,
  price_cop integer not null check (price_cop > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  purchase_type text not null check (purchase_type in ('single_module', 'full_package')),
  amount_cop integer not null check (amount_cop > 0),
  currency text not null default 'COP',
  payment_provider text not null default 'manual'
    check (payment_provider in ('manual', 'fastspring')),
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  external_payment_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.purchase_modules (
  purchase_id uuid not null references public.purchases(id) on delete cascade,
  module_id uuid not null references public.diagnostic_modules(id),
  primary key (purchase_id, module_id)
);

create table if not exists public.diagnostic_sessions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  module_id uuid not null references public.diagnostic_modules(id),
  language text not null check (language in ('es', 'en', 'pt')),
  status text not null default 'scheduled'
    check (status in ('scheduled', 'in_progress', 'completed', 'cancelled')),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.diagnostic_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.diagnostic_sessions(id) on delete cascade,
  question_key text not null,
  question_text text not null,
  answer_text text not null,
  answer_transcript_language text not null check (answer_transcript_language in ('es', 'en', 'pt')),
  created_at timestamptz not null default now()
);

create table if not exists public.diagnostic_reports (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.diagnostic_sessions(id) on delete cascade,
  overall_score numeric(5,2) not null check (overall_score >= 0 and overall_score <= 100),
  executive_summary text not null,
  opportunities jsonb not null default '[]'::jsonb,
  risks jsonb not null default '[]'::jsonb,
  action_plan jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.companies enable row level security;
alter table public.diagnostic_modules enable row level security;
alter table public.purchases enable row level security;
alter table public.purchase_modules enable row level security;
alter table public.diagnostic_sessions enable row level security;
alter table public.diagnostic_answers enable row level security;
alter table public.diagnostic_reports enable row level security;

insert into public.diagnostic_modules (slug, name_es, name_en, name_pt, price_cop)
values
  ('sales', 'Ventas', 'Sales', 'Vendas', 100000),
  ('operations', 'Operaciones', 'Operations', 'Operacoes', 100000),
  ('finance', 'Finanzas', 'Finance', 'Financas', 100000),
  ('marketing', 'Marketing', 'Marketing', 'Marketing', 100000),
  ('technology_ai', 'Tecnologia e IA', 'Technology and AI', 'Tecnologia e IA', 100000)
on conflict (slug) do update set
  name_es = excluded.name_es,
  name_en = excluded.name_en,
  name_pt = excluded.name_pt,
  price_cop = excluded.price_cop,
  is_active = true;

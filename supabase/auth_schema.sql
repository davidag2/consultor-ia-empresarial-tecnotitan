create type public.app_role as enum ('entrepreneur', 'consultant', 'admin');

create schema if not exists app_private;

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.app_role not null default 'entrepreneur',
  preferred_language text not null default 'es'
    check (preferred_language in ('es', 'en', 'pt')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_memberships (
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  role public.app_role not null default 'entrepreneur',
  created_at timestamptz not null default now(),
  primary key (company_id, user_id)
);

alter table public.user_profiles enable row level security;
alter table public.company_memberships enable row level security;

create or replace function app_private.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_profiles_touch_updated_at on public.user_profiles;
create trigger user_profiles_touch_updated_at
before update on public.user_profiles
for each row execute function app_private.touch_updated_at();

create or replace function app_private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, full_name, preferred_language)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'preferred_language', ''), 'es')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function app_private.handle_new_user();

create or replace function app_private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

create or replace function app_private.can_access_company(target_company_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(app_private.is_admin(), false)
    or exists (
      select 1
      from public.company_memberships
      where company_id = target_company_id
        and user_id = (select auth.uid())
    );
$$;

drop policy if exists "profiles_select_own_or_admin" on public.user_profiles;
create policy "profiles_select_own_or_admin"
on public.user_profiles
for select
to authenticated
using (
  id = (select auth.uid())
  or (select app_private.is_admin())
);

drop policy if exists "profiles_update_own_or_admin" on public.user_profiles;
create policy "profiles_update_own_or_admin"
on public.user_profiles
for update
to authenticated
using (
  id = (select auth.uid())
  or (select app_private.is_admin())
)
with check (
  id = (select auth.uid())
  or (select app_private.is_admin())
);

drop policy if exists "memberships_select_own_or_admin" on public.company_memberships;
create policy "memberships_select_own_or_admin"
on public.company_memberships
for select
to authenticated
using (
  user_id = (select auth.uid())
  or (select app_private.is_admin())
);

drop policy if exists "memberships_admin_all" on public.company_memberships;
create policy "memberships_admin_all"
on public.company_memberships
for all
to authenticated
using ((select app_private.is_admin()))
with check ((select app_private.is_admin()));

drop policy if exists "companies_select_member_or_admin" on public.companies;
create policy "companies_select_member_or_admin"
on public.companies
for select
to authenticated
using ((select app_private.can_access_company(id)));

drop policy if exists "companies_insert_authenticated" on public.companies;
create policy "companies_insert_authenticated"
on public.companies
for insert
to authenticated
with check ((select auth.uid()) is not null);

drop policy if exists "companies_update_member_or_admin" on public.companies;
create policy "companies_update_member_or_admin"
on public.companies
for update
to authenticated
using ((select app_private.can_access_company(id)))
with check ((select app_private.can_access_company(id)));

drop policy if exists "modules_select_authenticated" on public.diagnostic_modules;
create policy "modules_select_authenticated"
on public.diagnostic_modules
for select
to authenticated
using (is_active = true);

drop policy if exists "purchases_select_member_or_admin" on public.purchases;
create policy "purchases_select_member_or_admin"
on public.purchases
for select
to authenticated
using ((select app_private.can_access_company(company_id)));

drop policy if exists "purchases_insert_member_or_admin" on public.purchases;
create policy "purchases_insert_member_or_admin"
on public.purchases
for insert
to authenticated
with check ((select app_private.can_access_company(company_id)));

drop policy if exists "purchase_modules_select_member_or_admin" on public.purchase_modules;
create policy "purchase_modules_select_member_or_admin"
on public.purchase_modules
for select
to authenticated
using (
  exists (
    select 1
    from public.purchases
    where purchases.id = purchase_modules.purchase_id
      and (select app_private.can_access_company(purchases.company_id))
  )
);

drop policy if exists "sessions_select_member_or_admin" on public.diagnostic_sessions;
create policy "sessions_select_member_or_admin"
on public.diagnostic_sessions
for select
to authenticated
using ((select app_private.can_access_company(company_id)));

drop policy if exists "sessions_insert_member_or_admin" on public.diagnostic_sessions;
create policy "sessions_insert_member_or_admin"
on public.diagnostic_sessions
for insert
to authenticated
with check ((select app_private.can_access_company(company_id)));

drop policy if exists "answers_select_session_member_or_admin" on public.diagnostic_answers;
create policy "answers_select_session_member_or_admin"
on public.diagnostic_answers
for select
to authenticated
using (
  exists (
    select 1
    from public.diagnostic_sessions
    where diagnostic_sessions.id = diagnostic_answers.session_id
      and (select app_private.can_access_company(diagnostic_sessions.company_id))
  )
);

drop policy if exists "answers_insert_session_member_or_admin" on public.diagnostic_answers;
create policy "answers_insert_session_member_or_admin"
on public.diagnostic_answers
for insert
to authenticated
with check (
  exists (
    select 1
    from public.diagnostic_sessions
    where diagnostic_sessions.id = diagnostic_answers.session_id
      and (select app_private.can_access_company(diagnostic_sessions.company_id))
  )
);

drop policy if exists "reports_select_session_member_or_admin" on public.diagnostic_reports;
create policy "reports_select_session_member_or_admin"
on public.diagnostic_reports
for select
to authenticated
using (
  exists (
    select 1
    from public.diagnostic_sessions
    where diagnostic_sessions.id = diagnostic_reports.session_id
      and (select app_private.can_access_company(diagnostic_sessions.company_id))
  )
);

create index if not exists user_profiles_role_idx
on public.user_profiles (role);

create index if not exists company_memberships_user_id_idx
on public.company_memberships (user_id);

create index if not exists company_memberships_company_id_idx
on public.company_memberships (company_id);


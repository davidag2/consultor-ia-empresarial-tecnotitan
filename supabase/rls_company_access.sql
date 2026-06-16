alter table public.companies
add column if not exists owner_user_id uuid references public.user_profiles(id) on delete set null;

create index if not exists companies_owner_user_id_idx
on public.companies (owner_user_id);

create or replace function app_private.handle_new_company_membership()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.owner_user_id is not null then
    insert into public.company_memberships (company_id, user_id, role)
    values (new.id, new.owner_user_id, 'entrepreneur')
    on conflict (company_id, user_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_company_created_add_owner_membership on public.companies;
create trigger on_company_created_add_owner_membership
after insert on public.companies
for each row execute function app_private.handle_new_company_membership();

drop policy if exists "companies_insert_authenticated" on public.companies;
create policy "companies_insert_owner"
on public.companies
for insert
to authenticated
with check (
  owner_user_id = (select auth.uid())
  or (select app_private.is_admin())
);

drop policy if exists "companies_update_member_or_admin" on public.companies;
create policy "companies_update_owner_consultant_or_admin"
on public.companies
for update
to authenticated
using (
  (select app_private.is_admin())
  or exists (
    select 1
    from public.company_memberships
    where company_memberships.company_id = companies.id
      and company_memberships.user_id = (select auth.uid())
      and company_memberships.role in ('entrepreneur', 'consultant', 'admin')
  )
)
with check (
  (select app_private.is_admin())
  or exists (
    select 1
    from public.company_memberships
    where company_memberships.company_id = companies.id
      and company_memberships.user_id = (select auth.uid())
      and company_memberships.role in ('entrepreneur', 'consultant', 'admin')
  )
);

drop policy if exists "memberships_admin_all" on public.company_memberships;
create policy "memberships_admin_all"
on public.company_memberships
for all
to authenticated
using ((select app_private.is_admin()))
with check ((select app_private.is_admin()));

drop policy if exists "memberships_owner_can_insert_consultants" on public.company_memberships;
create policy "memberships_owner_can_insert_consultants"
on public.company_memberships
for insert
to authenticated
with check (
  role = 'consultant'
  and exists (
    select 1
    from public.company_memberships existing
    where existing.company_id = company_memberships.company_id
      and existing.user_id = (select auth.uid())
      and existing.role in ('entrepreneur', 'admin')
  )
);

drop policy if exists "memberships_owner_can_update_consultants" on public.company_memberships;
create policy "memberships_owner_can_update_consultants"
on public.company_memberships
for update
to authenticated
using (
  role = 'consultant'
  and exists (
    select 1
    from public.company_memberships existing
    where existing.company_id = company_memberships.company_id
      and existing.user_id = (select auth.uid())
      and existing.role in ('entrepreneur', 'admin')
  )
)
with check (
  role = 'consultant'
  and exists (
    select 1
    from public.company_memberships existing
    where existing.company_id = company_memberships.company_id
      and existing.user_id = (select auth.uid())
      and existing.role in ('entrepreneur', 'admin')
  )
);

drop policy if exists "memberships_owner_can_remove_consultants" on public.company_memberships;
create policy "memberships_owner_can_remove_consultants"
on public.company_memberships
for delete
to authenticated
using (
  role = 'consultant'
  and exists (
    select 1
    from public.company_memberships existing
    where existing.company_id = company_memberships.company_id
      and existing.user_id = (select auth.uid())
      and existing.role in ('entrepreneur', 'admin')
  )
);

drop policy if exists "purchase_modules_insert_member_or_admin" on public.purchase_modules;
create policy "purchase_modules_insert_member_or_admin"
on public.purchase_modules
for insert
to authenticated
with check (
  exists (
    select 1
    from public.purchases
    where purchases.id = purchase_modules.purchase_id
      and (select app_private.can_access_company(purchases.company_id))
  )
);

drop policy if exists "purchase_modules_delete_admin" on public.purchase_modules;
create policy "purchase_modules_delete_admin"
on public.purchase_modules
for delete
to authenticated
using ((select app_private.is_admin()));

drop policy if exists "sessions_update_member_or_admin" on public.diagnostic_sessions;
create policy "sessions_update_member_or_admin"
on public.diagnostic_sessions
for update
to authenticated
using ((select app_private.can_access_company(company_id)))
with check ((select app_private.can_access_company(company_id)));

drop policy if exists "reports_insert_admin_or_consultant" on public.diagnostic_reports;
create policy "reports_insert_admin_or_consultant"
on public.diagnostic_reports
for insert
to authenticated
with check (
  (select app_private.is_admin())
  or exists (
    select 1
    from public.diagnostic_sessions
    join public.company_memberships
      on company_memberships.company_id = diagnostic_sessions.company_id
    where diagnostic_sessions.id = diagnostic_reports.session_id
      and company_memberships.user_id = (select auth.uid())
      and company_memberships.role in ('consultant', 'admin')
  )
);

drop policy if exists "reports_update_admin_or_consultant" on public.diagnostic_reports;
create policy "reports_update_admin_or_consultant"
on public.diagnostic_reports
for update
to authenticated
using (
  (select app_private.is_admin())
  or exists (
    select 1
    from public.diagnostic_sessions
    join public.company_memberships
      on company_memberships.company_id = diagnostic_sessions.company_id
    where diagnostic_sessions.id = diagnostic_reports.session_id
      and company_memberships.user_id = (select auth.uid())
      and company_memberships.role in ('consultant', 'admin')
  )
)
with check (
  (select app_private.is_admin())
  or exists (
    select 1
    from public.diagnostic_sessions
    join public.company_memberships
      on company_memberships.company_id = diagnostic_sessions.company_id
    where diagnostic_sessions.id = diagnostic_reports.session_id
      and company_memberships.user_id = (select auth.uid())
      and company_memberships.role in ('consultant', 'admin')
  )
);


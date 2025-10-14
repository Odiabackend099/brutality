\pset tuples_only on
\pset format unaligned

\echo 'DATABASE'
select current_database();

\echo 'TABLE_COUNTS'
select table_name || '|' || row_count || '|' || coalesce(last_change::text, 'NULL')
from (
  select 'payments_callwaiting' as table_name,
         count(*)::bigint as row_count,
         max(updated_at)::timestamptz as last_change
    from public.payments_callwaiting
  union all
  select 'leads_callwaiting' as table_name,
         count(*)::bigint as row_count,
         max(created_at)::timestamptz as last_change
    from public.leads_callwaiting
) t
order by table_name;

\echo 'PAYMENTS_STATUS_CHECKSUM'
select coalesce(
  md5(string_agg(id::text || ':' || coalesce(status,'') || ':' || coalesce(flutterwave_id,''), '|' order by updated_at, id)),
  'EMPTY'
)
from public.payments_callwaiting;

\echo 'LEADS_CONTACT_CHECKSUM'
select coalesce(
  md5(string_agg(id::text || ':' || coalesce(contact,'') || ':' || coalesce(created_at::text,''), '|' order by created_at, id)),
  'EMPTY'
)
from public.leads_callwaiting;

\echo 'RLS_ENABLED'
select relname || '|' || relrowsecurity
from pg_class
where relname in ('payments_callwaiting','leads_callwaiting')
order by relname;

\echo 'RLS_POLICIES'
select tablename || '|' || policyname || '|' || permissive || '|' || roles
from pg_policies
where schemaname = 'public'
  and tablename in ('payments_callwaiting','leads_callwaiting')
order by tablename, policyname;

\echo 'EXTENSIONS'
select extname || '|' || extversion
from pg_extension
where extname in ('uuid-ossp','pgcrypto')
order by extname;

\echo 'DONE'

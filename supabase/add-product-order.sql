-- Run once in Supabase SQL Editor to enable product drag-and-drop ordering.
alter table public.products
add column if not exists sort_order integer not null default 0;

with ranked as (
  select id, row_number() over (partition by category_id order by created_at desc) as position
  from public.products
)
update public.products
set sort_order = ranked.position
from ranked
where public.products.id = ranked.id
  and public.products.sort_order = 0;

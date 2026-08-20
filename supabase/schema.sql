-- Run this file once in Supabase Dashboard > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer not null default 0,
  header_image_url text,
  created_at timestamptz not null default now()
);

alter table public.categories add column if not exists header_image_url text;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  title text not null,
  description text default '',
  image_url text not null,
  views integer not null default 0 check (views >= 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.products add column if not exists sort_order integer not null default 0;

alter table public.categories enable row level security;
alter table public.products enable row level security;

create or replace function public.is_tnkax_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'admin@gmail.com';
$$;

drop policy if exists "Public can read categories" on public.categories;
drop policy if exists "Public can read products" on public.products;
drop policy if exists "Admin manages categories" on public.categories;
drop policy if exists "Admin manages products" on public.products;
create policy "Public can read categories" on public.categories for select using (true);
create policy "Public can read products" on public.products for select using (true);
create policy "Admin manages categories" on public.categories for all to authenticated using (public.is_tnkax_admin()) with check (public.is_tnkax_admin());
create policy "Admin manages products" on public.products for all to authenticated using (public.is_tnkax_admin()) with check (public.is_tnkax_admin());

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view product images" on storage.objects;
drop policy if exists "Admin uploads product images" on storage.objects;
drop policy if exists "Admin updates product images" on storage.objects;
drop policy if exists "Admin deletes product images" on storage.objects;
create policy "Public can view product images" on storage.objects for select using (bucket_id = 'product-images');
create policy "Admin uploads product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and public.is_tnkax_admin());
create policy "Admin updates product images" on storage.objects for update to authenticated using (bucket_id = 'product-images' and public.is_tnkax_admin()) with check (bucket_id = 'product-images' and public.is_tnkax_admin());
create policy "Admin deletes product images" on storage.objects for delete to authenticated using (bucket_id = 'product-images' and public.is_tnkax_admin());

create or replace function public.increment_product_views(product_id uuid)
returns void language sql security definer set search_path = public as $$
  update public.products set views = views + 1 where id = product_id;
$$;
grant execute on function public.increment_product_views(uuid) to anon, authenticated;

insert into public.categories (name, sort_order) values
  ('Ảnh bìa', 1), ('Dịch vụ', 2), ('Banner Shop', 3), ('Logo', 4)
on conflict (name) do nothing;

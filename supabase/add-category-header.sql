-- Run once in Supabase SQL Editor to enable custom category header images.
alter table public.categories
add column if not exists header_image_url text;

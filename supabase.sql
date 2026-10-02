-- =========================================================
-- GIFT LIST — BANCO SUPABASE
-- Cole este arquivo inteiro no SQL Editor do Supabase.
-- =========================================================

create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  image_url text not null default '',
  amazon_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  delivery_address text not null default 'COLE AQUI O ENDEREÇO COMPLETO DE ENTREGA.',
  delivery_info text not null default 'COLE AQUI AS INFORMAÇÕES ADICIONAIS.',
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id, delivery_address, delivery_info)
values (
  1,
  'COLE AQUI O ENDEREÇO COMPLETO DE ENTREGA.',
  'Se a compra pedir complemento ou referência, siga as informações acima. Para pedidos da Amazon, confira o endereço antes de finalizar.'
)
on conflict (id) do nothing;

alter table public.categories enable row level security;
alter table public.site_settings enable row level security;

-- Público: qualquer pessoa pode ver as categorias.
drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
on public.categories for select
to anon, authenticated
using (true);

-- Somente pessoas autenticadas podem criar, editar ou apagar categorias.
drop policy if exists "Authenticated can insert categories" on public.categories;
create policy "Authenticated can insert categories"
on public.categories for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update categories" on public.categories;
create policy "Authenticated can update categories"
on public.categories for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete categories" on public.categories;
create policy "Authenticated can delete categories"
on public.categories for delete
to authenticated
using (true);

-- Público: qualquer pessoa precisa conseguir ler as instruções de entrega.
drop policy if exists "Public can read settings" on public.site_settings;
create policy "Public can read settings"
on public.site_settings for select
to anon, authenticated
using (true);

-- Somente autenticados podem alterar as instruções.
drop policy if exists "Authenticated can update settings" on public.site_settings;
create policy "Authenticated can update settings"
on public.site_settings for update
to authenticated
using (true)
with check (true);

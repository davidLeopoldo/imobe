-- Bucket privado para as fotos de imóvel. Mesmo padrão do bucket
-- "contratos" (0004_storage_contratos.sql): acesso sempre via signed URL
-- gerada sob demanda pela aplicação, nunca por URL pública direta.

insert into storage.buckets (id, name, public)
values ('imovel-fotos', 'imovel-fotos', false)
on conflict (id) do nothing;

-- Caminho de cada objeto: "{user_id}/{imovel_id}/{uuid}.{ext}" —
-- (storage.foldername(name))[1] extrai o primeiro segmento do caminho,
-- que deve ser sempre o auth.uid() do dono do imóvel.

create policy imovel_fotos_storage_select_own on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'imovel-fotos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy imovel_fotos_storage_insert_own on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'imovel-fotos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy imovel_fotos_storage_delete_own on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'imovel-fotos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

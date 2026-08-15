-- Bucket privado para os PDFs de contrato (Spec 5.4 do PRD). O acesso é
-- sempre via signed URL de curta duração gerada sob demanda pela aplicação
-- (supabase.storage.from('contratos').createSignedUrl(...)) — nunca por
-- URL pública direta.

insert into storage.buckets (id, name, public)
values ('contratos', 'contratos', false)
on conflict (id) do nothing;

-- storage.objects já vem com RLS habilitado por padrão no projeto Supabase.
-- O caminho de cada objeto dentro do bucket é "{user_id}/{contrato_id}.pdf"
-- — (storage.foldername(name))[1] extrai o primeiro segmento do caminho,
-- que deve ser sempre o auth.uid() do dono do contrato.

create policy contratos_storage_select_own on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'contratos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy contratos_storage_insert_own on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'contratos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy contratos_storage_delete_own on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'contratos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

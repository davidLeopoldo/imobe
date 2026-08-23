-- Faltava a policy de UPDATE em imovel_fotos (0007 só tinha select/insert/
-- delete). Necessária para reordenar a coluna "ordem" das fotos restantes
-- quando uma foto é removida (services/imovel-fotos-service.ts,
-- removerFotoImovel) — sem isso, a reordenação era bloqueada
-- silenciosamente pelo RLS, e a "capa" (ordem = 1) podia ficar sem dono
-- depois de remover justamente a primeira foto.

create policy imovel_fotos_update_own on public.imovel_fotos
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

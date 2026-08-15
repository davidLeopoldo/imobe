-- Regra de negócio 11 (PRD v1.3): um imóvel só pode ser marcado como "alugado"
-- se for para_aluguel, e só pode ser marcado como "vendido" se for para_venda.
-- A coluna status já suporta os 4 valores (ver 0001_create_imoveis.sql); esta
-- migration apenas adiciona as constraints de consistência que faltavam.
-- RLS existente na tabela public.imoveis não é alterado.

alter table public.imoveis
  add constraint imoveis_status_alugado_requer_para_aluguel
    check (status <> 'alugado' or para_aluguel);

alter table public.imoveis
  add constraint imoveis_status_vendido_requer_para_venda
    check (status <> 'vendido' or para_venda);

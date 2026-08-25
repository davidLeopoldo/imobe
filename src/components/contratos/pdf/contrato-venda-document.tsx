import { Document, Page, Text, View } from "@react-pdf/renderer";
import { formatCurrencyBRL } from "@/lib/format";
import type { Contrato } from "@/services/contratos-service";
import { contratoStyles as s } from "./contrato-styles";

function formatDataBR(data: string) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function ContratoVendaDocument({ contrato }: { contrato: Contrato }) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.titulo}>Contrato de Compra e Venda de Imóvel</Text>

        <Text style={s.secaoTitulo}>1. Das partes</Text>
        <Text style={s.paragrafo}>
          VENDEDOR: {contrato.proprietario_nome}, CPF nº{" "}
          {contrato.proprietario_cpf}, residente e domiciliado em{" "}
          {contrato.proprietario_endereco}.
        </Text>
        <Text style={s.paragrafo}>
          COMPRADOR: {contrato.contraparte_nome}, CPF nº{" "}
          {contrato.contraparte_cpf}, residente e domiciliado em{" "}
          {contrato.contraparte_endereco}.
        </Text>

        <Text style={s.secaoTitulo}>2. Do objeto</Text>
        <Text style={s.paragrafo}>
          O presente contrato tem como objeto o imóvel localizado em{" "}
          {contrato.imovel_endereco}, bairro {contrato.imovel_bairro}, cidade de{" "}
          {contrato.imovel_cidade}, doravante denominado simplesmente
          &quot;imóvel&quot;.
        </Text>

        <Text style={s.secaoTitulo}>3. Do preço e forma de pagamento</Text>
        <Text style={s.paragrafo}>
          O preço certo e ajustado para a venda do imóvel é de{" "}
          {formatCurrencyBRL(contrato.imovel_valor)}
          {contrato.forma_pagamento
            ? `, a ser pago da seguinte forma: ${contrato.forma_pagamento}.`
            : "."}
        </Text>

        <Text style={s.secaoTitulo}>4. Do foro</Text>
        <Text style={s.paragrafo}>
          Fica eleito o foro da comarca de {contrato.imovel_cidade} para dirimir
          quaisquer dúvidas oriundas do presente contrato.
        </Text>

        <Text style={s.paragrafo}>
          {contrato.imovel_cidade}, {formatDataBR(contrato.data_contrato)}.
        </Text>

        <View style={s.assinaturas}>
          <View style={s.blocoAssinatura}>
            <Text style={s.linhaAssinatura}>{contrato.proprietario_nome}</Text>
            <Text>Vendedor</Text>
          </View>
          <View style={s.blocoAssinatura}>
            <Text style={s.linhaAssinatura}>{contrato.contraparte_nome}</Text>
            <Text>Comprador</Text>
          </View>
        </View>

        <Text style={s.rodape}>
          Este é um modelo de contrato genérico gerado automaticamente pelo
          Immobiliare e não substitui validação jurídica especializada.
        </Text>
      </Page>
    </Document>
  );
}

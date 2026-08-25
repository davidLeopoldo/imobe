import { Document, Page, Text, View } from "@react-pdf/renderer";
import { formatCurrencyBRL } from "@/lib/format";
import type { Contrato } from "@/services/contratos-service";
import { contratoStyles as s } from "./contrato-styles";

function formatDataBR(data: string) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function ContratoLocacaoDocument({ contrato }: { contrato: Contrato }) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.titulo}>Contrato de Locação de Imóvel</Text>

        <Text style={s.secaoTitulo}>1. Das partes</Text>
        <Text style={s.paragrafo}>
          LOCADOR: {contrato.proprietario_nome}, CPF nº{" "}
          {contrato.proprietario_cpf}, residente e domiciliado em{" "}
          {contrato.proprietario_endereco}.
        </Text>
        <Text style={s.paragrafo}>
          LOCATÁRIO: {contrato.contraparte_nome}, CPF nº{" "}
          {contrato.contraparte_cpf}, residente e domiciliado em{" "}
          {contrato.contraparte_endereco}.
        </Text>

        <Text style={s.secaoTitulo}>2. Do objeto</Text>
        <Text style={s.paragrafo}>
          O presente contrato tem como objeto a locação do imóvel localizado em{" "}
          {contrato.imovel_endereco}, bairro {contrato.imovel_bairro}, cidade de{" "}
          {contrato.imovel_cidade}, doravante denominado simplesmente
          &quot;imóvel&quot;.
        </Text>

        <Text style={s.secaoTitulo}>
          3. Do valor do aluguel e forma de pagamento
        </Text>
        <Text style={s.paragrafo}>
          O valor mensal do aluguel é de{" "}
          {formatCurrencyBRL(contrato.imovel_valor)}
          {contrato.forma_pagamento
            ? `, a ser pago da seguinte forma: ${contrato.forma_pagamento}.`
            : "."}
        </Text>

        <Text style={s.secaoTitulo}>4. Do prazo</Text>
        <Text style={s.paragrafo}>
          O prazo de locação é de {contrato.prazo_meses} meses, contados a
          partir de {formatDataBR(contrato.data_contrato)}. Reajuste, multas e
          juros não são calculados automaticamente pelo sistema e devem ser
          negociados diretamente entre as partes.
        </Text>

        <Text style={s.secaoTitulo}>5. Do foro</Text>
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
            <Text>Locador</Text>
          </View>
          <View style={s.blocoAssinatura}>
            <Text style={s.linhaAssinatura}>{contrato.contraparte_nome}</Text>
            <Text>Locatário</Text>
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

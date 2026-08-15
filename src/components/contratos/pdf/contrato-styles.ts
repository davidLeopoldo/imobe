import { StyleSheet } from "@react-pdf/renderer";

export const contratoStyles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
    color: "#1a1a1a",
  },
  titulo: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    marginBottom: 16,
    textAlign: "center",
  },
  secaoTitulo: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginTop: 16,
    marginBottom: 6,
  },
  paragrafo: {
    marginBottom: 6,
    textAlign: "justify",
  },
  assinaturas: {
    marginTop: 56,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  blocoAssinatura: {
    width: "45%",
    textAlign: "center",
  },
  linhaAssinatura: {
    borderTopWidth: 1,
    borderTopColor: "#1a1a1a",
    borderTopStyle: "solid",
    marginBottom: 4,
    paddingTop: 4,
  },
  rodape: {
    marginTop: 40,
    fontSize: 8,
    color: "#666666",
    textAlign: "center",
  },
});

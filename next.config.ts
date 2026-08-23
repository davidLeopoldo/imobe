import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@react-pdf/renderer"],
  experimental: {
    serverActions: {
      // Fotos de imóvel vão até 3MB cada (lib/validations/imovel-foto.ts);
      // cada upload é uma Server Action separada (uma foto por vez), então
      // esse limite cobre uma única foto com folga.
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;

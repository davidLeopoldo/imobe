import { LandingHero } from "./_components/landing-hero";
import { MockImoveisSection } from "./_components/mock-imoveis-section";
import { DepoimentosSection } from "./_components/depoimentos-section";

export default function LandingPage() {
  return (
    <>
      <LandingHero />
      <MockImoveisSection />
      <DepoimentosSection />
    </>
  );
}

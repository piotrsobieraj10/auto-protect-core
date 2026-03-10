import heroBg from "@/assets/hero-bg.jpg";
import { Button } from "@/components/ui/button";
import { Shield, MapPin, ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <img
        src={heroBg}
        alt="Profesjonalny warsztat montażu GPS i zabezpieczeń samochodowych"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div className="hero-overlay absolute inset-0" />

      <div className="relative z-10 container mx-auto px-6 py-24">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium tracking-widest uppercase text-primary">
              Zabezpieczenia antykradzieżowe · GPS · eToll
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Skuteczna ochrona
            <span className="text-gradient block">przed kradzieżą</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
            Wielopoziomowe systemy zabezpieczeń antykradzieżowych — blokady CAN, immobilizery, autoryzacja kierowcy.
            Profesjonalny montaż i pełna ochrona Twojego pojazdu.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button variant="hero" size="lg" asChild>
              <a href="#kontakt">
                Umów wizytę
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <a href="#uslugi">Nasze usługi</a>
            </Button>
          </div>

          <div className="flex gap-8 mt-14">
            {[
              { value: "500+", label: "Zabezpieczonych aut" },
              { value: "9 lat", label: "Doświadczenia" },
              { value: "100%", label: "Skuteczności" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

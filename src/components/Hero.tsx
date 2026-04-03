import heroBg from "@/assets/hero-bg.jpg";
import { Button } from "@/components/ui/button";
import { Shield, MapPin, ArrowRight, Clock } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <img
        src={heroBg}
        alt="Specjalista montażu zabezpieczeń GPS i antykradzieżowych"
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
            Specjalista montażu
            <span className="text-gradient block">zabezpieczeń GPS</span>
            <span className="block text-3xl md:text-4xl mt-2 text-foreground/90">i antykradzieżowych</span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground mb-2 max-w-lg leading-relaxed">
            9 lat doświadczenia w zabezpieczaniu pojazdów | Dojazd do klienta – Radom i okolice + cała Polska
          </p>

          <p className="text-lg md:text-xl text-foreground font-semibold mb-4 max-w-lg leading-relaxed">
            Złodzieje potrzebują kilkudziesięciu sekund – odpowiednie zabezpieczenie może ich zatrzymać na zawsze.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-10">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary/10 border border-primary/20 w-fit">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-medium text-primary">Radom i okolice + dojazd w całej Polsce</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent/20 border border-accent/30 w-fit">
              <Clock className="h-4 w-4 text-accent shrink-0" />
              <span className="text-sm font-medium text-accent">Montaż nawet w 24–48h</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button variant="hero" size="lg" asChild>
              <a href="#kontakt">
                Umów montaż
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <a href="#uslugi">Sprawdź ofertę</a>
            </Button>
          </div>

          <div className="flex gap-8 mt-14">
            {[
              { value: "2000+", label: "Zabezpieczonych aut" },
              { value: "9 lat", label: "Doświadczenia" },
              { value: "100%", label: "Zaangażowania" },
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

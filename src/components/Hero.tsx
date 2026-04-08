import heroBg from "@/assets/hero-bg.jpg";
import { Button } from "@/components/ui/button";
import { Shield, MapPin, Phone, MessageCircle, CheckCircle2, Timer } from "lucide-react";

const Hero = () => {
  const whatsappUrl = "https://wa.me/48512732864?text=Chc%C4%99%20zabezpieczy%C4%87%20swoje%20auto";

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <img
        src={heroBg}
        alt="Profesjonalny montaż zabezpieczeń antykradzieżowych – AutoSafe Radom"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div className="hero-overlay absolute inset-0" />

      <div className="relative z-10 container mx-auto px-6 py-24">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium tracking-widest uppercase text-primary">
              GPS &middot; Immobilizery &middot; Blokady CAN &middot; Radom
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5">
            Zabezpiecz auto zanim
            <span className="text-gradient block mt-1">zostanie skradzione</span>
            <span className="block text-2xl md:text-3xl mt-3 text-foreground/85 font-semibold">
              Radom i okolice
            </span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground mb-3 max-w-xl leading-relaxed">
            Nowoczesne samochody można ukraść nawet w kilkadziesiąt sekund – nie ryzykuj,
            zabezpiecz swoje auto już dziś.
          </p>

          <div className="flex items-center gap-2 mb-6 px-4 py-2.5 rounded-lg bg-destructive/10 border border-destructive/30 w-fit">
            <Timer className="h-4 w-4 text-destructive shrink-0" />
            <span className="text-sm font-semibold text-destructive">
              Kradzież może trwać krócej niż minutę
            </span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary/10 border border-primary/20 w-fit mb-8">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm font-medium text-primary">
              Radom, woj. mazowieckie + dojazd w całej Polsce (po uzgodnieniu)
            </span>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <Button variant="hero" size="lg" asChild>
              <a href="tel:+48512732864" className="flex items-center gap-2 text-base px-8 py-4">
                <Phone className="h-5 w-5" />
                Zadzwoń teraz
              </a>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-base px-8 py-4">
                <MessageCircle className="h-5 w-5" />
                Napisz na WhatsApp
              </a>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {[
              "9 lat doświadczenia",
              "Montaż u klienta",
              "Indywidualne zabezpieczenia",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm text-foreground/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

import { Locate, Lock, Cpu, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Locate,
    name: "Lokalizator GPS",
    seoName: "Montaż GPS – Radom",
    description: "Monitoring i lokalizacja pojazdu 24/7. Ukryty tracker z aplikacją mobilną i powiadomieniami.",
    features: ["Montaż ukryty w pojeździe", "Aplikacja mobilna 24/7", "Powiadomienia w czasie rzeczywistym", "Historia tras i postojów"],
    price: "od 500 zł",
    highlight: false,
  },
  {
    icon: Lock,
    name: "Immobilizer dodatkowy",
    seoName: "Immobilizer – Radom",
    description: "Dodatkowe zabezpieczenie uruchomienia auta, niezależne od fabrycznego. Autoryzacja PIN, kartą lub brelokiem.",
    features: ["Niezależny od fabrycznego", "Autoryzacja PIN / brelok / karta", "Homologacja E20", "Tryb serwisowy"],
    price: "od 800 zł",
    highlight: true,
  },
  {
    icon: Cpu,
    name: "Blokada CAN",
    seoName: "Blokada CAN – Radom",
    description: "Ochrona przed ingerencją w elektronikę pojazdu. Skuteczna blokada nawet przy przechwyconym sygnale kluczyka.",
    features: ["Ochrona przed relay attack", "Brak błędów OBD", "Montaż bezinwazyjny", "Kompatybilność z ASO"],
    price: "od 1000 zł",
    highlight: false,
  },
];

const Pricing = () => {
  const whatsappUrl = "https://wa.me/48512732864?text=Chc%C4%99%20zapyta%C4%87%20o%20cen%C4%99%20zabezpiecze%C5%84";

  return (
    <section id="cennik" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-sm font-medium tracking-widest uppercase text-primary mb-3 block">
            Cennik – zabezpieczenia samochodowe Radom
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Orientacyjne ceny <span className="text-gradient">zabezpieczeń</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cena zależy od modelu auta i zakresu prac.{" "}
            <strong>Dokładna wycena po kontakcie – bezpłatnie.</strong>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {services.map((s) => (
            <div
              key={s.name}
              className={`relative group p-8 rounded-xl border transition-all duration-300 flex flex-col ${
                s.highlight
                  ? "bg-primary/5 border-primary/40 glow-blue"
                  : "bg-background border-border hover:border-primary/30"
              }`}
            >
              {s.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold whitespace-nowrap">
                  Najczęściej wybierany
                </div>
              )}
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                <s.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{s.name}</h3>
              <p className="text-xs text-primary/60 font-medium mb-3">{s.seoName}</p>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{s.description}</p>

              <ul className="space-y-2 mb-6 mt-auto">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-border">
                <div className="text-2xl font-bold text-primary mb-3">{s.price}</div>
                <Button variant="hero" size="sm" className="w-full" asChild>
                  <a href="tel:+48512732864">
                    <Phone className="h-4 w-4 mr-2" />
                    Zadzwoń i zapytaj o cenę
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center p-8 rounded-xl bg-background border border-border max-w-2xl mx-auto">
          <p className="text-muted-foreground text-sm mb-5">
            Możliwa wycena pakietów łączonych (np. GPS + immobilizer + CAN) –
            skontaktuj się i omówimy optymalny zakres ochrony dla Twojego pojazdu.
            Działamy w Radomiu, okolicach Radomia i woj. mazowieckim.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="hero" size="sm" asChild>
              <a href="tel:+48512732864" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Zadzwoń teraz
              </a>
            </Button>
            <Button variant="heroOutline" size="sm" asChild>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Napisz na WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;

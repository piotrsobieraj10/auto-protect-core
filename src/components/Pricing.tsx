import { Locate, Lock, Cpu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Locate,
    name: "Lokalizator GPS",
    description: "Ukryty tracker GPS z aplikacją mobilną. Monitoring i lokalizacja pojazdu 24/7.",
    features: ["Montaż ukryty", "Aplikacja mobilna", "Powiadomienia w czasie rzeczywistym", "Historia tras"],
    price: "od zapytania",
    highlight: false,
  },
  {
    icon: Lock,
    name: "Immobilizer dodatkowy",
    description: "Niezależne zabezpieczenie uruchamiania silnika. Autoryzacja kartą, brelokiem lub PIN-em.",
    features: ["Niezależny od fabrycznego", "Autoryzacja PIN / brelok", "Homologacja E20", "Tryb serwisowy"],
    price: "od zapytania",
    highlight: true,
  },
  {
    icon: Cpu,
    name: "Blokada CAN",
    description: "Ochrona magistrali CAN przed przejęciem elektroniki pojazdu przez złodzieja.",
    features: ["Ochrona przed relay attack", "Brak błędów OBD", "Montaż bezinwazyjny", "Kompatybilność z ASO"],
    price: "od zapytania",
    highlight: false,
  },
];

const Pricing = () => {
  return (
    <section id="cennik" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-sm font-medium tracking-widest uppercase text-primary mb-3 block">
            Cennik
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Orientacyjne <span className="text-gradient">ceny</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cena zależy od modelu auta, zakresu prac i wybranego urządzenia.{" "}
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
              <h3 className="text-2xl font-bold mb-2">{s.name}</h3>
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
                <div className="text-lg font-bold text-primary mb-3">{s.price}</div>
                <Button variant="hero" size="sm" className="w-full" asChild>
                  <a href="tel:+48512732864">Zadzwoń i uzyskaj wycenę</a>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center p-6 rounded-xl bg-background border border-border max-w-2xl mx-auto">
          <Phone className="h-6 w-6 text-primary mx-auto mb-3" />
          <p className="text-muted-foreground text-sm mb-3">
            Możliwa jest też wycena pakietów łączonych (np. GPS + immobilizer + CAN) –
            skontaktuj się i omówimy optymalny zakres ochrony dla Twojego pojazdu.
          </p>
          <Button variant="heroOutline" size="sm" asChild>
            <a href="tel:+48512732864">Zadzwoń po bezpłatną wycenę</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;

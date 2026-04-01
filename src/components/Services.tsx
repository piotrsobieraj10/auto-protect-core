import { Shield, Locate, Truck, Check } from "lucide-react";

const packages = [
  {
    icon: Shield,
    name: "Pakiet Ochrona",
    description: "Kompleksowe zabezpieczenie antykradzieżowe Twojego pojazdu.",
    features: [
      "Blokada magistrali CAN",
      "Immobilizer cyfrowy",
      "Autoryzacja kierowcy (PIN / brelok / aplikacja)",
      "Homologacja E20",
      "Tryb serwisowy",
    ],
    highlighted: false,
  },
  {
    icon: Locate,
    name: "Pakiet Monitoring",
    description: "Pełna ochrona + śledzenie pojazdu w czasie rzeczywistym.",
    features: [
      "Wszystko z Pakietu Ochrona",
      "Ukryty lokalizator GPS",
      "Aplikacja mobilna 24/7",
      "Powiadomienia o nieautoryzowanym ruchu",
      "Historia tras i postojów",
    ],
    highlighted: true,
  },
  {
    icon: Truck,
    name: "Pakiet Biznes",
    description: "Rozwiązanie dla firm i zarządzania flotą pojazdów.",
    features: [
      "Wszystko z Pakietu Monitoring",
      "System eToll (urządzenie OBU)",
      "Telematyka flotowa",
      "Raporty zużycia paliwa i stylu jazdy",
      "Czujniki temperatury i otwarcia drzwi",
    ],
    highlighted: false,
  },
];

const Services = () => {
  return (
    <section id="uslugi" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-medium tracking-widest uppercase text-primary mb-3 block">
            Oferta
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Pakiety <span className="text-gradient">usług</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Wybierz poziom ochrony dopasowany do Twoich potrzeb.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative group p-8 rounded-xl border transition-all duration-300 flex flex-col ${
                pkg.highlighted
                  ? "bg-primary/5 border-primary/40 glow-blue"
                  : "bg-background border-border hover:border-primary/30"
              }`}
            >
              {pkg.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  Najpopularniejszy
                </div>
              )}
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                <pkg.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
              <p className="text-muted-foreground mb-6">{pkg.description}</p>
              <ul className="space-y-3 mt-auto">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

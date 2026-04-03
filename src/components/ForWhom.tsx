import { Car, Building2, Truck, Tractor } from "lucide-react";

const segments = [
  {
    icon: Car,
    title: "Samochody prywatne",
    description: "Szczególnie nowe i droższe modele narażone na kradzież cyfrową.",
  },
  {
    icon: Building2,
    title: "Floty firmowe",
    description: "Monitoring i zabezpieczenie pojazdów służbowych z pełnym raportowaniem.",
  },
  {
    icon: Truck,
    title: "Transport i logistyka",
    description: "GPS, eToll i telematyka dla pojazdów dostawczych i ciężarowych.",
  },
  {
    icon: Tractor,
    title: "Maszyny budowlane i rolnicze",
    description: "Lokalizacja i zabezpieczenie sprzętu pracującego w terenie.",
  },
];

const ForWhom = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-medium tracking-widest uppercase text-primary mb-3 block">
            Dla kogo
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Komu <span className="text-gradient">pomagam</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Zabezpieczam pojazdy i maszyny różnego typu – od aut prywatnych po flotę firmową.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {segments.map((segment) => (
            <div
              key={segment.title}
              className="group p-8 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 text-center"
            >
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                <segment.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{segment.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{segment.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForWhom;

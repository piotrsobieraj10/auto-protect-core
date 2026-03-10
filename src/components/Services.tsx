import { MapPin, CreditCard, Shield, Locate, Truck, Lock } from "lucide-react";

const services = [
  {
    icon: MapPin,
    title: "Lokalizatory GPS",
    description:
      "Montaż profesjonalnych lokalizatorów GPS z monitoringiem w czasie rzeczywistym. Śledź pozycję pojazdu 24/7 z aplikacji mobilnej.",
  },
  {
    icon: CreditCard,
    title: "System eToll",
    description:
      "Instalacja urządzeń OBU do systemu eToll. Pełna zgodność z wymaganiami KAS. Profesjonalny montaż i konfiguracja urządzenia.",
  },
  {
    icon: Shield,
    title: "Zabezpieczenia antykradzieżowe",
    description:
      "Blokady CAN, immobilizery, autoryzacja kierowcy. Wielopoziomowa ochrona przed kradzieżą i włamaniem.",
  },
  {
    icon: Locate,
    title: "Zarządzanie flotą",
    description:
      "Kompleksowe systemy zarządzania flotą pojazdów. Kontrola trasy, zużycia paliwa i stylu jazdy kierowców.",
  },
  {
    icon: Truck,
    title: "Czujniki i telematyka",
    description:
      "Montaż czujników temperatury, otwarcia drzwi, poziomu paliwa. Pełna telematyka dla pojazdów dostawczych.",
  },
  {
    icon: Lock,
    title: "Odzyskiwanie pojazdów",
    description:
      "Ukryte systemy śledzenia do odzyskiwania skradzionych pojazdów. Współpraca z policją w celu szybkiego zlokalizowania pojazdu.",
  },
];

const Services = () => {
  return (
    <section id="uslugi" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-medium tracking-widest uppercase text-primary mb-3 block">
            Co oferujemy
          </span>
          <h2 className="text-4xl md:text-5xl font-bold">Nasze usługi</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group p-8 rounded-xl bg-background border border-border hover:border-primary/30 transition-all duration-300 hover:glow-blue"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <service.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

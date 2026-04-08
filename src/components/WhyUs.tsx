import { CheckCircle } from "lucide-react";

const reasons = [
  "9 lat doświadczenia zdobywanego przy montażu zabezpieczeń różnych marek i modeli",
  "Montaż u klienta – Radom i okolice, a także dojazd na terenie całej Polski (ustalane indywidualnie)",
  "Praca na sprawdzonych rozwiązaniach z certyfikatami i homologacjami",
  "Obsługa szerokiego spektrum marek: auta premium, popularne, elektryczne i dostawcze",
  "Gwarancja na montaż i urządzenia",
  "Wsparcie techniczne i serwis posprzedażowy",
  "Bezpłatna konsultacja i dobór zabezpieczenia do konkretnego modelu",
];

const WhyUs = () => {
  return (
    <section id="o-nas" className="py-24">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-sm font-medium tracking-widest uppercase text-primary mb-3 block">
              Dlaczego AutoSafe
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Doświadczenie i{" "}
              <span className="text-gradient">podejście</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Od 9 lat specjalizuję się w montażu systemów bezpieczeństwa i lokalizacji pojazdów
              w Radomiu i woj. mazowieckim. Każda instalacja to indywidualne podejście –
              bez skrótów, bez kompromisów.
            </p>

            <div className="space-y-4">
              {reasons.map((reason) => (
                <div key={reason} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-secondary-foreground">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl bg-card border border-border p-10 flex flex-col items-center justify-center text-center glow-blue">
              <div className="text-7xl font-bold text-primary mb-2">9+</div>
              <div className="text-xl font-medium mb-1">Lat doświadczenia</div>
              <div className="text-muted-foreground mb-8">w branży zabezpieczeń pojazdów</div>

              <div className="grid grid-cols-1 gap-4 w-full">
                {[
                  { label: "Montaż u klienta", desc: "Radom i okolice + cała Polska" },
                  { label: "Indywidualne podejście", desc: "Każdy montaż dopasowany do auta" },
                  { label: "Sprawdzone rozwiązania", desc: "Urządzenia z certyfikatami E20" },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-lg bg-background text-left">
                    <div className="font-semibold text-sm text-accent">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;

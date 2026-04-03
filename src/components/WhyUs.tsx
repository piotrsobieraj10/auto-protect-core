import { CheckCircle } from "lucide-react";

const reasons = [
  "Doświadczenie zdobywane przez 9 lat pracy przy montażu zabezpieczeń",
  "Gwarancja na montaż i urządzenia",
  "Dojazd do klienta – Radom i okolice + cała Polska (ustalane indywidualnie)",
  "Współpraca z wiodącymi producentami sprzętu",
  "Wsparcie techniczne i serwis posprzedażowy",
  "Konkurencyjne ceny i elastyczne formy płatności",
];

const WhyUs = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-sm font-medium tracking-widest uppercase text-primary mb-3 block">
              Dlaczego ja
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Doświadczenie i{" "}
              <span className="text-gradient">zaufanie</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Od 9 lat specjalizuję się w montażu systemów bezpieczeństwa i lokalizacji pojazdów.
              Każda instalacja jest wykonywana z najwyższą starannością i pełnym zaangażowaniem.
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
              <div className="text-muted-foreground">w branży zabezpieczeń pojazdów</div>
              <div className="mt-8 grid grid-cols-2 gap-6 w-full">
                <div className="p-4 rounded-lg bg-background">
                  <div className="text-2xl font-bold text-accent">98%</div>
                  <div className="text-xs text-muted-foreground">Zadowolonych klientów</div>
                </div>
                <div className="p-4 rounded-lg bg-background">
                  <div className="text-2xl font-bold text-accent">2000+</div>
                  <div className="text-xs text-muted-foreground">Wykonanych montaży</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;

import { Shield, Lock, Fingerprint, Cpu, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Cpu,
    title: "Blokada CAN",
    description:
      "Zaawansowana blokada magistrali CAN uniemożliwia uruchomienie pojazdu bez autoryzacji. Skuteczna ochrona przed kradzieżą na komputer.",
  },
  {
    icon: Lock,
    title: "Immobilizer dodatkowy",
    description:
      "Dodatkowy immobilizer niezależny od fabrycznego. Nawet po złamaniu oryginalnego zabezpieczenia pojazd pozostaje zablokowany.",
  },
  {
    icon: Fingerprint,
    title: "Autoryzacja kierowcy",
    description:
      "System rozpoznawania kierowcy za pomocą karty, breloka lub aplikacji mobilnej. Tylko upoważnione osoby uruchomią pojazd.",
  },
  {
    icon: Shield,
    title: "Ukryty lokalizator",
    description:
      "Profesjonalnie zamontowany, niewidoczny tracker GPS. Umożliwia szybkie zlokalizowanie i odzyskanie skradzionego pojazdu.",
  },
];

const benefits = [
  "Ochrona przed kradzieżą na „walizkę" (relay attack)",
  "Zabezpieczenie przed podmianą kluczyka",
  "Blokada uruchomienia silnika bez autoryzacji",
  "Powiadomienia o próbach włamania na telefon",
  "Współpraca z fabrycznymi systemami pojazdu",
  "Montaż bez utraty gwarancji producenta",
];

const AntiTheft = () => {
  return (
    <section id="zabezpieczenia" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-medium tracking-widest uppercase text-primary mb-3 block">
            Specjalizacja
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Zabezpieczenia <span className="text-gradient">antykradzieżowe</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Kompleksowa ochrona Twojego pojazdu przed najnowszymi metodami kradzieży.
            Wielopoziomowe systemy, które skutecznie powstrzymają złodziei.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-8 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:glow-blue"
            >
              <div className="flex gap-5">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-card border border-border p-10 md:p-14">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Dlaczego warto zabezpieczyć auto?
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                W Polsce co roku kradzionych jest ponad 10 000 pojazdów. Nowoczesne metody kradzieży
                pozwalają złodziejom otworzyć i uruchomić auto w kilkadziesiąt sekund.
                Nasze systemy skutecznie temu zapobiegają.
              </p>
              <Button variant="hero" size="lg" asChild>
                <a href="#kontakt">Zabezpiecz swoje auto</a>
              </Button>
            </div>
            <div className="space-y-3">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AntiTheft;

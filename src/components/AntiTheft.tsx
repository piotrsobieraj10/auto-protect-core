import { Shield, Lock, Cpu, AlertTriangle, Wallet, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const problems = [
  {
    icon: AlertTriangle,
    title: "Keyless i CAN – luki w fabrycznym zabezpieczeniu",
    description:
      "Współczesne auta wyposażone w systemy keyless i magistralę CAN mogą być podatne na przejęcie bez fizycznego włamania.",
  },
  {
    icon: Clock,
    title: "Kradzież bez śladów i bardzo szybko",
    description:
      "Nowoczesne metody pozwalają uruchomić pojazd w krótkim czasie, często bez uszkodzeń nadwozia czy zamków.",
  },
  {
    icon: Wallet,
    title: "Fabryczne zabezpieczenia to za mało",
    description:
      "Producenci montują minimalne systemy ochrony. Dedykowane zabezpieczenie aftermarket to realnie inny poziom ochrony.",
  },
];

const solutions = [
  {
    icon: Cpu,
    title: "Blokada CAN",
    description:
      "Ochrona przed ingerencją w elektronikę pojazdu. Blokuje uruchomienie silnika nawet przy przechwyconym sygnale kluczyka.",
    label: "blokada CAN Radom",
  },
  {
    icon: Lock,
    title: "Immobilizer dodatkowy",
    description:
      "Niezależne od fabrycznego zabezpieczenie uruchamiania silnika. Autoryzacja kartą, brelokiem lub PIN-em.",
    label: "immobilizer Radom",
  },
  {
    icon: Shield,
    title: "Lokalizator GPS",
    description:
      "Ukryty tracker GPS umożliwia lokalizację pojazdu w czasie rzeczywistym i powiadomienia o nieautoryzowanym ruchu.",
    label: "montaż GPS Radom",
  },
];

const benefits = [
  "Ochrona przed kradzieżą na walizkę (relay attack)",
  "Blokada uruchomienia silnika bez autoryzacji",
  "Powiadomienia o próbach nieautoryzowanego ruchu",
  "Współpraca z fabryczną instalacją pojazdu",
  "Montaż bez utraty gwarancji producenta",
  "Każdy montaż dopasowany indywidualnie do modelu auta",
];

const AntiTheft = () => {
  const whatsappUrl = "https://wa.me/48512732864?text=Chc%C4%99%20zabezpieczy%C4%87%20swoje%20auto";

  return (
    <>
      {/* PROBLEM */}
      <section id="problem" className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-sm font-medium tracking-widest uppercase text-primary mb-3 block">
              Dlaczego warto działać
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Nowoczesne samochody są coraz{" "}
              <span className="text-gradient">łatwiejsze do kradzieży</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Rosnąca złożoność elektroniki samochodowej to dla złodziei nowe możliwości –
              nie tylko zagrożenie.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {problems.map((p) => (
              <div
                key={p.title}
                className="p-8 rounded-xl bg-background border border-border hover:border-primary/30 transition-all duration-300"
              >
                <div className="h-13 w-13 rounded-xl bg-destructive/10 flex items-center justify-center mb-5">
                  <p.icon className="h-7 w-7 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{p.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="flex flex-wrap justify-center gap-5 mb-8">
              {[
                { icon: AlertTriangle, text: "Brak dodatkowego zabezpieczenia = większe ryzyko" },
                { icon: Clock, text: "Kradzież może trwać bardzo krótko" },
                { icon: Wallet, text: "Utrata auta to duże straty finansowe i stres" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <item.icon className="h-4 w-4 text-destructive shrink-0" />
                  {item.text}
                </div>
              ))}
            </div>
            <Button variant="hero" size="lg" asChild>
              <a href="tel:+48512732864">Sprawdź jak zabezpieczyć swoje auto</a>
            </Button>
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section id="zabezpieczenia" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-medium tracking-widest uppercase text-primary mb-3 block">
              Rozwiązanie
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Skuteczne zabezpieczenia{" "}
              <span className="text-gradient">dopasowane do Twojego auta</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Dobór zabezpieczeń zależy od modelu auta, sposobu użytkowania i poziomu ryzyka.
              Każdy montaż jest indywidualny – brak uniwersalnych rozwiązań.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {solutions.map((s) => (
              <div
                key={s.title}
                className="group p-8 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:glow-blue"
              >
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <s.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm mb-4">{s.description}</p>
                <span className="text-xs text-primary/60 font-medium">{s.label}</span>
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
                  Każde auto jest inne – dlatego przed montażem dokładnie analizuję model
                  pojazdu, jego elektronikę i potrzeby klienta. Dobór zabezpieczenia zawsze
                  odbywa się indywidualnie, bez gotowych szablonów.
                </p>
                <Button variant="hero" size="lg" asChild>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    Zapytaj o najlepsze zabezpieczenie dla Twojego auta
                  </a>
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
    </>
  );
};

export default AntiTheft;

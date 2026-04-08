import { Shield, Lock, Cpu, AlertTriangle, Wallet, Clock, CheckCircle2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const problems = [
  {
    icon: AlertTriangle,
    title: "Brak dodatkowego zabezpieczenia = większe ryzyko",
    description:
      "Auta wyposażone w systemy keyless i magistralę CAN mogą być podatne na przejęcie bez użycia kluczy. Fabryczne zabezpieczenia często nie wystarczają.",
  },
  {
    icon: Clock,
    title: "Kradzież może trwać bardzo krótko",
    description:
      "Nowoczesne metody pozwalają uruchomić pojazd bardzo szybko, często bez uszkodzeń nadwozia czy zamków – bez pozostawienia śladów.",
  },
  {
    icon: Wallet,
    title: "Utrata auta to duże koszty i stres",
    description:
      "Ubezpieczenie nie zawsze pokrywa pełną wartość pojazdu. Czas, nerwy i formalności to dodatkowe obciążenie, którego łatwo uniknąć.",
  },
];

const solutions = [
  {
    icon: Cpu,
    title: "Blokada CAN – Radom",
    description:
      "Ochrona przed ingerencją w elektronikę pojazdu. Blokuje uruchomienie silnika nawet przy przechwyconym sygnale kluczyka.",
    label: "blokada CAN Radom",
  },
  {
    icon: Lock,
    title: "Immobilizer – Radom",
    description:
      "Dodatkowe zabezpieczenie uruchomienia auta, niezależne od fabrycznego. Autoryzacja kartą, brelokiem lub PIN-em.",
    label: "immobilizer Radom",
  },
  {
    icon: Shield,
    title: "Montaż GPS – Radom",
    description:
      "Monitoring i lokalizacja pojazdu. Ukryty tracker GPS z powiadomieniami o nieautoryzowanym ruchu w czasie rzeczywistym.",
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
              🚨 Twoje auto może być{" "}
              <span className="text-gradient">łatwym celem</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Nowoczesne samochody wyposażone w systemy keyless i CAN mogą zostać przejęte
              bez użycia kluczy. Fabryczne zabezpieczenia często nie wystarczają.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {problems.map((p) => (
              <div
                key={p.title}
                className="p-8 rounded-xl bg-background border border-border hover:border-destructive/30 transition-all duration-300"
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
            <Button variant="hero" size="lg" asChild>
              <a href="tel:+48512732864" className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Zabezpiecz auto – Zadzwoń teraz
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section id="zabezpieczenia" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-medium tracking-widest uppercase text-primary mb-3 block">
              Nasze usługi – zabezpieczenia antykradzieżowe Radom
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Skuteczne zabezpieczenia{" "}
              <span className="text-gradient">dopasowane do Twojego auta</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Dobieramy zabezpieczenia indywidualnie do modelu auta i potrzeb klienta –
              GPS, immobilizer i blokada CAN w Radomiu i okolicach Radomia.
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
                  Działamy na terenie Radomia i całego województwa mazowieckiego.
                  Możliwy dojazd do klienta oraz realizacje na terenie całej Polski po uzgodnieniu.
                  Każda instalacja jest indywidualnie dobrana – bez gotowych szablonów.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="hero" size="lg" asChild>
                    <a href="tel:+48512732864">
                      <Phone className="h-4 w-4 mr-2" />
                      Zadzwoń teraz
                    </a>
                  </Button>
                  <Button variant="heroOutline" size="lg" asChild>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      Napisz na WhatsApp
                    </a>
                  </Button>
                </div>
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

import { Lock, Locate, Shield, Phone, MessageCircle, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Lock,
    name: "🔐 Zabezpieczenie antykradzieżowe",
    description:
      "Nowoczesne zabezpieczenie, które skutecznie blokuje możliwość uruchomienia pojazdu bez autoryzacji kierowcy. Nawet po dostaniu się do auta – nie da się go uruchomić.",
    price: "od 2499 zł netto",
    highlight: false,
  },
  {
    icon: Shield,
    name: "🛡️ Pakiet zabezpieczeń",
    badge: "Najczęściej wybierany",
    description:
      "Połączenie zabezpieczenia antykradzieżowego i GPS dla maksymalnej ochrony pojazdu.",
    price: "od 3199 zł netto",
    highlight: true,
  },
  {
    icon: Locate,
    name: "📡 Lokalizator GPS",
    description:
      "Monitoring i lokalizacja pojazdu w czasie rzeczywistym. Stały dostęp do pozycji auta z poziomu telefonu.",
    price: "od 900 zł netto",
    highlight: false,
  },
];

const Pricing = () => {
  const whatsappUrl = "https://wa.me/48512732864?text=Chc%C4%99%20zapyta%C4%87%20o%20cen%C4%99%20zabezpiecze%C5%84";
  const whatsappMontazUrl = "https://wa.me/48512732864?text=Chc%C4%99%20um%C3%B3wi%C4%87%20monta%C5%BC%20zabezpieczenia";

  return (
    <section id="cennik" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-sm font-medium tracking-widest uppercase text-primary mb-3 block">
            Cennik
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            💰 Zabezpieczenia antykradzieżowe –{" "}
            <span className="text-gradient">ceny</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto mt-4">
            Oferujemy sprawdzone zabezpieczenia dopasowane indywidualnie do pojazdu i poziomu ochrony.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {services.map((s) => (
            <div
              key={s.name}
              className={`relative p-8 rounded-xl border transition-all duration-300 flex flex-col ${
                s.highlight
                  ? "bg-primary/5 border-primary/50 glow-blue shadow-lg scale-[1.02]"
                  : "bg-background border-border hover:border-primary/30"
              }`}
            >
              {s.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold whitespace-nowrap shadow">
                  ⭐ Najczęściej wybierany
                </div>
              )}

              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                <s.icon className="h-6 w-6 text-primary" />
              </div>

              <h3 className={`font-bold mb-3 ${s.highlight ? "text-2xl" : "text-xl"}`}>
                {s.name}
              </h3>

              <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                {s.description}
              </p>

              <div className={`pt-4 border-t border-border ${s.highlight ? "mt-auto" : ""}`}>
                <div className={`font-bold text-primary mb-4 ${s.highlight ? "text-4xl" : "text-3xl"}`}>
                  {s.price}
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="hero"
                    size={s.highlight ? "lg" : "sm"}
                    className="w-full"
                    asChild
                  >
                    <a href={whatsappMontazUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                      <Wrench className="h-4 w-4" />
                      Umów montaż
                    </a>
                  </Button>
                  <Button
                    variant="heroOutline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <a href="tel:+48512732864" className="flex items-center justify-center gap-2">
                      <Phone className="h-4 w-4" />
                      Zapytaj o montaż
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground text-sm mb-10">
          Wszystkie ceny podane są w kwotach netto. Do usług doliczany jest podatek VAT.
        </p>

        <div className="max-w-2xl mx-auto text-center space-y-6">
          <p className="text-muted-foreground text-sm">
            📞 Dokładna wycena zależy od modelu auta – skontaktuj się
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="lg" asChild>
              <a href="tel:+48512732864" className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Zadzwoń teraz
              </a>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Napisz na WhatsApp
              </a>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground italic">
            Jednorazowa inwestycja, która może uchronić przed utratą samochodu wartego kilkadziesiąt tysięcy złotych.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;

import { Phone, Search, Wrench, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Phone,
    number: "01",
    title: "Kontakt i szybka wycena",
    description: "Zadzwoń lub wypełnij formularz – wycenę otrzymasz w kilka minut.",
  },
  {
    icon: Search,
    number: "02",
    title: "Dobór zabezpieczenia",
    description: "Dobieram odpowiedni system do Twojego pojazdu i potrzeb.",
  },
  {
    icon: Wrench,
    number: "03",
    title: "Montaż u klienta",
    description: "Przyjadę do Ciebie lub ustalimy wygodne miejsce montażu.",
  },
  {
    icon: CheckCircle,
    number: "04",
    title: "Test + instrukcja obsługi",
    description: "Po montażu testuję działanie systemu i uczę Cię obsługi.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-medium tracking-widest uppercase text-primary mb-3 block">
            Proces
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Jak wygląda <span className="text-gradient">montaż</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Prosty proces od kontaktu do pełnej ochrony pojazdu.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={step.number} className="relative text-center group">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-border" />
              )}
              <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors relative">
                <step.icon className="h-8 w-8 text-primary" />
                <span className="absolute -top-2 -right-2 text-xs font-bold bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center">
                  {step.number}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, ShieldAlert } from "lucide-react";

const FinalCTA = () => {
  const whatsappUrl = "https://wa.me/48512732864?text=Chc%C4%99%20zabezpieczy%C4%87%20swoje%20auto";

  return (
    <section className="py-24 bg-card relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nie ryzykuj – zabezpiecz auto{" "}
            <span className="text-gradient">już dziś</span>
          </h2>

          <p className="text-xl text-muted-foreground mb-3 leading-relaxed max-w-xl mx-auto font-medium">
            Każdy dzień bez zabezpieczenia to realne ryzyko utraty samochodu.
          </p>

          <p className="text-base text-muted-foreground mb-10 leading-relaxed max-w-xl mx-auto">
            Skontaktuj się i dobierz odpowiednie zabezpieczenie do swojego pojazdu.
            Radom, woj. mazowieckie i cała Polska – dojazd po uzgodnieniu.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="lg" asChild>
              <a href="tel:+48512732864" className="flex items-center gap-2 text-base px-8 py-4">
                <Phone className="h-5 w-5" />
                Zadzwoń teraz
              </a>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-base px-8 py-4">
                <MessageCircle className="h-5 w-5" />
                Napisz na WhatsApp
              </a>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            📍 Radom, woj. mazowieckie · Bezpłatna konsultacja i wycena
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;

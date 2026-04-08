import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Shield } from "lucide-react";

const FinalCTA = () => {
  const whatsappUrl = "https://wa.me/48512732864?text=Chc%C4%99%20zabezpieczy%C4%87%20swoje%20auto";

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="h-8 w-8 text-primary" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-5">
            Zabezpiecz swoje auto{" "}
            <span className="text-gradient">zanim będzie za późno</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-xl mx-auto">
            Skontaktuj się i dobierz odpowiednie zabezpieczenie do swojego samochodu.
            Radom, woj. mazowieckie i cała Polska – dojazd po uzgodnieniu.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="lg" asChild>
              <a href="tel:+48512732864" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Zadzwoń teraz
              </a>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
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

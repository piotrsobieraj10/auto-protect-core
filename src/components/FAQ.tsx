import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Shield, Settings, Truck } from "lucide-react";

const faqCategories = [
  {
    title: "Bezpieczeństwo i Gwarancja",
    icon: Shield,
    faqs: [
      {
        q: "Czy montaż wpływa na gwarancję pojazdu?",
        a: "Nie. Stosuję systemy bezinwazyjne, które współpracują z fabryczną instalacją pojazdu bez przecinania oryginalnych wiązek przewodów. Dzięki temu zachowujesz pełną gwarancję producenta, co potwierdzam przy każdej instalacji.",
      },
      {
        q: 'Jak system chroni przed atakiem "walizką"?',
        a: "System blokuje magistralę CAN, co uniemożliwia uruchomienie silnika, nawet jeśli złodziej przechwyci sygnał z Twojego kluczyka. Odjazd autem jest możliwy dopiero po dodatkowej autoryzacji kodem lub brelokiem.",
      },
      {
        q: "Co oznacza homologacja E20?",
        a: "To europejski certyfikat bezpieczeństwa, który potwierdza, że urządzenie zostało przetestowane pod kątem zakłóceń elektromagnetycznych i jest dopuszczone do użytku w samochodach na terenie całej Unii Europejskiej.",
      },
      {
        q: "Czy montaż generuje błędy OBD?",
        a: 'Absolutnie nie. Systemy, które montuję, są "przezroczyste" dla komputerów diagnostycznych w autoryzowanych serwisach (ASO). Prawidłowo skonfigurowana blokada nie pozostawia śladów w pamięci błędów pojazdu.',
      },
    ],
  },
  {
    title: "Eksploatacja i Komfort",
    icon: Settings,
    faqs: [
      {
        q: "Czy urządzenie rozładuje akumulator?",
        a: "Nie. Montowane przeze mnie urządzenia posiadają tryb ultra-low-power i pobierają znikomą ilość prądu (poniżej normy dla fabrycznych systemów). Jest to całkowicie bezpieczne nawet przy kilkutygodniowym postoju auta.",
      },
      {
        q: "Jak korzystać z trybu serwisowego?",
        a: "Tryb serwisowy pozwala na tymczasowe uśpienie ochrony, np. gdy oddajesz auto do myjni lub mechanika. Aktywujesz go prostą kombinacją przycisków lub w aplikacji, dzięki czemu nie musisz zdradzać osobom trzecim, jak odblokowujesz auto.",
      },
      {
        q: "Co zrobić w razie utraty telefonu lub breloka?",
        a: "Każdy system posiada unikalny kod awaryjny (PIN), który otrzymasz ode mnie przy montażu. Pozwala on na jednorazowe odblokowanie auta i zaprogramowanie nowego urządzenia autoryzującego.",
      },
      {
        q: "Jakie marki pojazdów są obsługiwane?",
        a: "Systemy, które montuję, są kompatybilne z niemal każdą marką na rynku. Specjalizuję się w autach premium (BMW, Audi, Mercedes-Benz, Lexus, Volvo, Porsche, Land Rover, Jaguar), popularnych (Toyota, Mazda, Honda, Hyundai, Kia, Volkswagen, Skoda, Ford, Renault), elektrycznych i hybrydowych (Tesla i inne) oraz dostawczych (Mercedes Sprinter, Iveco Daily, Fiat Professional, Renault Master). Każdorazowo przed montażem przeprowadzam pełną weryfikację kompatybilności z konkretnym numerem VIN.",
      },
    ],
  },
  {
    title: "Logistyka i Serwis",
    icon: Truck,
    faqs: [
      {
        q: "Ile trwa montaż?",
        a: "Standardowy montaż kompleksowego zabezpieczenia trwa zazwyczaj od 3 do 5 godzin. Dojeżdżam do klienta w Radomiu i okolicach, a na terenie całej Polski – ustalane indywidualnie.",
      },
      {
        q: "Czy urządzenie można przełożyć do innego auta?",
        a: "Tak, systemy są demontowalne. Jeśli zmieniasz samochód, mogę zdemontować urządzenie z obecnego auta i po odpowiedniej rekonfiguracji zainstalować je w nowym pojeździe.",
      },
      {
        q: 'Czy system chroni przed kradzieżą "na lawetę"?',
        a: "Tak. Zaawansowane lokalizatory GPS, które montuję, posiadają akcelerometry wykrywające zmianę nachylenia auta lub ruch bez uruchomionego silnika – natychmiast wysyłają powiadomienie na Twój telefon.",
      },
    ],
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <HelpCircle className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium tracking-widest uppercase text-primary">
              FAQ
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Często zadawane <span className="text-gradient">pytania</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Znajdź odpowiedzi na najczęstsze pytania dotyczące montowanych przeze mnie systemów
            zabezpieczeń.
          </p>
        </div>

        <div className="space-y-10">
          {faqCategories.map((category) => (
            <div key={category.title}>
              <div className="flex items-center gap-2 mb-4">
                <category.icon className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">{category.title}</h3>
              </div>
              <Accordion type="single" collapsible className="space-y-3">
                {category.faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`${category.title}-${i}`}
                    className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/50 transition-colors"
                  >
                    <AccordionTrigger className="text-left font-semibold text-base hover:text-primary hover:no-underline py-5 transition-colors">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

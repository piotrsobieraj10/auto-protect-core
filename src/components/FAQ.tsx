import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "Czy montaż wpływa na gwarancję pojazdu?",
    a: "Montaż odbywa się cyfrowo przez magistralę CAN, bez przecinania instalacji. Jest to metoda bezinwazyjna, całkowicie bezpieczna dla gwarancji ASO.",
  },
  {
    q: "Jak korzystać z trybu serwisowego?",
    a: "Przed oddaniem auta do warsztatu aktywuj tryb serwisowy. Zabezpieczenie staje się wtedy pasywne i niewykrywalne dla testerów diagnostycznych.",
  },
  {
    q: "Jakie są dostępne metody autoryzacji?",
    a: "Możesz odblokować odjazd za pomocą kodu PIN (przyciski na kierownicy/kokpicie), breloka Bluetooth ID lub aplikacji w telefonie.",
  },
  {
    q: "Jak system chroni przed atakiem 'walizką'?",
    a: "Rozwiązanie blokuje odjazd nawet po przechwyceniu sygnału z oryginalnego kluczyka. Bez dodatkowej autoryzacji silnik nie zapali.",
  },
  {
    q: "Co oznacza homologacja E20?",
    a: "Wszystkie stosowane urządzenia posiadają polską homologację E20, co jest gwarancją jakości i pozwala na zniżki w ubezpieczeniu AC.",
  },
  {
    q: "Czy urządzenie rozładuje akumulator?",
    a: "Urządzenia są ultra-energooszczędne (pobór rzędu 1–2 mA), co zapobiega rozładowaniu akumulatora nawet przy długim postoju.",
  },
  {
    q: "Czy system chroni przed kradzieżą 'na lawetę'?",
    a: "Możliwa jest współpraca z modułami GPS, powiadamiającymi o nieautoryzowanym ruchu pojazdu.",
  },
  {
    q: "Co zrobić w razie utraty telefonu lub breloka?",
    a: "W razie utraty telefonu lub breloka każdy zestaw posiada unikalny kod ratunkowy do natychmiastowego odblokowania auta.",
  },
  {
    q: "Jakie marki pojazdów są obsługiwane?",
    a: "Obsługujemy większość marek premium, hybryd oraz aut elektrycznych dostępnych na rynku.",
  },
  {
    q: "Ile trwa montaż?",
    a: "Instalacja trwa zazwyczaj od 2 do 4 godzin i jest wykonywana w sposób całkowicie dyskretny.",
  },
  {
    q: "Czy urządzenie można przełożyć do innego auta?",
    a: "Przy sprzedaży auta urządzenie można zdemontować i po aktualizacji oprogramowania zainstalować w nowym pojeździe.",
  },
  {
    q: "Czy montaż generuje błędy OBD?",
    a: "Profesjonalna instalacja nie generuje żadnych błędów w komputerze pokładowym pojazdu.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-3xl">
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
            Znajdź odpowiedzi na najczęstsze pytania dotyczące naszych systemów
            zabezpieczeń.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
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
    </section>
  );
};

export default FAQ;

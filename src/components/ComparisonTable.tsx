import { Check, X, ShieldAlert } from "lucide-react";

const rows = [
  { feature: "Ochrona przed relay attack (kradzież „na walizkę")", factory: false, autosafe: true },
  { feature: "Blokada magistrali CAN", factory: false, autosafe: true },
  { feature: "Dodatkowa autoryzacja kierowcy (PIN / brelok)", factory: false, autosafe: true },
  { feature: "Lokalizacja GPS 24/7 z aplikacją mobilną", factory: false, autosafe: true },
  { feature: "Powiadomienia push o nieautoryzowanym ruchu", factory: false, autosafe: true },
  { feature: "Ukryty montaż – niewykrywalny dla złodzieja", factory: false, autosafe: true },
  { feature: "Alarm fabryczny z syreną", factory: true, autosafe: true },
  { feature: "Immobilizer standardowy", factory: true, autosafe: true },
  { feature: "Homologacja E20", factory: false, autosafe: true },
];

const ComparisonTable = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <ShieldAlert className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium tracking-widest uppercase text-primary">
              Porównanie
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Fabryczne vs <span className="text-gradient">AutoSafe</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Sprawdź, dlaczego fabryczne zabezpieczenia to za mało.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-4 font-semibold text-sm">Funkcja</th>
                <th className="text-center p-4 font-semibold text-sm w-36">Fabryczne</th>
                <th className="text-center p-4 font-semibold text-sm w-36 text-primary">AutoSafe</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t border-border hover:bg-card/50 transition-colors">
                  <td className="p-4 text-sm">{row.feature}</td>
                  <td className="p-4 text-center">
                    {row.factory ? (
                      <Check className="h-5 w-5 text-muted-foreground mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-destructive/60 mx-auto" />
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <Check className="h-5 w-5 text-primary mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;

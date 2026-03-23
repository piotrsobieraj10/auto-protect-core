import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface StepServiceDataProps {
  data: any;
  onDataChange: (field: string, value: any) => void;
}

const StepServiceData = ({ data, onDataChange }: StepServiceDataProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-yellow-950/30 border border-yellow-900/50 rounded-lg p-4">
        <p className="text-sm text-yellow-300">
          Uwaga: Sekcja poniżej zawiera dane poufne. Zostanie ukryta w dokumencie dla klienta.
        </p>
      </div>

      <div className="border border-slate-600 rounded-lg overflow-hidden">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between bg-slate-700/50 hover:bg-slate-700 text-white rounded-none border-b border-slate-600"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="text-base font-semibold">Dane serwisowe (Poufne)</span>
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </Button>

        {isExpanded && (
          <div className="p-6 space-y-4">
            <div>
              <Label htmlFor="control_unit_location" className="text-slate-300 mb-2 block">
                Lokalizacja centralki
              </Label>
              <Input
                id="control_unit_location"
                value={data.control_unit_location}
                onChange={(e) => onDataChange("control_unit_location", e.target.value)}
                placeholder="np. Pod deską rozdzielczą, po stronie kierowcy"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
              <p className="text-xs text-slate-500 mt-1">Dokładne miejsce zainstalowania centralki lub głównego modułu</p>
            </div>

            <div>
              <Label htmlFor="installation_connection_point" className="text-slate-300 mb-2 block">
                Punkt wpięcia w instalację
              </Label>
              <Input
                id="installation_connection_point"
                value={data.installation_connection_point}
                onChange={(e) => onDataChange("installation_connection_point", e.target.value)}
                placeholder="np. Złącze OBD-II, bezpośrednio do baterii"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
              <p className="text-xs text-slate-500 mt-1">Sposób podłączenia urządzenia do systemu pojazdu</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 text-center">
        <p className="text-sm text-slate-300">
          Kliknij na sekcję powyżej, aby rozwinąć i wpisać dane poufne
        </p>
      </div>
    </div>
  );
};

export default StepServiceData;

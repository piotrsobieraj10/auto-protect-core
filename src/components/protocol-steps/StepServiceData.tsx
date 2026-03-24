import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Lock } from "lucide-react";

interface StepServiceDataProps {
  data: any;
  onDataChange: (field: string, value: any) => void;
}

const StepServiceData = ({ data, onDataChange }: StepServiceDataProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 bg-yellow-950/30 border border-yellow-900/50 rounded-lg p-4">
        <Lock className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-yellow-300">
          Dane w tej sekcji są poufne i pojawią się wyłącznie w wersji
          archiwalnej dokumentu (nie dla klienta).
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <Label htmlFor="control_unit_location" className="text-slate-300 mb-2 block">
            Miejsce montażu urządzenia
          </Label>
          <Input
            id="control_unit_location"
            value={data.control_unit_location}
            onChange={(e) => onDataChange("control_unit_location", e.target.value)}
            placeholder="np. Pod deską rozdzielczą, po stronie kierowcy"
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
          />
        </div>

        <div>
          <Label htmlFor="gps_antenna_location" className="text-slate-300 mb-2 block">
            Lokalizacja anteny GPS
          </Label>
          <Input
            id="gps_antenna_location"
            value={data.gps_antenna_location}
            onChange={(e) => onDataChange("gps_antenna_location", e.target.value)}
            placeholder="np. Pod tapicerką dachu, po stronie pasażera"
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
          />
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
        </div>

        <div>
          <Label htmlFor="service_notes" className="text-slate-300 mb-2 block">
            Uwagi instalacyjne
          </Label>
          <Textarea
            id="service_notes"
            value={data.service_notes}
            onChange={(e) => onDataChange("service_notes", e.target.value)}
            placeholder="Szczegółowe uwagi dotyczące montażu, konfiguracji lub specjalnych warunków..."
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 min-h-[100px]"
          />
        </div>

        <div>
          <Label htmlFor="installation_video_url" className="text-slate-300 mb-2 block">
            Link do wideo z montażu
          </Label>
          <Input
            id="installation_video_url"
            type="url"
            value={data.installation_video_url}
            onChange={(e) => onDataChange("installation_video_url", e.target.value)}
            placeholder="https://..."
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
          />
        </div>
      </div>
    </div>
  );
};

export default StepServiceData;

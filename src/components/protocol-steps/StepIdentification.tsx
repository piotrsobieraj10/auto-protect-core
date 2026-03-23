import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StepIdentificationProps {
  data: any;
  onDataChange: (field: string, value: any) => void;
}

const StepIdentification = ({ data, onDataChange }: StepIdentificationProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="client_name" className="text-slate-300 mb-2 block">
            Imię i nazwisko klienta
          </Label>
          <Input
            id="client_name"
            value={data.client_name}
            onChange={(e) => onDataChange("client_name", e.target.value)}
            placeholder="np. Jan Kowalski"
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
          />
        </div>

        <div>
          <Label htmlFor="vehicle_brand" className="text-slate-300 mb-2 block">
            Marka pojazdu
          </Label>
          <Input
            id="vehicle_brand"
            value={data.vehicle_brand}
            onChange={(e) => onDataChange("vehicle_brand", e.target.value)}
            placeholder="np. BMW"
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
          />
        </div>

        <div>
          <Label htmlFor="vehicle_model" className="text-slate-300 mb-2 block">
            Model pojazdu
          </Label>
          <Input
            id="vehicle_model"
            value={data.vehicle_model}
            onChange={(e) => onDataChange("vehicle_model", e.target.value)}
            placeholder="np. X5"
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
          />
        </div>

        <div>
          <Label htmlFor="vehicle_vin" className="text-slate-300 mb-2 block">
            Numer VIN (17 znaków)
          </Label>
          <Input
            id="vehicle_vin"
            value={data.vehicle_vin}
            onChange={(e) => onDataChange("vehicle_vin", e.target.value.toUpperCase().slice(0, 17))}
            placeholder="np. WBADT43452G911234"
            maxLength={17}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 font-mono"
          />
          <p className="text-xs text-slate-500 mt-1">{data.vehicle_vin.length}/17 znaków</p>
        </div>

        <div>
          <Label htmlFor="vehicle_registration" className="text-slate-300 mb-2 block">
            Numer rejestracyjny
          </Label>
          <Input
            id="vehicle_registration"
            value={data.vehicle_registration}
            onChange={(e) => onDataChange("vehicle_registration", e.target.value.toUpperCase())}
            placeholder="np. WBG1234"
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 font-mono"
          />
        </div>

        <div>
          <Label htmlFor="vehicle_mileage" className="text-slate-300 mb-2 block">
            Przebieg (km)
          </Label>
          <Input
            id="vehicle_mileage"
            type="number"
            value={data.vehicle_mileage}
            onChange={(e) => onDataChange("vehicle_mileage", e.target.value)}
            placeholder="np. 45000"
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
        <p className="text-sm text-slate-300">
          Upewnij się, że wszystkie dane są poprawne. Numer VIN powinien zawierać dokładnie 17 znaków.
        </p>
      </div>
    </div>
  );
};

export default StepIdentification;

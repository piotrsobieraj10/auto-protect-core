import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StepIdentificationProps {
  data: any;
  onDataChange: (field: string, value: any) => void;
}

const fuelTypes = [
  { value: "benzyna", label: "Benzyna" },
  { value: "diesel", label: "Diesel" },
  { value: "hybryda", label: "Hybryda" },
  { value: "hybryda-plug-in", label: "Hybryda Plug-in" },
  { value: "elektryczny", label: "Elektryczny" },
  { value: "lpg", label: "LPG" },
  { value: "cng", label: "CNG" },
];

const StepIdentification = ({ data, onDataChange }: StepIdentificationProps) => {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
          Dane klienta
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="client_name" className="text-slate-300 mb-2 block text-sm">
              Nazwa / Imię i nazwisko
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
            <Label htmlFor="client_address" className="text-slate-300 mb-2 block text-sm">
              Adres
            </Label>
            <Input
              id="client_address"
              value={data.client_address}
              onChange={(e) => onDataChange("client_address", e.target.value)}
              placeholder="np. ul. Przykładowa 1, 00-001 Warszawa"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
          Dane pojazdu
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="vehicle_brand" className="text-slate-300 mb-2 block text-sm">
              Marka
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
            <Label htmlFor="vehicle_model" className="text-slate-300 mb-2 block text-sm">
              Model
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
            <Label htmlFor="vehicle_registration" className="text-slate-300 mb-2 block text-sm">
              Nr rejestracyjny
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
            <Label htmlFor="vehicle_year" className="text-slate-300 mb-2 block text-sm">
              Rok produkcji
            </Label>
            <Input
              id="vehicle_year"
              type="number"
              value={data.vehicle_year}
              onChange={(e) => onDataChange("vehicle_year", e.target.value)}
              placeholder="np. 2020"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>
          <div>
            <Label htmlFor="vehicle_vin" className="text-slate-300 mb-2 block text-sm">
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
            <p className="text-xs text-slate-500 mt-1">{(data.vehicle_vin || "").length}/17 znaków</p>
          </div>
          <div>
            <Label htmlFor="vehicle_mileage" className="text-slate-300 mb-2 block text-sm">
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
          <div>
            <Label htmlFor="fuel_type" className="text-slate-300 mb-2 block text-sm">
              Rodzaj paliwa
            </Label>
            <Select value={data.fuel_type} onValueChange={(value) => onDataChange("fuel_type", value)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Wybierz rodzaj paliwa" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {fuelTypes.map((ft) => (
                  <SelectItem key={ft.value} value={ft.value} className="text-white">
                    {ft.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepIdentification;

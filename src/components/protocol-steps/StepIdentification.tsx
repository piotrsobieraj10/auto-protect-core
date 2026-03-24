import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { useRef } from "react";

interface StepIdentificationProps {
  data: any;
  onDataChange: (field: string, value: any) => void;
}

const StepIdentification = ({ data, onDataChange }: StepIdentificationProps) => {
  const frontFileRef = useRef<HTMLInputElement>(null);
  const vinFileRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (field: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onDataChange(field, e.target?.result);
    };
    reader.readAsDataURL(file);
  };

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
          <Label htmlFor="vehicle_year" className="text-slate-300 mb-2 block">
            Rocznik pojazdu
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

      <div className="space-y-4">
        <div>
          <Label className="text-slate-300 mb-2 block">Zdjęcie przodu pojazdu z nr rej.</Label>
          {data.vehicle_photo_front ? (
            <div className="relative w-full max-w-sm">
              <img
                src={data.vehicle_photo_front}
                alt="Przód pojazdu"
                className="w-full h-32 object-cover rounded-lg border border-blue-500"
              />
              <button
                onClick={() => onDataChange("vehicle_photo_front", "")}
                className="absolute top-1 right-1 bg-red-600 rounded-full p-1 hover:bg-red-700"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => frontFileRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-600 rounded-lg p-4 text-center hover:border-blue-500 transition-colors"
            >
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Kliknij, aby dodać zdjęcie</p>
            </button>
          )}
          <input
            ref={frontFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handlePhotoUpload("vehicle_photo_front", e.target.files[0]);
              }
            }}
          />
        </div>

        <div>
          <Label className="text-slate-300 mb-2 block">Zdjęcie numeru VIN</Label>
          {data.vehicle_photo_vin ? (
            <div className="relative w-full max-w-sm">
              <img
                src={data.vehicle_photo_vin}
                alt="Numer VIN"
                className="w-full h-32 object-cover rounded-lg border border-blue-500"
              />
              <button
                onClick={() => onDataChange("vehicle_photo_vin", "")}
                className="absolute top-1 right-1 bg-red-600 rounded-full p-1 hover:bg-red-700"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => vinFileRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-600 rounded-lg p-4 text-center hover:border-blue-500 transition-colors"
            >
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Kliknij, aby dodać zdjęcie</p>
            </button>
          )}
          <input
            ref={vinFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handlePhotoUpload("vehicle_photo_vin", e.target.files[0]);
              }
            }}
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

import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Upload, Trash2 } from "lucide-react";

interface StepTestsAndAcceptanceProps {
  data: any;
  onDataChange: (field: string, value: any) => void;
}

const tests = [
  { field: "test_disarm_key", label: "Rozbrojenie immobilizera brelokiem" },
  { field: "test_disarm_pin", label: "Rozbrojenie immobilizera kodem PIN" },
  { field: "test_service_mode", label: "Sprawdzenie trybu serwisowego" },
  { field: "test_obd", label: "Brak błędów OBD" },
];

const photoSlots = [
  { field: "vehicle_photo_front", label: "Przód pojazdu z nr rej." },
  { field: "vehicle_photo_vin", label: "Numer VIN" },
  { field: "vehicle_photo_gauges", label: "Zegary po uruchomieniu" },
];

const StepTestsAndAcceptance = ({ data, onDataChange }: StepTestsAndAcceptanceProps) => {
  const fileRefs = {
    vehicle_photo_front: useRef<HTMLInputElement>(null),
    vehicle_photo_vin: useRef<HTMLInputElement>(null),
    vehicle_photo_gauges: useRef<HTMLInputElement>(null),
  };

  const handlePhotoUpload = (field: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onDataChange(field, e.target?.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label className="text-slate-300 text-base font-semibold block">
          Wyniki testów funkcjonalnych
        </Label>

        <div className="rounded-xl border border-slate-700 overflow-hidden">
          <div className="grid grid-cols-[1fr_auto] bg-slate-700/60 px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>Test</span>
            <span className="pr-1">Wynik</span>
          </div>
          {tests.map(({ field, label }) => (
            <div
              key={field}
              className="grid grid-cols-[1fr_auto] items-center px-4 py-3 border-t border-slate-700/60 gap-4"
            >
              <span className="text-sm text-slate-200">{label}</span>
              <Select
                value={data[field] === null || data[field] === undefined ? "" : String(data[field])}
                onValueChange={(value) => onDataChange(field, value === "true")}
              >
                <SelectTrigger className="w-28 bg-slate-700 border-slate-600 text-white text-sm">
                  <SelectValue placeholder="—" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="true" className="text-green-400">TAK</SelectItem>
                  <SelectItem value="false" className="text-red-400">NIE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-slate-300 text-base font-semibold flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-400" />
          Zdjęcia dokumentacyjne
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {photoSlots.map(({ field, label }) => {
            const ref = fileRefs[field as keyof typeof fileRefs];
            return (
              <div key={field} className="space-y-2">
                <p className="text-xs text-slate-400 font-medium">{label}</p>
                {data[field] ? (
                  <div className="relative group">
                    <img
                      src={data[field]}
                      alt={label}
                      className="w-full h-32 object-cover rounded-lg border border-blue-500"
                    />
                    <button
                      onClick={() => onDataChange(field, "")}
                      className="absolute top-1 right-1 bg-red-600 rounded-full p-1 hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => ref.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-blue-500 transition-colors group"
                  >
                    <Upload className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                    <span className="text-xs text-slate-500 group-hover:text-blue-400 transition-colors">
                      Dodaj zdjęcie
                    </span>
                  </button>
                )}
                <input
                  ref={ref}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handlePhotoUpload(field, e.target.files[0]);
                    }
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepTestsAndAcceptance;

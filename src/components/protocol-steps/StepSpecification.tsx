import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StepSpecificationProps {
  data: any;
  onDataChange: (field: string, value: any) => void;
}

const securityTypes = [
  { value: "gps-etoll", label: "GPS e-TOLL" },
  { value: "immobilizer-can", label: "Immobilizer CAN" },
  { value: "fuel-blocking", label: "Blokada paliwa" },
  { value: "combined", label: "System złożony" },
];

const deviceModels = [
  { value: "model-a1", label: "Model A1" },
  { value: "model-a2", label: "Model A2" },
  { value: "model-pro", label: "Model Pro" },
  { value: "model-smart", label: "Model Smart" },
];

const StepSpecification = ({ data, onDataChange }: StepSpecificationProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="security_type" className="text-slate-300 mb-2 block">
          Typ zabezpieczenia
        </Label>
        <Select value={data.security_type} onValueChange={(value) => onDataChange("security_type", value)}>
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
            <SelectValue placeholder="Wybierz typ zabezpieczenia" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            {securityTypes.map((type) => (
              <SelectItem key={type.value} value={type.value} className="text-white">
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="device_model" className="text-slate-300 mb-2 block">
          Model urządzenia
        </Label>
        <Select value={data.device_model} onValueChange={(value) => onDataChange("device_model", value)}>
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
            <SelectValue placeholder="Wybierz model urządzenia" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            {deviceModels.map((model) => (
              <SelectItem key={model.value} value={model.value} className="text-white">
                {model.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="imei_id" className="text-slate-300 mb-2 block">
          Numer IMEI/ID urządzenia
        </Label>
        <Input
          id="imei_id"
          value={data.imei_id}
          onChange={(e) => onDataChange("imei_id", e.target.value)}
          placeholder="np. 359072096481066"
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 font-mono"
        />
        <p className="text-xs text-slate-500 mt-1">Unikalny identyfikator urządzenia</p>
      </div>

      <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-4">
        <p className="text-sm text-blue-300">
          Wpisy techniczne: Wybierz typ zabezpieczenia odpowiadający instalowanemu urządzeniu. Model urządzenia musi być dostępny w bazie AutoSafe.
        </p>
      </div>
    </div>
  );
};

export default StepSpecification;

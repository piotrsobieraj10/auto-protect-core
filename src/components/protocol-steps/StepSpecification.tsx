import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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

const caniModels = [
  { value: "seo-cani-u333-76-10", label: "Seo Cani U333_76_10" },
  { value: "seo-cani-u335-76-10", label: "Seo Cani U335_76_10" },
  { value: "seo-canblu-u335-77-12", label: "Seo Canblu U335_77_12 z 2 brelokami" },
  { value: "seo-canblu-u335-77-a1", label: "Seo Canblu U335_77_A1 z 2 brelokami" },
  { value: "seo-canblu-u335-77-a2-2", label: "Seo Canblu U335_77_A2 z 2 brelokami" },
  { value: "seo-canblu-u335-77-a2", label: "Seo Canblu U335_77_A2" },
  { value: "seo-cani-u122-50-05", label: "Seo Cani U122_50_05" },
  { value: "seo-cani-u122-50-10", label: "Seo Cani U122_50_10" },
];

const otherModels = [
  { value: "gps-model-pro", label: "GPS Model Pro" },
  { value: "gps-model-smart", label: "GPS Model Smart" },
  { value: "fuel-block-v1", label: "Fuel Block V1" },
];

const StepSpecification = ({ data, onDataChange }: StepSpecificationProps) => {
  const isImmobilizer = data.security_type === "immobilizer-can";
  const deviceModels = isImmobilizer ? caniModels : otherModels;

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="security_type" className="text-slate-300 mb-2 block">
          Typ zabezpieczenia
        </Label>
        <Select
          value={data.security_type}
          onValueChange={(value) => {
            onDataChange("security_type", value);
            onDataChange("device_model", "");
          }}
        >
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

      {data.security_type && (
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
      )}

      <div>
        <Label htmlFor="serial_number" className="text-slate-300 mb-2 block">
          Nr fabryczny
        </Label>
        <Input
          id="serial_number"
          value={data.serial_number}
          onChange={(e) => onDataChange("serial_number", e.target.value)}
          placeholder="Numer seryjny urządzenia"
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 font-mono"
        />
      </div>

      <div>
        <Label className="text-slate-300 mb-2 block">Nr homologacji</Label>
        <div className="flex items-center gap-3 bg-slate-700/50 border border-slate-600 rounded-md px-4 py-2.5">
          <span className="text-white font-mono font-semibold">E20</span>
          <Badge variant="outline" className="border-blue-500/50 text-blue-400 text-xs">
            Stała wartość
          </Badge>
        </div>
        <p className="text-xs text-slate-500 mt-1">Pole nieedytowalne — homologacja obowiązuje dla wszystkich urządzeń</p>
      </div>

      {isImmobilizer && (
        <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-4">
          <p className="text-sm text-blue-300">
            Wybrano Immobilizer CAN — dostępne są modele Seo Cani dla tego typu zabezpieczenia.
          </p>
        </div>
      )}
    </div>
  );
};

export default StepSpecification;

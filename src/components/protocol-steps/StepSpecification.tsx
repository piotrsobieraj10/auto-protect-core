import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Video, Upload, Trash2, Camera } from "lucide-react";

interface StepSpecificationProps {
  data: any;
  onDataChange: (field: string, value: any) => void;
}

const securityTypes = [
  { value: "immobilizer-can", label: "Immobilizer CAN" },
  { value: "gps", label: "GPS" },
];

const caniModels = [
  { value: "seo-cani-u333-76-10",    label: "Seo Cani U333_76_10" },
  { value: "seo-cani-u335-76-10",    label: "Seo Cani U335_76_10" },
  { value: "seo-canblu-u335-77-12",  label: "Seo Canblu U335_77_12 z 2 brelokami" },
  { value: "seo-canblu-u335-77-a1",  label: "Seo Canblu U335_77_A1 z 2 brelokami" },
  { value: "seo-canblu-u335-77-a2-2",label: "Seo Canblu U335_77_A2 z 2 brelokami" },
  { value: "seo-canblu-u335-77-a2",  label: "Seo Canblu U335_77_A2" },
  { value: "seo-cani-u122-50-05",    label: "Seo Cani U122_50_05" },
  { value: "seo-cani-u122-50-10",    label: "Seo Cani U122_50_10" },
];

const installPhotoSlots = [
  { field: "install_photo_1", label: "Zdjęcie 1" },
  { field: "install_photo_2", label: "Zdjęcie 2" },
  { field: "install_photo_3", label: "Zdjęcie 3" },
];

const StepSpecification = ({ data, onDataChange }: StepSpecificationProps) => {
  const isImmobilizer = data.security_type === "immobilizer-can";
  const isGps = data.security_type === "gps";

  const videoRef = useRef<HTMLInputElement>(null);
  const photoRefs = {
    install_photo_1: useRef<HTMLInputElement>(null),
    install_photo_2: useRef<HTMLInputElement>(null),
    install_photo_3: useRef<HTMLInputElement>(null),
  };

  const handleFileRead = (field: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => onDataChange(field, e.target?.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Security type */}
      <div>
        <Label htmlFor="security_type" className="text-slate-300 mb-2 block">
          Typ zabezpieczenia
        </Label>
        <Select
          value={data.security_type}
          onValueChange={(value) => {
            onDataChange("security_type", value);
            onDataChange("device_model", "");
            onDataChange("serial_number", "");
          }}
        >
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
            <SelectValue placeholder="Wybierz typ zabezpieczenia" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            {securityTypes.map((t) => (
              <SelectItem key={t.value} value={t.value} className="text-white">
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Model — dropdown for immobilizer, text for GPS */}
      {isImmobilizer && (
        <div>
          <Label htmlFor="device_model" className="text-slate-300 mb-2 block">
            Model urządzenia
          </Label>
          <Select
            value={data.device_model}
            onValueChange={(value) => onDataChange("device_model", value)}
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Wybierz model urządzenia" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {caniModels.map((m) => (
                <SelectItem key={m.value} value={m.value} className="text-white">
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {isGps && (
        <div>
          <Label htmlFor="device_model" className="text-slate-300 mb-2 block">
            Model urządzenia GPS
          </Label>
          <Input
            id="device_model"
            value={data.device_model}
            onChange={(e) => onDataChange("device_model", e.target.value)}
            placeholder="Wpisz model urządzenia GPS"
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
          />
        </div>
      )}

      {/* Serial number — GPS only */}
      {isGps && (
        <div>
          <Label htmlFor="serial_number" className="text-slate-300 mb-2 block">
            Nr fabryczny urządzenia
          </Label>
          <Input
            id="serial_number"
            value={data.serial_number}
            onChange={(e) => onDataChange("serial_number", e.target.value)}
            placeholder="Numer seryjny urządzenia GPS"
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 font-mono"
          />
        </div>
      )}

      {/* Homologation — always shown */}
      {data.security_type && (
        <div>
          <Label className="text-slate-300 mb-2 block">Nr homologacji</Label>
          <div className="flex items-center gap-3 bg-slate-700/50 border border-slate-600 rounded-md px-4 py-2.5">
            <span className="text-white font-mono font-semibold">E20</span>
            <Badge variant="outline" className="border-blue-500/50 text-blue-400 text-xs">
              Stała wartość
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pole nieedytowalne — homologacja obowiązuje dla wszystkich urządzeń
          </p>
        </div>
      )}

      {/* Immobilizer-only: video + installation photos */}
      {isImmobilizer && (
        <>
          {/* Video recording / upload */}
          <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-5 space-y-3">
            <Label className="text-slate-300 flex items-center gap-2">
              <Video className="w-4 h-4 text-blue-400" />
              Nagranie z miejsca montażu
            </Label>
            {data.install_video ? (
              <div className="space-y-2">
                <video
                  src={data.install_video}
                  controls
                  className="w-full rounded-lg border border-blue-500 max-h-48"
                />
                <button
                  type="button"
                  onClick={() => onDataChange("install_video", "")}
                  className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Usuń nagranie
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => videoRef.current?.click()}
                className="w-full h-28 border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-blue-500 transition-colors group"
              >
                <Video className="w-6 h-6 text-slate-500 group-hover:text-blue-400 transition-colors" />
                <span className="text-sm text-slate-500 group-hover:text-blue-400 transition-colors">
                  Nagraj lub dodaj wideo z montażu
                </span>
                <span className="text-xs text-slate-600">MP4, MOV, AVI</span>
              </button>
            )}
            <input
              ref={videoRef}
              type="file"
              accept="video/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileRead("install_video", e.target.files[0]);
              }}
            />
          </div>

          {/* Installation photos */}
          <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-5 space-y-3">
            <Label className="text-slate-300 flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-400" />
              Zdjęcia z montażu
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {installPhotoSlots.map(({ field, label }) => {
                const ref = photoRefs[field as keyof typeof photoRefs];
                return (
                  <div key={field} className="space-y-1">
                    <p className="text-xs text-slate-500">{label}</p>
                    {data[field] ? (
                      <div className="relative group">
                        <img
                          src={data[field]}
                          alt={label}
                          className="w-full h-24 object-cover rounded-lg border border-blue-500"
                        />
                        <button
                          onClick={() => onDataChange(field, "")}
                          className="absolute top-1 right-1 bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => ref.current?.click()}
                        className="w-full h-24 border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-blue-500 transition-colors group"
                      >
                        <Upload className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                        <span className="text-xs text-slate-500 group-hover:text-blue-400">Dodaj</span>
                      </button>
                    )}
                    <input
                      ref={ref}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleFileRead(field, e.target.files[0]);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StepSpecification;

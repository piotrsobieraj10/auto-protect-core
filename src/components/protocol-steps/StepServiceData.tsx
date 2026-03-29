import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Lock, Video, Camera, Upload, Trash2 } from "lucide-react";

interface StepServiceDataProps {
  data: any;
  onDataChange: (field: string, value: any) => void;
}

const installPhotoSlots = [
  { field: "install_photo_1", label: "Zdjęcie 1" },
  { field: "install_photo_2", label: "Zdjęcie 2" },
  { field: "install_photo_3", label: "Zdjęcie 3" },
];

const StepServiceData = ({ data, onDataChange }: StepServiceDataProps) => {
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
      </div>
    </div>
  );
};

export default StepServiceData;

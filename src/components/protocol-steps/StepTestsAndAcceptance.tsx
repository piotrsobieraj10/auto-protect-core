import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Trash2 } from "lucide-react";

interface StepTestsAndAcceptanceProps {
  data: any;
  onDataChange: (field: string, value: any) => void;
}

const StepTestsAndAcceptance = ({ data, onDataChange }: StepTestsAndAcceptanceProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photosFileRef = useRef<HTMLInputElement>(null);
  const videoFileRef = useRef<HTMLInputElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#3b82f6";
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        onDataChange("signature", "");
      }
    }
  };

  const saveSignature = () => {
    if (canvasRef.current) {
      const signature = canvasRef.current.toDataURL();
      onDataChange("signature", signature);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      onDataChange("photos", [...data.photos, ...newPhotos]);
    }
    if (photosFileRef.current) {
      photosFileRef.current.value = "";
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      onDataChange("video", videoUrl);
    }
    if (videoFileRef.current) {
      videoFileRef.current.value = "";
    }
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = data.photos.filter((_: string, i: number) => i !== index);
    onDataChange("photos", updatedPhotos);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-slate-300 text-base font-semibold block">
          Wyniki testów funkcjonalnych
        </Label>

        <div className="space-y-3">
          <div>
            <Label className="text-slate-300 mb-2 block text-sm">Rozbrojenie immobilizera brelokiem</Label>
            <Select
              value={data.test_disarm_key === null ? "" : String(data.test_disarm_key)}
              onValueChange={(value) => onDataChange("test_disarm_key", value === "true")}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Wybierz wynik" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="true" className="text-white">Tak</SelectItem>
                <SelectItem value="false" className="text-white">Nie</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-300 mb-2 block text-sm">Rozbrojenie immobilizera kodem PIN</Label>
            <Select
              value={data.test_disarm_pin === null ? "" : String(data.test_disarm_pin)}
              onValueChange={(value) => onDataChange("test_disarm_pin", value === "true")}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Wybierz wynik" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="true" className="text-white">Tak</SelectItem>
                <SelectItem value="false" className="text-white">Nie</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-300 mb-2 block text-sm">Sprawdzenie trybu serwisowego</Label>
            <Select
              value={data.test_service_mode === null ? "" : String(data.test_service_mode)}
              onValueChange={(value) => onDataChange("test_service_mode", value === "true")}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Wybierz wynik" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="true" className="text-white">Tak</SelectItem>
                <SelectItem value="false" className="text-white">Nie</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-slate-300 text-base font-semibold block">
          Film z lokalizacją urządzenia (opcjonalnie)
        </Label>
        {data.video ? (
          <div className="relative">
            <video
              src={data.video}
              controls
              className="w-full rounded-lg border border-blue-500 max-h-64"
            />
            <Button
              size="sm"
              variant="destructive"
              className="absolute top-2 right-2"
              onClick={() => onDataChange("video", "")}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
            onClick={() => videoFileRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Dodaj film
          </Button>
        )}
        <input
          ref={videoFileRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleVideoUpload}
        />
      </div>

      <div className="space-y-3">
        <Label className="text-slate-300 text-base font-semibold block">
          Zdjęcia montażowe (opcjonalnie)
        </Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
            onClick={() => photosFileRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Dodaj zdjęcia
          </Button>
          <input
            ref={photosFileRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </div>

        {data.photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {data.photos.map((photo: string, index: number) => (
              <div key={index} className="relative group">
                <img
                  src={photo}
                  alt={`Zdjęcie ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-slate-600"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removePhoto(index)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Label className="text-slate-300 text-base font-semibold block">
          Podpis klienta
        </Label>
        <canvas
          ref={canvasRef}
          width={400}
          height={150}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          className="w-full border-2 border-blue-500 rounded-lg bg-slate-700 cursor-crosshair"
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
            onClick={clearSignature}
          >
            Wyczyść
          </Button>
          <Button
            type="button"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={saveSignature}
          >
            Zapisz podpis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepTestsAndAcceptance;

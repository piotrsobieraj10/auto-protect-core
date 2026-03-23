import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Trash2 } from "lucide-react";

interface StepTestsAndAcceptanceProps {
  data: any;
  onDataChange: (field: string, value: any) => void;
}

const StepTestsAndAcceptance = ({ data, onDataChange }: StepTestsAndAcceptanceProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      onDataChange("photos", [...data.photos, ...newPhotos]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
          Checklista sprawności
        </Label>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors">
            <Checkbox
              id="gps_working"
              checked={data.gps_working}
              onCheckedChange={(checked) => onDataChange("gps_working", checked)}
              className="border-slate-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
            />
            <Label htmlFor="gps_working" className="text-slate-300 cursor-pointer flex-1">
              GPS pracuje poprawnie
            </Label>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors">
            <Checkbox
              id="blocking_working"
              checked={data.blocking_working}
              onCheckedChange={(checked) => onDataChange("blocking_working", checked)}
              className="border-slate-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
            />
            <Label htmlFor="blocking_working" className="text-slate-300 cursor-pointer flex-1">
              Blokada paliwa pracuje poprawnie
            </Label>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors">
            <Checkbox
              id="no_obd_errors"
              checked={data.no_obd_errors}
              onCheckedChange={(checked) => onDataChange("no_obd_errors", checked)}
              className="border-slate-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
            />
            <Label htmlFor="no_obd_errors" className="text-slate-300 cursor-pointer flex-1">
              Brak błędów OBD
            </Label>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-slate-300 text-base font-semibold block">
          Zdjęcia (opcjonalnie)
        </Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Dodaj zdjęcia
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
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

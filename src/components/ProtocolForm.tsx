import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const DEVICES = [
  { id: "canlock-u335-77-a2", label: "CanLock U335_77_A2" },
  { id: "canlock-u335-77-a1", label: "CanLock U335_77_A1" },
  { id: "canlock-u335-76-10", label: "CanLock U335_76_10" },
  { id: "canlock-u335-76-05", label: "CanLock U335_76_05" },
  { id: "canlock-u122-50-10", label: "CanLock U122_50_10" },
  { id: "canlock-u122-50-05", label: "CanLock U122_50_05" },
  { id: "gps-tracker", label: "GPS Tracker" },
];

interface Props {
  onBack: () => void;
}

const ProtocolForm = ({ onBack }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  const [form, setForm] = useState({
    vehicle_brand: "",
    vehicle_model: "",
    vehicle_vin: "",
    vehicle_year: new Date().getFullYear(),
    vehicle_registration: "",
    device_update_date: "",
    program_number: "",
    additional_notes: "",
  });

  const [vehiclePhoto, setVehiclePhoto] = useState<File | null>(null);
  const [vinPhoto, setVinPhoto] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  const uploadFile = async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from("protocol-files")
      .upload(path, file, { upsert: true });
    if (error) throw error;
    const { data: urlData } = supabase.storage
      .from("protocol-files")
      .getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (selectedDevices.length === 0) {
      toast({ title: "Wybierz co najmniej jedno urządzenie", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const ts = Date.now();
      let vehicle_photo_url = null;
      let vin_photo_url = null;
      let video_url = null;

      if (vehiclePhoto) {
        vehicle_photo_url = await uploadFile(vehiclePhoto, `${user.id}/${ts}_vehicle.${vehiclePhoto.name.split('.').pop()}`);
      }
      if (vinPhoto) {
        vin_photo_url = await uploadFile(vinPhoto, `${user.id}/${ts}_vin.${vinPhoto.name.split('.').pop()}`);
      }
      if (video) {
        video_url = await uploadFile(video, `${user.id}/${ts}_video.${video.name.split('.').pop()}`);
      }

      const { error } = await supabase.from("protocols").insert({
        user_id: user.id,
        vehicle_brand: form.vehicle_brand,
        vehicle_model: form.vehicle_model,
        vehicle_vin: form.vehicle_vin,
        vehicle_year: form.vehicle_year,
        vehicle_registration: form.vehicle_registration,
        devices: selectedDevices,
        device_update_date: form.device_update_date || null,
        program_number: form.program_number || null,
        video_url,
        vehicle_photo_url,
        vin_photo_url,
        additional_notes: form.additional_notes || null,
      });

      if (error) throw error;

      // Send email notification
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      await fetch(`https://${projectId}.supabase.co/functions/v1/send-protocol-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${anonKey}`,
        },
        body: JSON.stringify({
          vehicle_brand: form.vehicle_brand,
          vehicle_model: form.vehicle_model,
          vehicle_vin: form.vehicle_vin,
          vehicle_year: form.vehicle_year,
          vehicle_registration: form.vehicle_registration,
          devices: selectedDevices,
          device_update_date: form.device_update_date,
          program_number: form.program_number,
          additional_notes: form.additional_notes,
        }),
      });

      toast({ title: "Protokół zapisany!", description: "Powiadomienie zostało wysłane na e-mail." });
      onBack();
    } catch (err: any) {
      toast({ title: "Błąd", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const toggleDevice = (label: string) => {
    setSelectedDevices((prev) =>
      prev.includes(label) ? prev.filter((d) => d !== label) : [...prev, label]
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Powrót
        </Button>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="AutoSafe" className="h-10 w-10 invert" />
              <CardTitle>Nowy protokół odbioru</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Vehicle data */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Dane pojazdu</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Marka</Label>
                    <Input required value={form.vehicle_brand} onChange={(e) => setForm({ ...form, vehicle_brand: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Input required value={form.vehicle_model} onChange={(e) => setForm({ ...form, vehicle_model: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>VIN</Label>
                    <Input required value={form.vehicle_vin} onChange={(e) => setForm({ ...form, vehicle_vin: e.target.value })} maxLength={17} />
                  </div>
                  <div className="space-y-2">
                    <Label>Rocznik</Label>
                    <Input type="number" required value={form.vehicle_year} onChange={(e) => setForm({ ...form, vehicle_year: parseInt(e.target.value) })} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Nr rejestracyjny</Label>
                    <Input required value={form.vehicle_registration} onChange={(e) => setForm({ ...form, vehicle_registration: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Devices */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Montowane urządzenia</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {DEVICES.map((device) => (
                    <label key={device.id} className="flex items-center gap-3 p-3 rounded-md border border-border hover:border-primary/50 cursor-pointer transition-colors">
                      <Checkbox
                        checked={selectedDevices.includes(device.label)}
                        onCheckedChange={() => toggleDevice(device.label)}
                      />
                      <span className="text-sm">{device.label}</span>
                    </label>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Data aktualizacji urządzenia</Label>
                    <Input type="date" value={form.device_update_date} onChange={(e) => setForm({ ...form, device_update_date: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Nr ustawionego programu</Label>
                    <Input value={form.program_number} onChange={(e) => setForm({ ...form, program_number: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Files */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Pliki</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Zdjęcie pojazdu</Label>
                    <Input type="file" accept="image/*" onChange={(e) => setVehiclePhoto(e.target.files?.[0] || null)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Zdjęcie nr VIN</Label>
                    <Input type="file" accept="image/*" onChange={(e) => setVinPhoto(e.target.files?.[0] || null)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Film z montażu</Label>
                    <Input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files?.[0] || null)} />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>Dodatkowe uwagi</Label>
                <Textarea value={form.additional_notes} onChange={(e) => setForm({ ...form, additional_notes: e.target.value })} rows={4} />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Zapisywanie..." : "Zatwierdź protokół"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProtocolForm;

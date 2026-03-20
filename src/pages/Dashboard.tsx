import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Plus, FileText, Download } from "lucide-react";
import ProtocolForm from "@/components/ProtocolForm";

interface Protocol {
  id: string;
  created_at: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_vin: string;
  vehicle_year: number;
  vehicle_registration: string;
  devices: string[];
  device_update_date: string | null;
  program_number: string | null;
  video_url: string | null;
  vehicle_photo_url: string | null;
  vin_photo_url: string | null;
  additional_notes: string | null;
  status: string;
}

const Dashboard = () => {
  const { user, loading, isApproved, signOut } = useAuth();
  const navigate = useNavigate();
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [loadingProtocols, setLoadingProtocols] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user && isApproved) {
      fetchProtocols();
    }
  }, [user, isApproved]);

  const fetchProtocols = async () => {
    setLoadingProtocols(true);
    const { data } = await supabase
      .from("protocols")
      .select("*")
      .order("created_at", { ascending: false });
    setProtocols((data as Protocol[]) || []);
    setLoadingProtocols(false);
  };

  const handleDownloadPdf = async (protocol: Protocol) => {
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    
    const res = await fetch(
      `https://${projectId}.supabase.co/functions/v1/generate-protocol-pdf`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${anonKey}`,
        },
        body: JSON.stringify({ protocol }),
      }
    );

    if (!res.ok) {
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `protokol_${protocol.vehicle_registration}_${new Date(protocol.created_at).toISOString().slice(0, 10)}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Ładowanie...</p>
      </div>
    );
  }

  if (!isApproved) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Konto oczekuje na zatwierdzenie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Twoje konto nie zostało jeszcze zatwierdzone przez administratora. Spróbuj ponownie później.
            </p>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" /> Wyloguj się
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showForm) {
    return (
      <ProtocolForm
        onBack={() => {
          setShowForm(false);
          fetchProtocols();
        }}
      />
    );
  }

  if (selectedProtocol) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <Button variant="ghost" onClick={() => setSelectedProtocol(null)} className="mb-4">
            ← Powrót do listy
          </Button>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Protokół odbioru</CardTitle>
              <Button size="sm" onClick={() => handleDownloadPdf(selectedProtocol)}>
                <Download className="mr-2 h-4 w-4" /> Pobierz PDF
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="AutoSafe" className="h-12 w-12 invert" />
                <span className="font-bold text-lg">AutoSafe</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Marka:</span> {selectedProtocol.vehicle_brand}</div>
                <div><span className="text-muted-foreground">Model:</span> {selectedProtocol.vehicle_model}</div>
                <div><span className="text-muted-foreground">VIN:</span> {selectedProtocol.vehicle_vin}</div>
                <div><span className="text-muted-foreground">Rocznik:</span> {selectedProtocol.vehicle_year}</div>
                <div><span className="text-muted-foreground">Nr rejestracyjny:</span> {selectedProtocol.vehicle_registration}</div>
                <div><span className="text-muted-foreground">Data aktualizacji:</span> {selectedProtocol.device_update_date || "—"}</div>
                <div><span className="text-muted-foreground">Nr programu:</span> {selectedProtocol.program_number || "—"}</div>
                <div><span className="text-muted-foreground">Data:</span> {new Date(selectedProtocol.created_at).toLocaleDateString("pl-PL")}</div>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Urządzenia:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedProtocol.devices.map((d) => (
                    <span key={d} className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs">{d}</span>
                  ))}
                </div>
              </div>
              {selectedProtocol.additional_notes && (
                <div>
                  <span className="text-muted-foreground text-sm">Uwagi:</span>
                  <p className="mt-1 text-sm">{selectedProtocol.additional_notes}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedProtocol.vehicle_photo_url && (
                  <div>
                    <span className="text-muted-foreground text-sm">Zdjęcie pojazdu</span>
                    <img src={selectedProtocol.vehicle_photo_url} alt="Pojazd" className="rounded mt-1 w-full object-cover max-h-48" />
                  </div>
                )}
                {selectedProtocol.vin_photo_url && (
                  <div>
                    <span className="text-muted-foreground text-sm">Zdjęcie VIN</span>
                    <img src={selectedProtocol.vin_photo_url} alt="VIN" className="rounded mt-1 w-full object-cover max-h-48" />
                  </div>
                )}
              </div>
              {selectedProtocol.video_url && (
                <div>
                  <span className="text-muted-foreground text-sm">Film z montażu</span>
                  <video src={selectedProtocol.video_url} controls className="rounded mt-1 w-full max-h-64" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="AutoSafe" className="h-10 w-10 invert" />
            <h1 className="text-xl font-bold">Panel AutoSafe</h1>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" /> Nowy protokół
            </Button>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loadingProtocols ? (
          <p className="text-muted-foreground text-center py-12">Ładowanie protokołów...</p>
        ) : protocols.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Brak protokołów. Utwórz pierwszy!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {protocols.map((p) => (
              <Card key={p.id} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setSelectedProtocol(p)}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <div className="font-medium">{p.vehicle_brand} {p.vehicle_model}</div>
                    <div className="text-sm text-muted-foreground">
                      {p.vehicle_registration} • {new Date(p.created_at).toLocaleDateString("pl-PL")}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {p.devices.map((d) => (
                        <span key={d} className="bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded text-xs">{d}</span>
                      ))}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleDownloadPdf(p); }}>
                    <Download className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

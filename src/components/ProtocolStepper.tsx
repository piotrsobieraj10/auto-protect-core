import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, FileText, Mail, Archive, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import StepIdentification from "./protocol-steps/StepIdentification";
import StepSpecification from "./protocol-steps/StepSpecification";
import StepServiceData from "./protocol-steps/StepServiceData";
import StepTestsAndAcceptance from "./protocol-steps/StepTestsAndAcceptance";
import { toast } from "sonner";

interface ProtocolData {
  client_name: string;
  client_address: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_year: string;
  vehicle_vin: string;
  vehicle_registration: string;
  vehicle_mileage: string;
  fuel_type: string;
  security_type: string;
  device_model: string;
  serial_number: string;
  homologation_number: string;
  install_video: string;
  install_photo_1: string;
  install_photo_2: string;
  install_photo_3: string;
  control_unit_location: string;
  service_notes: string;
  test_disarm_key: boolean | null;
  test_disarm_pin: boolean | null;
  test_service_mode: boolean | null;
  vehicle_photo_front: string;
  vehicle_photo_vin: string;
  vehicle_photo_gauges: string;
}

interface ProtocolStepperProps {
  onBack: () => void;
}

const steps = [
  { id: 1, title: "Identyfikacja", description: "Dane klienta i pojazdu" },
  { id: 2, title: "Specyfikacja", description: "Typ zabezpieczenia i urządzenie" },
  { id: 3, title: "Dane Serwisowe", description: "Informacje poufne (archiwum)" },
  { id: 4, title: "Testy i Odbiór", description: "Wyniki testów i zdjęcia" },
];

const ProtocolStepper = ({ onBack }: ProtocolStepperProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSendingClient, setIsSendingClient] = useState(false);
  const [isSendingArchive, setIsSendingArchive] = useState(false);
  const [clientEmail, setClientEmail] = useState("");

  const [data, setData] = useState<ProtocolData>({
    client_name: "",
    client_address: "",
    vehicle_brand: "",
    vehicle_model: "",
    vehicle_year: "",
    vehicle_vin: "",
    vehicle_registration: "",
    vehicle_mileage: "",
    fuel_type: "",
    security_type: "",
    device_model: "",
    serial_number: "",
    homologation_number: "E20",
    install_video: "",
    install_photo_1: "",
    install_photo_2: "",
    install_photo_3: "",
    control_unit_location: "",
    service_notes: "",
    test_disarm_key: null,
    test_disarm_pin: null,
    test_service_mode: null,
    vehicle_photo_front: "",
    vehicle_photo_vin: "",
    vehicle_photo_gauges: "",
  });

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleDataChange = (field: string, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGeneratePDF = async (isArchive: boolean = false) => {
    setIsGenerating(true);
    try {
      const resp = await fetch("/api/generate-protocol-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ protocolData: data, isArchive }),
      });
      if (!resp.ok) throw new Error("PDF generation failed");
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const lastName = (data.client_name || "Klient").split(" ").pop() || "Klient";
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const reg = (data.vehicle_registration || "BEZ_REJ").replace(/\s+/g, "");
      a.download = `${dateStr}_${reg}_${lastName}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(isArchive ? "Archiwum wygenerowane!" : "Protokół dla klienta wygenerowany!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Błąd generowania PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendClientPDF = async () => {
    if (!clientEmail) { toast.error("Podaj adres e-mail klienta."); return; }
    setIsSendingClient(true);
    try {
      const res = await fetch("/api/send-client-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ protocolData: data, clientEmail }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Błąd wysyłki");
      }
      toast.success(`Protokół wysłany na ${clientEmail}`);
    } catch (err: any) {
      toast.error(err.message || "Błąd wysyłki protokołu do klienta.");
    } finally {
      setIsSendingClient(false);
    }
  };

  const handleArchiveAndSend = async () => {
    setIsSendingArchive(true);
    try {
      const res = await fetch("/api/archive-and-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ protocolData: data }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Błąd archiwizacji");
      }
      toast.success("Archiwum wysłane do AutoSafe!");
    } catch (err: any) {
      toast.error(err.message || "Błąd archiwizacji i wysyłki.");
    } finally {
      setIsSendingArchive(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <StepIdentification data={data} onDataChange={handleDataChange} />;
      case 2: return <StepSpecification data={data} onDataChange={handleDataChange} />;
      case 3: return <StepServiceData data={data} onDataChange={handleDataChange} />;
      case 4: return <StepTestsAndAcceptance data={data} onDataChange={handleDataChange} />;
      default: return null;
    }
  };

  const isLastStep = currentStep === steps.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Strona główna
        </button>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-white">Protokół Odbioru Prac</h1>
            <span className="text-slate-400 text-sm">Krok {currentStep} z {steps.length}</span>
          </div>
          <div className="flex gap-1">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  step.id <= currentStep ? "bg-blue-500" : "bg-slate-700"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <span
                key={step.id}
                className={`text-xs ${step.id === currentStep ? "text-blue-400 font-medium" : "text-slate-500"}`}
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Step card */}
        <Card className="bg-slate-800 border-slate-700 mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg">{steps[currentStep - 1].title}</CardTitle>
            <CardDescription className="text-slate-400">{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="min-h-64">{renderStep()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between mb-6">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="border-slate-600 text-slate-300 hover:bg-slate-700 rounded-xl"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Wstecz
          </Button>

          {isLastStep ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => handleGeneratePDF(false)}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700 rounded-xl text-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                {isGenerating ? "Generowanie..." : "Protokół klienta"}
              </Button>
              <Button
                onClick={() => handleGeneratePDF(true)}
                disabled={isGenerating}
                className="bg-amber-600 hover:bg-amber-700 rounded-xl text-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                {isGenerating ? "Generowanie..." : "Archiwum"}
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              Dalej
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* ── Wysyłka i Archiwizacja (last step only) ─────────────────── */}
        {isLastStep && (
          <Card className="bg-slate-800/60 border-slate-700 border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-400" />
                Wysyłka i Archiwizacja
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Wyślij protokół do klienta lub zarchiwizuj kompletną dokumentację.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Send customer PDF to client */}
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm font-medium">Wyślij protokół do klienta</Label>
                <p className="text-xs text-slate-500">
                  Klient otrzyma jawny PDF — bez zdjęć montażu i danych poufnych.
                </p>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="adres@email.pl"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 flex-1"
                  />
                  <Button
                    onClick={handleSendClientPDF}
                    disabled={isSendingClient || !clientEmail}
                    className="bg-blue-600 hover:bg-blue-700 shrink-0"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    {isSendingClient ? "Wysyłanie..." : "Wyślij Protokół"}
                  </Button>
                </div>
              </div>

              <div className="border-t border-slate-700" />

              {/* Archive and send to AutoSafe */}
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm font-medium">Zakończ i zarchiwizuj</Label>
                <p className="text-xs text-slate-500">
                  Tworzy paczkę ZIP z protokołem jawnym, protokołem poufnym (ze zdjęciami montażu
                  i lokalizacją urządzenia) oraz nagraniem wideo. Wysyła na{" "}
                  <span className="text-slate-300 font-mono">autosafe@o2.pl</span>.
                </p>
                <Button
                  onClick={handleArchiveAndSend}
                  disabled={isSendingArchive}
                  className="w-full bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  {isSendingArchive
                    ? "Pakowanie i wysyłanie..."
                    : "Zakończ, Archiwizuj i Wyślij do AutoSafe"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProtocolStepper;

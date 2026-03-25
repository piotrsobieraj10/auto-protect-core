import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
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
      const res = await fetch("/api/generate-protocol-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ protocolData: data, isArchive }),
      });

      if (!res.ok) throw new Error("Failed to generate PDF");

      const blob = await res.blob();
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
      toast.error("Błąd generowania PDF. Spróbuj ponownie.");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepIdentification data={data} onDataChange={handleDataChange} />;
      case 2:
        return <StepSpecification data={data} onDataChange={handleDataChange} />;
      case 3:
        return <StepServiceData data={data} onDataChange={handleDataChange} />;
      case 4:
        return <StepTestsAndAcceptance data={data} onDataChange={handleDataChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Protokół Odbioru Prac</h1>
              <p className="text-slate-400">Krok {currentStep} z {steps.length}</p>
            </div>
            <Button
              variant="ghost"
              className="text-slate-400 hover:text-white rounded-xl"
              onClick={onBack}
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Powrót
            </Button>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex gap-2 mb-2">
              {steps.map((step) => (
                <div key={step.id} className="flex-1">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      step.id <= currentStep ? "bg-blue-500" : "bg-slate-700"
                    }`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs mt-1">
              {steps.map((step) => (
                <span
                  key={step.id}
                  className={`transition-colors ${
                    step.id <= currentStep ? "text-blue-400" : "text-slate-600"
                  }`}
                >
                  {step.title}
                </span>
              ))}
            </div>
          </div>

          <Card className="bg-slate-800 border-slate-700 mb-6 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white text-xl">{steps[currentStep - 1].title}</CardTitle>
              <CardDescription className="text-slate-400">
                {steps[currentStep - 1].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-64">{renderStep()}</CardContent>
          </Card>

          <div className="flex gap-3 justify-between">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 rounded-xl"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Wstecz
            </Button>

            {currentStep === steps.length ? (
              <div className="flex gap-2">
                <Button
                  onClick={() => handleGeneratePDF(false)}
                  disabled={isGenerating}
                  className="bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {isGenerating ? "Generowanie..." : "Protokół dla klienta"}
                </Button>
                <Button
                  onClick={() => handleGeneratePDF(true)}
                  disabled={isGenerating}
                  className="bg-amber-600 hover:bg-amber-700 rounded-xl"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {isGenerating ? "Generowanie..." : "Archiwum (z danymi)"}
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
        </div>
      </div>
    </div>
  );
};

export default ProtocolStepper;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import StepIdentification from "./protocol-steps/StepIdentification";
import StepSpecification from "./protocol-steps/StepSpecification";
import StepServiceData from "./protocol-steps/StepServiceData";
import StepTestsAndAcceptance from "./protocol-steps/StepTestsAndAcceptance";

interface ProtocolData {
  client_name: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_year: string;
  vehicle_vin: string;
  vehicle_registration: string;
  vehicle_mileage: string;
  vehicle_photo_front: string;
  vehicle_photo_vin: string;
  security_type: string;
  device_model: string;
  homologation_number: string;
  control_unit_location: string;
  installation_connection_point: string;
  service_notes: string;
  test_disarm_key: boolean | null;
  test_disarm_pin: boolean | null;
  test_service_mode: boolean | null;
  photos: string[];
  video: string;
  signature: string;
}

interface ProtocolStepperProps {
  onBack: () => void;
}

const steps = [
  { id: 1, title: "Identyfikacja", description: "Dane pojazdu i klienta" },
  { id: 2, title: "Specyfikacja", description: "Typ zabezpieczenia i urządzenie" },
  { id: 3, title: "Dane Serwisowe", description: "Informacje poufne" },
  { id: 4, title: "Testy i Odbiór", description: "Weryfikacja i podpis" },
];

const ProtocolStepper = ({ onBack }: ProtocolStepperProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<ProtocolData>({
    client_name: "",
    vehicle_brand: "",
    vehicle_model: "",
    vehicle_year: "",
    vehicle_vin: "",
    vehicle_registration: "",
    vehicle_mileage: "",
    vehicle_photo_front: "",
    vehicle_photo_vin: "",
    security_type: "",
    device_model: "",
    homologation_number: "E20",
    control_unit_location: "",
    installation_connection_point: "",
    service_notes: "",
    test_disarm_key: null,
    test_disarm_pin: null,
    test_service_mode: null,
    photos: [],
    video: "",
    signature: "",
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDataChange = (field: keyof ProtocolData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleGeneratePDF = async (isArchive: boolean = false) => {
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/generate-protocol-pdf`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${anonKey}`,
          },
          body: JSON.stringify({ protocolData: data, isArchive }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `protokol_${data.vehicle_registration}_${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF generation error:", error);
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
              <h1 className="text-3xl font-bold text-white mb-1">Protokół Montażu</h1>
              <p className="text-slate-400">Krok {currentStep} z {steps.length}</p>
            </div>
            <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={onBack}>
              <ChevronLeft className="w-5 h-5 mr-1" />
              Powrót
            </Button>
          </div>

          <div className="mb-8">
            <div className="flex gap-2 mb-2">
              {steps.map((step) => (
                <div key={step.id} className="flex-1">
                  <div
                    className={`h-2 rounded-full transition-colors ${
                      step.id <= currentStep ? "bg-blue-500" : "bg-slate-700"
                    }`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm">
              {steps.map((step) => (
                <span
                  key={step.id}
                  className={`${
                    step.id <= currentStep ? "text-blue-400" : "text-slate-500"
                  }`}
                >
                  {step.title}
                </span>
              ))}
            </div>
          </div>

          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white text-xl">{steps[currentStep - 1].title}</CardTitle>
              <CardDescription className="text-slate-400">{steps[currentStep - 1].description}</CardDescription>
            </CardHeader>
            <CardContent className="min-h-96">
              {renderStep()}
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-between">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Wstecz
            </Button>

            {currentStep === steps.length ? (
              <div className="flex gap-2">
                <Button
                  onClick={() => handleGeneratePDF(false)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Protokół dla klienta
                </Button>
                <Button
                  onClick={() => handleGeneratePDF(true)}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  Archiwum (z danymi)
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700"
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

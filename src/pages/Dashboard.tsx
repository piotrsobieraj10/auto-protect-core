import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProtocolStepper from "@/components/ProtocolStepper";

const Dashboard = () => {
  const [showProtocol, setShowProtocol] = useState(false);

  if (showProtocol) {
    return <ProtocolStepper onBack={() => setShowProtocol(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard AutoSafe</h1>
          <p className="text-slate-400">Zarządzaj protokołami montażu i antycradzieży</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            className="bg-slate-800 border-slate-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer h-full"
            onClick={() => setShowProtocol(true)}
          >
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Wrench className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <CardTitle className="text-white">Panel Montera</CardTitle>
              <CardDescription className="text-slate-400">Protokół montażu urządzenia</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300 mb-4">
                Wypełnij interaktywny protokół montażu. Krok po kroku zbierz wszystkie dane potrzebne do dokumentacji.
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Rozpocznij
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

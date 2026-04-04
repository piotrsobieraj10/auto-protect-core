import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wrench, Lock, ShieldCheck, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProtocolStepper from "@/components/ProtocolStepper";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProtocol, setShowProtocol] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("panel-login", {
        body: { password },
      });
      if (error) throw error;
      if (result?.success) {
        setIsAuthenticated(true);
        setError(false);
      } else {
        setError(true);
        setPassword("");
      }
    } catch {
      setError(true);
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  // ── Password gate ─────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 border border-blue-500/40 rounded-2xl mb-4">
              <ShieldCheck className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">AutoSafe</h1>
            <p className="text-slate-400 text-sm mt-1">Panel Montera — dostęp chroniony</p>
          </div>

          {/* Login card */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-4 h-4 text-blue-400" />
              <h2 className="text-white font-semibold">Zaloguj się</h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <Label htmlFor="password" className="text-slate-300 mb-2 block text-sm">
                  Hasło dostępu
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(false); }}
                  placeholder="Wprowadź hasło"
                  autoFocus
                  autoComplete="current-password"
                  data-testid="input-password"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-950/50 border border-red-800/60 rounded-lg px-3 py-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-400">Błędne hasło. Spróbuj ponownie.</p>
                </div>
              )}

              <Button
                type="submit"
                data-testid="button-login"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl"
              >
                {loading ? "Sprawdzam..." : "Zaloguj"}
              </Button>
            </form>
          </div>

          <p className="text-center text-slate-600 text-xs mt-6">
            AutoSafe © {new Date().getFullYear()} — System Protokołów Montażu
          </p>
        </div>
      </div>
    );
  }

  // ── Protocol stepper ──────────────────────────────────────────────────────
  if (showProtocol) {
    return <ProtocolStepper onBack={() => setShowProtocol(false)} />;
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
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

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Panel AutoSafe</h1>
        <Button onClick={() => navigate("/dashboard")}>Przejdź do panelu</Button>
      </div>
    </div>
  );
};

export default Login;

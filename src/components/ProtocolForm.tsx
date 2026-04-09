import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ProtocolForm = ({ onBack }: { onBack: () => void }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Button onClick={onBack}>Powrót</Button>
    </div>
  );
};

export default ProtocolForm;

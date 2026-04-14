import { useState, useEffect } from "react";
import { Phone, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const PHONE_DISPLAY = "512 732 864";
const PHONE_TEL = "tel:+48512732864";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : true
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

function CopyableNumber({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(PHONE_DISPLAY.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      title="Kliknij, aby skopiować numer"
      className={`flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors ${className}`}
    >
      📞 {PHONE_DISPLAY}
      {copied
        ? <Check className="h-3.5 w-3.5 text-green-500" />
        : <Copy className="h-3.5 w-3.5 opacity-50" />
      }
    </button>
  );
}

interface PhoneButtonProps {
  text?: string;
  size?: "sm" | "lg" | "default";
  variant?: "hero" | "heroOutline";
  className?: string;
  showNumber?: boolean;
  wrapperClassName?: string;
}

const PhoneButton = ({
  text = "Zadzwoń teraz",
  size = "lg",
  variant = "hero",
  className = "",
  showNumber = false,
  wrapperClassName = "",
}: PhoneButtonProps) => {
  const isMobile = useIsMobile();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PHONE_DISPLAY.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isMobile) {
    return (
      <div className={`flex items-center gap-3 flex-wrap ${wrapperClassName}`}>
        <Button variant={variant} size={size} className={className} asChild>
          <a href={PHONE_TEL} className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            {text}
          </a>
        </Button>
        {showNumber && <CopyableNumber />}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 flex-wrap ${wrapperClassName}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant={variant} size={size} className={`flex items-center gap-2 ${className}`}>
            <Phone className="h-5 w-5" />
            {text}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-4" align="center" sideOffset={8}>
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Zadzwoń teraz</p>
            <p className="text-2xl font-bold tracking-wide text-foreground">
              {PHONE_DISPLAY}
            </p>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {copied
                ? <><Check className="h-4 w-4 text-green-500" /> Skopiowano!</>
                : <><Copy className="h-4 w-4" /> Kopiuj numer</>
              }
            </button>
          </div>
        </PopoverContent>
      </Popover>
      {showNumber && <CopyableNumber />}
    </div>
  );
};

export { CopyableNumber };
export default PhoneButton;

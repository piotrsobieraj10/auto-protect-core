import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CTABannerProps {
  buttonText: string;
  variant?: "hero" | "heroOutline";
}

const CTABanner = ({ buttonText, variant = "hero" }: CTABannerProps) => {
  return (
    <div className="py-10 bg-background border-y border-border">
      <div className="container mx-auto px-6 flex flex-col items-center gap-3">
        <Button variant={variant} size="lg" asChild>
          <a href="tel:+48512732864" className="flex items-center gap-2 text-base px-10">
            <Phone className="h-5 w-5" />
            {buttonText}
          </a>
        </Button>
        <p className="text-sm text-muted-foreground text-center">
          Szybka wycena telefoniczna – dopasujemy zabezpieczenie do Twojego auta
        </p>
      </div>
    </div>
  );
};

export default CTABanner;

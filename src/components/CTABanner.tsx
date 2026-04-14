import PhoneButton from "@/components/PhoneButton";

interface CTABannerProps {
  buttonText: string;
  variant?: "hero" | "heroOutline";
}

const CTABanner = ({ buttonText, variant = "hero" }: CTABannerProps) => {
  return (
    <div className="py-10 bg-background border-y border-border">
      <div className="container mx-auto px-6 flex flex-col items-center gap-3">
        <PhoneButton text={buttonText} variant={variant} size="lg" showNumber />
        <p className="text-sm text-muted-foreground text-center">
          Szybka wycena telefoniczna – dopasujemy zabezpieczenie do Twojego auta
        </p>
      </div>
    </div>
  );
};

export default CTABanner;

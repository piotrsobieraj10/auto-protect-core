import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">AutoGuard</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#uslugi" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Usługi
          </a>
          <a href="#kontakt" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Kontakt
          </a>
          <Button variant="hero" size="sm" asChild>
            <a href="#kontakt">Umów wizytę</a>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

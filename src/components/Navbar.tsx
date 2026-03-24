import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="AutoSafe logo" className="h-20 w-20 invert" />
          <span className="text-lg font-bold">AutoSafe</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {location.pathname !== "/" && (
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Strona główna
            </a>
          )}
          {location.pathname === "/" && (
            <>
              <a href="#uslugi" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Usługi
              </a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </a>
              <a href="#kontakt" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Kontakt
              </a>
              <Button variant="hero" size="sm" asChild>
                <a href="/dashboard">Panel Montera</a>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

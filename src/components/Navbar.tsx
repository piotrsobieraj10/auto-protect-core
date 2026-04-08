import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#zabezpieczenia", label: "Zabezpieczenia" },
  { href: "#uslugi",         label: "Usługi" },
  { href: "#cennik",         label: "Cennik" },
  { href: "#galeria",        label: "Galeria" },
  { href: "#faq",            label: "FAQ" },
  { href: "#kontakt",        label: "Kontakt" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="AutoSafe logo" className="h-20 w-20 invert" />
          <span className="text-lg font-bold">AutoSafe</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {!isHome && (
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Strona główna
            </a>
          )}
          {isHome && navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Button variant="hero" size="sm" asChild>
            <a href="tel:+48512732864">📞 512 732 864</a>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border px-6 pb-4 space-y-3">
          {!isHome && (
            <a href="/" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
              Strona główna
            </a>
          )}
          {isHome && navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Button variant="hero" size="sm" className="w-full" asChild>
            <a href="tel:+48512732864">📞 Zadzwoń: 512 732 864</a>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

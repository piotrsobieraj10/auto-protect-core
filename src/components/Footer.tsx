import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="py-10 border-t border-border">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="AutoSafe logo" className="h-16 w-16 invert" />
          <span className="font-bold">AutoSafe</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} AutoSafe. Wszystkie prawa zastrzeżone.
          <button
            onClick={() => navigate("/login")}
            className="ml-1 text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors cursor-default"
            aria-label="Panel"
          >
            •
          </button>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

const Footer = () => {
  return (
    <footer className="py-10 border-t border-border">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="AutoSafe logo" className="h-8 w-8 invert" />
          <span className="font-bold">AutoSafe</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} AutoSafe. Wszystkie prawa zastrzeżone.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

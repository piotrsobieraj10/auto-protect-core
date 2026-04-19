import BrandLogo from "@/components/BrandLogo";

const Footer = () => {
  return (
    <footer className="py-10 border-t border-border">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <BrandLogo iconSize={35} mobileIconSize={35} textSize="text-base" opacity={0.8} />
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} AutoSafe. Wszystkie prawa zastrzeżone.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

import toyotaLogo from "@/assets/brands/toyota.png";
import bmwLogo from "@/assets/brands/bmw.png";
import audiLogo from "@/assets/brands/audi.png";
import mercedesLogo from "@/assets/brands/mercedes.png";
import volkswagenLogo from "@/assets/brands/volkswagen.png";
import volvoLogo from "@/assets/brands/volvo.png";
import lexusLogo from "@/assets/brands/lexus.png";
import porscheLogo from "@/assets/brands/porsche.png";
import hyundaiLogo from "@/assets/brands/hyundai.png";
import kiaLogo from "@/assets/brands/kia.png";
import mazdaLogo from "@/assets/brands/mazda.png";
import hondaLogo from "@/assets/brands/honda.png";
import fordLogo from "@/assets/brands/ford.png";
import skodaLogo from "@/assets/brands/skoda.png";
import renaultLogo from "@/assets/brands/renault.png";
import landroverLogo from "@/assets/brands/landrover.png";
import teslaLogo from "@/assets/brands/tesla.png";
import jaguarLogo from "@/assets/brands/jaguar.png";

const brands = [
  { name: "Toyota", logo: toyotaLogo },
  { name: "BMW", logo: bmwLogo },
  { name: "Audi", logo: audiLogo },
  { name: "Mercedes-Benz", logo: mercedesLogo },
  { name: "Volkswagen", logo: volkswagenLogo },
  { name: "Volvo", logo: volvoLogo },
  { name: "Lexus", logo: lexusLogo },
  { name: "Porsche", logo: porscheLogo },
  { name: "Hyundai", logo: hyundaiLogo },
  { name: "Kia", logo: kiaLogo },
  { name: "Mazda", logo: mazdaLogo },
  { name: "Honda", logo: hondaLogo },
  { name: "Ford", logo: fordLogo },
  { name: "Skoda", logo: skodaLogo },
  { name: "Renault", logo: renaultLogo },
  { name: "Land Rover", logo: landroverLogo },
  { name: "Tesla", logo: teslaLogo },
  { name: "Jaguar", logo: jaguarLogo },
];

const CarBrands = () => {
  return (
    <section className="py-16 bg-card border-t border-border">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-sm font-medium tracking-widest uppercase text-primary mb-3 block">
            Kompatybilność
          </span>
          <h2 className="text-2xl md:text-3xl font-bold">
            Zabezpieczamy pojazdy <span className="text-gradient">wszystkich marek</span>
          </h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-6 max-w-5xl mx-auto">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-background border border-border group-hover:border-primary/30 transition-colors p-2">
                <img
                  src={brand.logo}
                  alt={`Logo ${brand.name}`}
                  loading="lazy"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors text-center leading-tight">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-8">
          …i wiele innych. Przed montażem weryfikujemy kompatybilność z Twoim VIN.
        </p>
      </div>
    </section>
  );
};

export default CarBrands;

const brands = [
  "Toyota", "BMW", "Audi", "Mercedes-Benz", "Volkswagen",
  "Volvo", "Lexus", "Porsche", "Hyundai", "Kia",
  "Mazda", "Honda", "Ford", "Skoda", "Renault",
  "Land Rover", "Tesla", "Jaguar",
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
        <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
          {brands.map((brand) => (
            <div
              key={brand}
              className="px-5 py-2.5 rounded-lg bg-background border border-border text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
            >
              {brand}
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-6">
          …i wiele innych. Przed montażem weryfikujemy kompatybilność z Twoim VIN.
        </p>
      </div>
    </section>
  );
};

export default CarBrands;

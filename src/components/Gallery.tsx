import { useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import gallery7 from "@/assets/gallery-7.jpg";

const images = [
  { src: gallery1, alt: "BMW M5 - montaż zabezpieczeń antykradzieżowych", label: "BMW M5" },
  { src: gallery2, alt: "Range Rover Sport SVR - instalacja systemu", label: "Range Rover Sport SVR" },
  { src: gallery3, alt: "BMW M4 - montaż antykradzieżowy", label: "BMW M4" },
  { src: gallery4, alt: "Mercedes-AMG GT - ochrona pojazdu", label: "Mercedes-AMG GT" },
  { src: gallery5, alt: "Mercedes CLE - zabezpieczenie antykradzieżowe", label: "Mercedes CLE" },
  { src: gallery6, alt: "Mercedes GLE - montaż systemu GPS", label: "Mercedes GLE" },
  { src: gallery7, alt: "BMW X1 - instalacja zabezpieczeń", label: "BMW X1" },
];

const Gallery = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section id="galeria" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nasze <span className="text-primary">realizacje</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Zobacz pojazdy, które zabezpieczyliśmy profesjonalnymi systemami antykradzieżowymi.
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-xl" ref={emblaRef}>
            <div className="flex">
              {images.map((img, i) => (
                <div key={i} className="min-w-0 shrink-0 grow-0 basis-full">
                  <div className="relative aspect-video">
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading={i === 0 ? undefined : "lazy"}
                      width={1280}
                      height={720}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-background/80 to-transparent p-4 md:p-6">
                      <span className="text-lg md:text-xl font-semibold text-foreground">
                        {img.label}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background/90 text-foreground rounded-full p-2 md:p-3 transition-colors backdrop-blur-sm"
            aria-label="Poprzednie zdjęcie"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background/90 text-foreground rounded-full p-2 md:p-3 transition-colors backdrop-blur-sm"
            aria-label="Następne zdjęcie"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;

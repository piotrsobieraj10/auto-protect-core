import { useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Phone } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import gallery1  from "@/assets/gallery-1.jpg";
import gallery3  from "@/assets/gallery-3.jpg";
import gallery5  from "@/assets/gallery-5.jpg";
import gallery6  from "@/assets/gallery-6.jpg";
import gallery7  from "@/assets/gallery-7.jpg";
import gallery8  from "@/assets/gallery-8.jpg";
import gallery9  from "@/assets/gallery-9.jpg";
import gallery10 from "@/assets/gallery-10.jpg";
import gallery11 from "@/assets/gallery-11.jpg";
import gallery12 from "@/assets/gallery-12.jpg";
import gallery13 from "@/assets/gallery-13.jpg";
import gallery14 from "@/assets/gallery-14.jpg";
import gallery15 from "@/assets/gallery-15.jpg";
import gallery16 from "@/assets/gallery-16.jpg";

const images = [
  { src: gallery1,  alt: "BMW M5",             label: "BMW M5",           pos: "center 60%"  },
  { src: gallery3,  alt: "BMW M4",             label: "BMW M4",           pos: "center 25%"  },
  { src: gallery5,  alt: "Mercedes CLE",       label: "Mercedes CLE",     pos: "center 50%"  },
  { src: gallery6,  alt: "Mercedes GLE",       label: "Mercedes GLE",     pos: "center 45%"  },
  { src: gallery7,  alt: "BMW X1",             label: "BMW X1",           pos: "center 40%"  },
  { src: gallery8,  alt: "Peugeot 508",        label: "Peugeot 508",      pos: "center 50%"  },
  { src: gallery9,  alt: "Dodge Charger",      label: "Dodge Charger",    pos: "center 55%"  },
  { src: gallery10, alt: "Wnętrze pojazdu",    label: "Wnętrze pojazdu",  pos: "center 40%"  },
  { src: gallery11, alt: "Mercedes E Coupé",   label: "Mercedes E Coupé", pos: "center 50%"  },
  { src: gallery12, alt: "DS7 Crossback",      label: "DS7 Crossback",    pos: "center 50%"  },
  { src: gallery13, alt: "Audi Q5",            label: "Audi Q5",          pos: "center 50%"  },
  { src: gallery14, alt: "Audi Q5",            label: "Audi Q5",          pos: "center 40%"  },
  { src: gallery15, alt: "Instalacja systemu", label: "Instalacja",       pos: "center 50%"  },
  { src: gallery16, alt: "Mercedes AMG",       label: "Mercedes AMG",     pos: "center 40%"  },
];

const Gallery = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 4500);
    return () => clearInterval(interval);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section id="galeria" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nasze <span className="text-gradient">realizacje</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Zobacz, jak zabezpieczamy auta przed kradzieżą w Radomiu i okolicach.
          </p>
        </div>

        <div className="relative mb-10">
          <div className="overflow-hidden rounded-xl" ref={emblaRef}>
            <div className="flex">
              {images.map((img, i) => (
                <div key={i} className="min-w-0 shrink-0 grow-0 basis-full">
                  <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading={i === 0 ? undefined : "lazy"}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ objectPosition: img.pos }}
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 to-transparent p-4 md:p-6">
                      <span className="text-lg md:text-xl font-semibold text-white block">
                        {img.label}
                      </span>
                      <span className="text-xs text-white/70">
                        Montaż zabezpieczenia antykradzieżowego – Radom
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 md:p-3 transition-colors backdrop-blur-sm"
            aria-label="Poprzednie zdjęcie"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 md:p-3 transition-colors backdrop-blur-sm"
            aria-label="Następne zdjęcie"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <div className="text-center space-y-4">
          <p className="text-muted-foreground text-base">
            Dobierzemy zabezpieczenie do Twojego auta – skontaktuj się z nami
          </p>
          <Button variant="hero" size="lg" asChild>
            <a href="tel:+48512732864" className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Zadzwoń teraz
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;

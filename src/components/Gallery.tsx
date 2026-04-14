import { useEffect, useRef, useState } from "react";
import { Shield } from "lucide-react";
import PhoneButton from "@/components/PhoneButton";
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
  { src: gallery1,  alt: "BMW M5",           label: "BMW M5",           pos: "center 60%" },
  { src: gallery3,  alt: "BMW M4",           label: "BMW M4",           pos: "center 25%" },
  { src: gallery5,  alt: "Mercedes CLE",     label: "Mercedes CLE",     pos: "center 50%" },
  { src: gallery6,  alt: "Mercedes GLE",     label: "Mercedes GLE",     pos: "center 45%" },
  { src: gallery7,  alt: "BMW X1",           label: "BMW X1",           pos: "center 40%" },
  { src: gallery8,  alt: "Peugeot 508",      label: "Peugeot 508",      pos: "center 50%" },
  { src: gallery9,  alt: "Dodge Charger",    label: "Dodge Charger",    pos: "center 55%" },
  { src: gallery10, alt: "Wnętrze pojazdu",  label: "Wnętrze pojazdu",  pos: "center 40%" },
  { src: gallery11, alt: "Mercedes E Coupé", label: "Mercedes E Coupé", pos: "center 50%" },
  { src: gallery12, alt: "DS7 Crossback",    label: "DS7 Crossback",    pos: "center 50%" },
  { src: gallery13, alt: "Audi Q5",          label: "Audi Q5",          pos: "center 50%" },
  { src: gallery16, alt: "Mercedes AMG",     label: "Mercedes AMG",     pos: "center 40%" },
];

function GalleryCard({ img, index }: { img: typeof images[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group relative overflow-hidden rounded-xl shadow-md cursor-pointer"
      style={{
        transitionDelay: `${(index % 4) * 80}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      <div className="relative w-full" style={{ paddingBottom: "75%" }}>
        <img
          src={img.src}
          alt={img.alt}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ objectPosition: img.pos }}
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors duration-300" />

        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 md:p-4 transition-opacity duration-300 group-hover:opacity-0">
          <span className="text-sm md:text-base font-semibold text-white block">
            {img.label}
          </span>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-center">
          <Shield className="h-7 w-7 text-white mb-2" />
          <span className="text-white font-semibold text-sm md:text-base leading-snug">
            Zabezpieczenie antykradzieżowe + GPS
          </span>
        </div>
      </div>
    </div>
  );
}

const Gallery = () => {
  return (
    <section id="galeria" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">

        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Zabezpieczyliśmy już setki pojazdów –{" "}
            <span className="text-gradient">Twój może być następny</span>
          </h2>
          <p className="text-muted-foreground">
            Zobacz wybrane realizacje montażu zabezpieczeń antykradzieżowych i systemów GPS.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-12">
          {images.map((img, i) => (
            <GalleryCard key={img.alt + i} img={img} index={i} />
          ))}
        </div>

        <div className="flex flex-col items-center gap-3">
          <PhoneButton text="Zabezpiecz swój samochód" size="lg" showNumber />
          <p className="text-sm text-muted-foreground">
            Skontaktuj się i dobierzemy najlepsze zabezpieczenie do Twojego auta
          </p>
        </div>

      </div>
    </section>
  );
};

export default Gallery;

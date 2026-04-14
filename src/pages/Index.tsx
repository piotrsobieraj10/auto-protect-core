import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AntiTheft from "@/components/AntiTheft";
import HowItWorks from "@/components/HowItWorks";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import WhyUs from "@/components/WhyUs";
import CarBrands from "@/components/CarBrands";
import Gallery from "@/components/Gallery";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import CTABanner from "@/components/CTABanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <CTABanner buttonText="Dobierz zabezpieczenie do auta" />
      <AntiTheft />
      <HowItWorks />
      <Services />
      <Pricing />
      <CTABanner buttonText="Zapytaj o zabezpieczenie" variant="heroOutline" />
      <WhyUs />
      <CarBrands />
      <Gallery />
      <CTABanner buttonText="Zadzwoń teraz" />
      <FAQ />
      <FinalCTA />
      <Contact />
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default Index;

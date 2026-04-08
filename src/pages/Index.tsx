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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <AntiTheft />
      <HowItWorks />
      <Services />
      <Pricing />
      <WhyUs />
      <CarBrands />
      <Gallery />
      <FAQ />
      <FinalCTA />
      <Contact />
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default Index;

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AntiTheft from "@/components/AntiTheft";
import Services from "@/components/Services";
import ComparisonTable from "@/components/ComparisonTable";
import WhyUs from "@/components/WhyUs";
import CarBrands from "@/components/CarBrands";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <AntiTheft />
      <Services />
      <ComparisonTable />
      <WhyUs />
      <CarBrands />
      <FAQ />
      <Contact />
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default Index;

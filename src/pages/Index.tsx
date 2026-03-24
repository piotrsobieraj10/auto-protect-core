import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AntiTheft from "@/components/AntiTheft";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <AntiTheft />
      <Services />
      <WhyUs />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;

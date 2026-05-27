import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import WhyGsap from "@/components/WhyGsap";
import Tools from "@/components/Tools";
import Brands from "@/components/Brands";
import Showcase from "@/components/Showcase";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import GsapProvider from "@/components/GsapProvider";

export default function Home() {
  return (
    <GsapProvider>
      <Nav />
      <Hero />
      <WhyGsap />
      <Tools />
      <Brands />
      <Showcase />
      <Cta />
      <Footer />
    </GsapProvider>
  );
}

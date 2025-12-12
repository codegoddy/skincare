import Image from "next/image";
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import ProductShowcase from "@/components/sections/ProductShowcase";
import Testimonials from "@/components/sections/Testimonials";
import SocialGallery from "@/components/sections/SocialGallery";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header />
      <Hero />
      <Features />
      <ProductShowcase />
      <Testimonials />
      <SocialGallery />
      <Footer />
    </main>
  );
}

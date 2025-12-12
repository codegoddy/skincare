import React from "react";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import { motion } from "framer-motion";

export default function SocialGallery() {
  return (
    <section id="gallery" className="py-20 bg-white">
      <Container>
        {/* Grid with centered badge */}
        <div className="relative">
          {/* Center Sticker */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <FadeIn delay={0.5} className="w-full h-full"> 
                <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                  <div className="absolute inset-0 w-full h-full bg-accent rounded-full border border-black shadow-xl" />
                  <div className="relative z-10 w-20 h-20 bg-black rounded-full flex flex-col items-center justify-center text-white">
                    <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                    <span className="text-[10px] uppercase font-bold tracking-widest leading-none">#ZenGlow</span>
                  </div>
                </div>
            </FadeIn>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
             {[
               "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop",
               "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop",
               "https://images.unsplash.com/photo-1554196346-b985817a29f8?q=80&w=2070&auto=format&fit=crop",
               "https://images.unsplash.com/photo-1512207848382-147991b9c27b?q=80&w=2069&auto=format&fit=crop"
             ].map((src, i) => (
                <FadeIn key={i} delay={i * 0.1} direction="up" className="aspect-square bg-gray-100 overflow-hidden border-2 border-black">
                   <img src={src} alt={`Gallery ${i+1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                </FadeIn>
             ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

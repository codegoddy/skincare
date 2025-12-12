import React from "react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import Link from "next/link";
import Image from "next/image";

export default function Features() {
  return (
    <section id="about" className="py-20 bg-white">
      <Container>
        {/* Images Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <FadeIn direction="right" delay={0.2} className="relative aspect-[4/5] bg-gray-100 overflow-hidden group border-2 border-black">
             <Image 
               src="/michela-ampolo-7tDGb3HrITg-unsplash.jpg" 
               alt="Infused Love"
               fill
               sizes="(max-width: 768px) 100vw, 50vw"
               className="object-cover transition-transform duration-700 group-hover:scale-105"
             />
          </FadeIn>
          <FadeIn direction="left" delay={0.4} className="relative aspect-[4/5] bg-gray-100 overflow-hidden group border-2 border-black">
             <Image 
               src="/michela-ampolo-7tDGb3HrITg-unsplash.jpg" 
               alt="Infused Beauty"
               fill
               sizes="(max-width: 768px) 100vw, 50vw"
               className="object-cover transition-transform duration-700 group-hover:scale-105"
             />
          </FadeIn>
        </div>

        {/* Text and Content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
           <div className="max-w-xl">
             <FadeIn direction="up" delay={0.2}>
               <h2 className="text-5xl md:text-7xl font-medium leading-none tracking-tight mb-4">
                 INFUSED LOVE <br/>
                 INFUSED <span className="font-serif italic text-gray-300">BEAUTY</span>
               </h2>
             </FadeIn>
           </div>
           
           <div className="max-w-md flex flex-col gap-6">
             <FadeIn direction="up" delay={0.4}>
               <p className="text-gray-500 text-sm leading-relaxed">
                 Enchante Radiance, where every detail is a testament to our symphony commitment to nurturing your skin's innate glow. Unveil the allure of elegance and embrace a symphony of luxurious.
               </p>
             </FadeIn>
             <FadeIn direction="up" delay={0.5}>
               <div>
                 <Link href="/shop">
                   <Button variant="accent" className="rounded-none px-8 py-3 text-black font-semibold hover:opacity-90 border-2 border-black">
                     Shop now
                   </Button>
                 </Link>
               </div>
             </FadeIn>
           </div>
        </div>

        {/* Stats Strip */}
        <FadeIn direction="up" delay={0.6} fullWidth>
          <div className="bg-accent border-2 border-black py-8 px-6">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
                {[
                  { val: "5K+", label: "Organic Products" },
                  { val: "12K+", label: "Worldwide Customers" },
                  { val: "3K+", label: "Products in Store" },
                  { val: "16K+", label: "Client Reviews" },
                ].map((stat, idx) => (
                  <div 
                    key={idx} 
                    className={`flex flex-col items-center justify-center text-center py-2 ${
                      idx < 3 ? 'md:border-r md:border-black/20' : ''
                    }`}
                  >
                    <span className="text-2xl md:text-3xl font-bold mb-1 text-black">{stat.val}</span>
                    <span className="text-xs text-black/70 uppercase tracking-wider">{stat.label}</span>
                  </div>
                ))}
             </div>
          </div>
        </FadeIn>

      </Container>
    </section>
  );
}

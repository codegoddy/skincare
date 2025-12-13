import React from "react";
import FadeIn from "@/components/ui/FadeIn";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen bg-white pt-28 pb-20 flex flex-col justify-center">
      <div className="relative w-full max-w-[1200px] mx-auto px-8">
        
        {/* Row 1: NATURE AURA */}
        <div className="text-center mb-4">
          <FadeIn delay={0} direction="up">
             <span className="text-[15vw] sm:text-[90px] lg:text-[140px] font-medium tracking-tight text-black leading-none inline-block">
                NATURE
             </span>
          </FadeIn>
          <FadeIn delay={0.1} direction="up">
             <span className="text-[15vw] sm:text-[90px] lg:text-[140px] font-serif italic text-gray-200 leading-none inline-block ml-2 sm:ml-4">
                AURA
             </span>
          </FadeIn>
        </div>

        {/* Row 2: ELEGANCE */}
        <div className="text-center mb-2">
          <FadeIn delay={0.2} direction="up">
              <span className="text-[15vw] sm:text-[90px] lg:text-[140px] font-serif italic text-black leading-none inline-block">
                ELEGANCE
              </span>
          </FadeIn>
        </div>

        {/* Row 3: EXQUISITE SKIN */}
        <div className="text-center mb-4">
          <FadeIn delay={0.3} direction="up">
             <span className="text-[15vw] sm:text-[90px] lg:text-[140px] font-medium tracking-tight text-black leading-none inline-block">
               EXQUISITE SKIN
             </span>
          </FadeIn>
        </div>

        {/* Row 4: REVIVAL + Triangles */}
        <div className="text-center">
            <FadeIn delay={0.4} direction="up">
               <span className="text-[15vw] sm:text-[90px] lg:text-[140px] font-medium tracking-tight text-black leading-none">
                 REVIVAL
               </span>
               <span className="inline-flex gap-1 ml-2 sm:ml-4 align-middle">
                 {[1, 2, 3, 4].map((i) => (
                   <span
                     key={i}
                     className="inline-block w-3 h-2 sm:w-5 sm:h-4 bg-black"
                     style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                   />
                 ))}
               </span>
            </FadeIn>
        </div>

      </div>
    </section>
  );
}

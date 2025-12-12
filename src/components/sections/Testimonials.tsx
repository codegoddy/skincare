import React from "react";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";

export default function Testimonials() {
  return (
    <section id="reviews" className="py-20 bg-[#F5F5F5]">
        <Container>
            {/* Title */}
            <div className="text-center mb-16">
                 <FadeIn direction="up">
                   <h2 className="text-3xl md:text-5xl font-medium uppercase tracking-tight">
                      CUSTOMER FEED<span className="text-gray-400 font-bold italic font-serif">BACKS</span>
                   </h2>
                 </FadeIn>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                {/* Visual */}
                <div className="w-full lg:w-1/2">
                    <FadeIn direction="right" delay={0.2} className="relative aspect-[4/5] max-w-sm mx-auto lg:mx-0 bg-gray-100 overflow-hidden border-2 border-black">
                         <img 
                           src="https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=1000&auto=format&fit=crop" 
                           alt="Customer using product" 
                           className="w-full h-full object-cover"
                         />
                    </FadeIn>
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2 space-y-8">
                     <FadeIn direction="up" delay={0.3}>
                       <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-md">
                          Our commitment to excellence resonates in the words of our customers, reinforcing the efficacy and authenticity of ZenGlow. We invite you to join the growing community of individuals who have embraced the beauty revolution with us.
                       </p>
                     </FadeIn>

                     <FadeIn direction="up" delay={0.4}>
                       <div className="flex items-center gap-4">
                          {/* Avatars */}
                          <div className="flex -space-x-3">
                               {[1,2].map((i) => (
                                   <div key={i} className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
                                       <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="User" className="w-full h-full object-cover"/>
                                   </div>
                               ))}
                               {/* Badge Avatar */}
                               <div className="w-12 h-12 rounded-full border-2 border-white bg-accent flex items-center justify-center text-[10px] font-bold text-primary">
                                   01/12
                               </div>
                          </div>
                       </div>
                     </FadeIn>
                     
                     <FadeIn direction="up" delay={0.5}>
                       <div className="flex items-center justify-between max-w-md">
                          <div className="flex items-center gap-2">
                              <div className="flex text-yellow-400">
                                  {[1,2,3,4,5].map(i => (
                                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                  ))}
                              </div>
                              <span className="font-bold text-sm">4.6K</span>
                          </div>
                          
                          <button className="flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all">
                              Ask our Experts 
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                          </button>
                       </div>
                     </FadeIn>
                </div>
            </div>
        </Container>
    </section>
  );
}

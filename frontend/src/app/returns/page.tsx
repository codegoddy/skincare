"use client";

import React from "react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import Button from "@/components/ui/Button";

export default function ReturnsPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header />
      <div className="pt-32 pb-20">
        <Container>
          <div className="max-w-3xl mx-auto">
             <FadeIn direction="up">
              <h1 className="text-5xl md:text-7xl font-medium leading-none tracking-tight mb-16 text-center">
                RETURNS & <span className="font-serif italic text-gray-300">EXCHANGES</span>
              </h1>
            </FadeIn>

            <div className="space-y-12 text-gray-600">
               <FadeIn delay={0.2} direction="up">
                  <div className="border-l-4 border-accent pl-6">
                      <h3 className="text-xl font-bold uppercase text-black mb-3">Our Guarantee</h3>
                      <p className="leading-relaxed">
                        We want you to be completely satisfied with your purchase. If for any reason you are not happy with a ZenGlow product, 
                        we accepted returns of unopened or gently used items within 30 days of the purchase date.
                      </p>
                  </div>
               </FadeIn>

               <FadeIn delay={0.3} direction="up">
                  <h3 className="text-lg font-bold uppercase text-black mb-4">How to Initiate a Return</h3>
                  <ol className="list-decimal list-inside space-y-4 marker:font-bold marker:text-black">
                      <li>Visit our <span className="text-accent underline cursor-pointer decoration-2 underline-offset-2">Returns Portal</span> to start your request.</li>
                      <li>Enter your Order ID and Email Address to locate your order.</li>
                      <li>Select the items you wish to return and the reason for the return.</li>
                      <li>Print the prepaid shipping label provided and attach it to your package.</li>
                      <li>Drop off the package at any authorized carrier location.</li>
                  </ol>
               </FadeIn>

               <FadeIn delay={0.4} direction="up">
                  <h3 className="text-lg font-bold uppercase text-black mb-4">Refund Timing</h3>
                  <p className="leading-relaxed mb-4">
                    Once we receive your return, please allow 3-5 business days for it to be processed. 
                    Refunds will be issued to the original form of payment. Depending on your bank, it may take an additional 1-3 business days for the funds to appear in your account.
                  </p>
                  <p className="text-sm bg-gray-50 p-4 rounded text-gray-500 italic">
                      Note: Original shipping fees are non-refundable.
                  </p>
               </FadeIn>

                <FadeIn delay={0.5} direction="up">
                    <div className="pt-8 border-t border-gray-100 text-center">
                        <p className="mb-6 font-medium">Have an issue with a damaged item?</p>
                        <Button className="border-2 border-black !bg-transparent !text-black hover:!bg-black hover:!text-white transition-all px-8 rounded-none">
                            Contact Support
                        </Button>
                    </div>
                </FadeIn>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </main>
  );
}

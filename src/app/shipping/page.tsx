"use client";

import React from "react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";

export default function ShippingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header />
      <div className="pt-32 pb-20">
        <Container>
          <div className="max-w-3xl mx-auto">
            <FadeIn direction="up">
              <h1 className="text-5xl md:text-7xl font-medium leading-none tracking-tight mb-16 text-center">
                SHIPPING <span className="font-serif italic text-gray-300">INFO</span>
              </h1>
            </FadeIn>

            <div className="prose prose-lg mx-auto text-gray-600 prose-headings:font-sans prose-headings:font-bold prose-headings:uppercase prose-p:leading-relaxed">
               <FadeIn delay={0.2} direction="up">
                  <h3>Domestic Shipping (USA)</h3>
                  <p>
                    We offer free standard shipping on all US orders over $50. For orders under $50, a flat rate of $7.95 applies. 
                    Standard shipping typically takes 3-5 business days. Expedited shipping options are available at checkout.
                  </p>
               </FadeIn>

               <FadeIn delay={0.3} direction="up">
                  <div className="my-8 border-2 border-black p-6 bg-accent/5">
                      <h4 className="text-black font-bold mb-2 uppercase text-sm tracking-widest">Processing Time</h4>
                      <p className="m-0 text-sm">
                          Orders are processed within 1-2 business days (Monday-Friday). Orders placed on weekends or holidays will ship the following business day.
                      </p>
                  </div>
               </FadeIn>

               <FadeIn delay={0.4} direction="up">
                  <h3>International Shipping</h3>
                  <p>
                    ZenGlow ships globally! International shipping rates are calculated based on weight and destination. 
                    Please note that customs duties and taxes are not included in the shipping price and are the responsibility of the customer upon delivery.
                  </p>
                  <ul>
                      <li>Canada: 5-10 business days</li>
                      <li>Europe: 7-14 business days</li>
                      <li>Asia Pacific: 10-15 business days</li>
                      <li>Rest of World: 14-21 business days</li>
                  </ul>
               </FadeIn>

               <FadeIn delay={0.5} direction="up">
                  <h3>Order Tracking</h3>
                  <p>
                    Once your order ships, you will receive a confirmation email with a tracking number. 
                    You can check the status of your package at any time via the tracking link provided.
                  </p>
               </FadeIn>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </main>
  );
}

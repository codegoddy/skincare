"use client";

import React from "react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";

const faqs = [
  {
    q: "Are your products cruelty-free?",
    a: "Yes, absolutely. ZenGlow is Leaping Bunny certified. We never test on animals at any stage of product development, and we only work with suppliers who uphold the same strict standards."
  },
  {
    q: "Is the packaging recyclable?",
    a: "We are committed to sustainability. 95% of our packaging is recyclable, including our glass bottles and cardboard boxes. We are actively working towards 100% recyclable or compostable packaging by 2025."
  },
  {
    q: "Do you ship internationally?",
    a: "Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by location. You can calculate shipping costs at checkout."
  },
  {
    q: "What is your return policy?",
    a: "We want you to love your ZenGlow experience. If you are not completely satisfied, you may return unopened products within 30 days of purchase. Please visit our Returns page for more details."
  },
  {
    q: "Are your ingredients organic?",
    a: "We prioritize organic and wild-crafted ingredients whenever possible. All organic ingredients are clearly marked with an asterisk (*) on our ingredient lists."
  },
  {
    q: "Can I use these products on sensitive skin?",
    a: "Our products are formulated to be gentle and effective. However, everyone's skin is different. We recommend patch testing any new product on the inside of your wrist before full application."
  }
];

export default function FAQPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header />
      <div className="pt-32 pb-20">
        <Container>
          <div className="max-w-3xl mx-auto">
             <FadeIn direction="up">
              <h1 className="text-5xl md:text-7xl font-medium leading-none tracking-tight mb-8 text-center">
                FREQUENTLY <br />
                ASKED <span className="font-serif italic text-gray-300">QUESTIONS</span>
              </h1>
            </FadeIn>

            <div className="mt-16 space-y-4">
              {faqs.map((faq, idx) => (
                <FadeIn key={idx} delay={idx * 0.1} direction="up">
                  <details className="group border-2 border-black bg-white open:bg-accent/10 transition-colors">
                    <summary className="flex cursor-pointer items-center justify-between p-6 list-none font-bold text-lg select-none group-open:text-accent-dark">
                      {faq.q}
                      <span className="transition group-open:rotate-180">
                         <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 pt-0 text-gray-600 leading-relaxed">
                      {faq.a}
                    </div>
                  </details>
                </FadeIn>
              ))}
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </main>
  );
}

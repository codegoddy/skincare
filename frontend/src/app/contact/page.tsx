"use client";

import React from "react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header />
      <div className="pt-32 pb-20">
        <Container>
          <div className="max-w-4xl mx-auto">
            <FadeIn direction="up">
              <h1 className="text-5xl md:text-7xl font-medium leading-none tracking-tight mb-8 text-center">
                GET IN <span className="font-serif italic text-gray-300">TOUCH</span>
              </h1>
            </FadeIn>
            
            <FadeIn delay={0.2} direction="up">
              <p className="text-gray-500 text-center mb-16 max-w-2xl mx-auto">
                Have a question about our products or need personalized skincare advice? We're here to help you achieve your most radiant glow.
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-2 border-black p-8 md:p-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <FadeIn delay={0.3} direction="right">
                    <h3 className="text-2xl font-serif italic mb-4">Contact Information</h3>
                    
                    <div className="space-y-6">
                        <div>
                            <p className="text-xs uppercase font-bold tracking-widest text-gray-400 mb-1">Email</p>
                            <a href="mailto:codegoddy@gmail.com" className="text-lg font-medium hover:text-accent transition-colors">codegoddy@gmail.com</a>
                        </div>
                        <div>
                            <p className="text-xs uppercase font-bold tracking-widest text-gray-400 mb-1">Phone</p>
                            <p className="text-lg font-medium">+254708104901</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase font-bold tracking-widest text-gray-400 mb-1">Office</p>
                            <p className="text-lg font-medium">Nairobi, Kenya</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase font-bold tracking-widest text-gray-400 mb-1">Social</p>
                            <div className="flex gap-4 mt-2">
                               {['Instagram', 'Twitter', 'Facebook'].map(social => (
                                   <a key={social} href="#" className="text-sm border-b border-black hover:text-accent hover:border-accent transition-colors">{social}</a>
                               ))}
                            </div>
                        </div>
                    </div>
                </FadeIn>
              </div>

              {/* Form */}
              <div>
                 <form className="space-y-6">
                    <FadeIn delay={0.4} direction="left">
                        <div className="space-y-1">
                            <label className="text-sm font-bold uppercase tracking-wider">Name</label>
                            <input type="text" className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-black transition-colors bg-transparent" placeholder="Jane Doe" />
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.5} direction="left">
                        <div className="space-y-1">
                            <label className="text-sm font-bold uppercase tracking-wider">Email</label>
                            <input type="email" className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-black transition-colors bg-transparent" placeholder="jane@example.com" />
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.6} direction="left">
                        <div className="space-y-1">
                            <label className="text-sm font-bold uppercase tracking-wider">Message</label>
                            <textarea rows={4} className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-black transition-colors bg-transparent resize-none" placeholder="How can we help?" />
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.7} direction="up">
                        <Button className="w-full bg-black text-white hover:bg-accent hover:text-black mt-4 rounded-none border-2 border-transparent hover:border-black transition-all">
                            Send Message
                        </Button>
                    </FadeIn>
                 </form>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </main>
  );
}

import Link from "next/link";
import Image from "next/image";
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

          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
             {[
               "/michela-ampolo-7tDGb3HrITg-unsplash.jpg",
               "/michela-ampolo-7tDGb3HrITg-unsplash.jpg",
               "/michela-ampolo-7tDGb3HrITg-unsplash.jpg",
               "/michela-ampolo-7tDGb3HrITg-unsplash.jpg"
             ].map((src, i) => (
                <FadeIn key={i} delay={i * 0.1} direction="up" className="aspect-square bg-gray-100 overflow-hidden border-2 border-black relative">
                   <Image 
                     src={src} 
                     alt={`Gallery ${i+1}`}
                     fill
                     sizes="(max-width: 768px) 50vw, 25vw"
                     className="object-cover hover:scale-110 transition-transform duration-700" 
                   />
                </FadeIn>
             ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

import React from "react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import FadeIn from "@/components/ui/FadeIn";
import Link from "next/link";
import Image from "next/image";

const products = [
  {
    id: 1,
    name: "ANTI ACNE FACE CREAM",
    type: "CLEANSER",
    price: "KSh 10,400",
    image: "/michela-ampolo-7tDGb3HrITg-unsplash.jpg",
    isNew: false,
  },
  {
    id: 2,
    name: "MILD CLEANSING FACE WASH",
    type: "CLEANSER",
    price: "KSh 6,500",
    image: "/michela-ampolo-7tDGb3HrITg-unsplash.jpg",
    isNew: true,
  },
  {
    id: 3,
    name: "MOISTURIZING HAND CREAM",
    type: "CLEANSER",
    price: "KSh 11,700",
    image: "/michela-ampolo-7tDGb3HrITg-unsplash.jpg",
    isNew: false,
  },
];

export default function ProductShowcase() {
  return (
    <section id="products" className="py-20 bg-white">
      <Container>
        {/* Heading */}
        <div className="text-center mb-20">
          <FadeIn direction="up">
            <h2 className="text-3xl md:text-5xl font-medium leading-tight">
              A COLLECTION OF PREMIER <br/>
              SELF-CARE <span className="font-serif italic text-gray-300">LUXURIES</span>
            </h2>
          </FadeIn>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, idx) => (
             <FadeIn key={product.id} delay={0.2 * idx} direction="up" className="h-full">
                <div className="group flex flex-col h-full">
                  {/* Image Container */}
                  <div className="relative w-full aspect-square bg-gray-50 mb-6 overflow-hidden border-2 border-black">
                    <Image 
                      src={product.image} 
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* New Badge */}
                    {product.isNew && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10 transition-transform group-hover:rotate-12">
                        <Badge text="NEW" color="accent" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="w-full mt-auto">
                    <h3 className="text-sm font-bold tracking-wide mb-4">{product.name}</h3>
                    <div className="flex items-center text-xs font-medium text-gray-500 border-t border-gray-200 pt-3 mb-4">
                      <span className="pr-4 border-r border-gray-300">{product.type}</span>
                      <span className="pl-4">{product.price}</span>
                    </div>
                    <div className="w-full">
                       <Link href="/shop" className="block w-full">
                         <Button variant="outline" className="w-full rounded-none border-2 border-black text-xs py-3 hover:!bg-black hover:!text-white transition-colors duration-300">
                           Shop now
                         </Button>
                       </Link>
                    </div>
                  </div>
                </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}

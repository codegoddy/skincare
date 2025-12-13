import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, imageSrc, imageAlt, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Side - Image (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-gray-100">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" /> {/* Subtle overlay */}
        <div className="absolute top-8 left-8 z-10">
           <Link href="/" className="text-3xl font-bold tracking-tight text-white font-sans drop-shadow-md">
                ZEN<span className="font-light">GLOW</span>
            </Link>
        </div>
        <div className="absolute bottom-12 left-12 z-10 text-white max-w-md">
            <h2 className="text-4xl font-serif font-bold mb-4">Natural Beauty, <br/>Elevated.</h2>
            <p className="text-lg font-light text-white/90">Experience the purest skincare collection designed to bring out your inner radiance.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <div className="w-full max-w-md space-y-8">
            {/* Header for Mobile only */}
            <div className="lg:hidden flex items-center justify-between mb-8">
                 <Link href="/" className="text-2xl font-bold tracking-tight text-primary font-sans">
                    ZEN<span className="font-light text-gray-400">GLOW</span>
                </Link>
            </div>

            <div className="space-y-2 text-center lg:text-left">
                <h1 className="text-3xl font-serif font-bold text-primary">{title}</h1>
                <p className="text-gray-500 text-sm tracking-wide">{subtitle}</p>
            </div>

            {children}

            <div className="pt-6 text-center">
                 <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Store
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}

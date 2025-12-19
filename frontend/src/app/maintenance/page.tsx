"use client";

import React from 'react';
import { Settings, RefreshCw, Mail } from 'lucide-react';
import Container from '@/components/ui/Container';

export default function MaintenancePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl"></div>
              <div className="relative bg-white border-2 border-black p-8 rounded-full">
                <Settings size={64} className="text-primary animate-spin" style={{ animationDuration: '3s' }} />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            We&apos;ll Be Right Back
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            We&apos;re currently performing scheduled maintenance to improve your experience. 
            We&apos;ll be back online shortly.
          </p>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <p className="text-sm text-gray-500">Working on updates...</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors"
            >
              <RefreshCw size={16} />
              Refresh Page
            </button>
            
            <a
              href="mailto:support@zenglow.com"
              className="flex items-center gap-2 px-6 py-3 border-2 border-black text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              <Mail size={16} />
              Contact Support
            </a>
          </div>

          {/* Additional Info */}
          <div className="border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-500">
              Thank you for your patience. If you need immediate assistance, 
              please contact us at{' '}
              <a href="mailto:support@zenglow.com" className="text-primary hover:underline font-medium">
                support@zenglow.com
              </a>
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="mt-12 flex justify-center gap-8 text-gray-300">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>
        </div>
      </Container>
    </div>
  );
}

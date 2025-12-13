"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Loader2, CheckCircle } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import { useForgotPassword } from '@/hooks/useAuth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  
  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    forgotPasswordMutation.mutate({ email });
  };

  if (forgotPasswordMutation.isSuccess) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="We've sent you a password reset link."
        imageSrc="/michela-ampolo-7tDGb3HrITg-unsplash.jpg"
        imageAlt="Skincare products"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-2 p-4 bg-primary/5 border border-primary/20 text-primary text-sm">
            <CheckCircle size={20} />
            <p>If an account exists with {email}, you will receive a password reset link shortly.</p>
          </div>
          
          <Link 
            href="/login" 
            className="block w-full bg-primary text-white font-bold text-xs uppercase tracking-widest py-4 text-center hover:bg-black/90 transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email and we'll send you a reset link."
      imageSrc="/michela-ampolo-7tDGb3HrITg-unsplash.jpg"
      imageAlt="Skincare products"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-primary focus:bg-white transition-colors placeholder:text-gray-400"
          />
        </div>

        <button
          type="submit"
          disabled={forgotPasswordMutation.isPending}
          className="w-full bg-primary text-white font-bold text-xs uppercase tracking-widest py-4 hover:bg-black/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {forgotPasswordMutation.isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending...
            </>
          ) : (
            'Send Reset Link'
          )}
        </button>

        <div className="text-center text-sm text-gray-500 mt-8">
          Remember your password?{' '}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

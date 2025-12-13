"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import { useLogin } from '@/hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Please sign in to access your account."
      imageSrc="/michela-ampolo-7tDGb3HrITg-unsplash.jpg"
      imageAlt="Skincare products close up"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
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
            
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-gray-500">
                        Password
                    </label>
                    <Link href="/forgot-password" className="text-xs text-primary/60 hover:text-primary transition-colors">
                        Forgot Password?
                    </Link>
                </div>
                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-primary focus:bg-white transition-colors placeholder:text-gray-400"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>
        </div>

        <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-primary text-white font-bold text-xs uppercase tracking-widest py-4 hover:bg-black/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            {loginMutation.isPending ? (
                <>
                    <Loader2 size={16} className="animate-spin" />
                    Signing in...
                </>
            ) : (
                'Sign In'
            )}
        </button>

        <div className="text-center text-sm text-gray-500 mt-8">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary font-bold hover:underline">
                Sign up
            </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

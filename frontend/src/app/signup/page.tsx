"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import PasswordStrengthIndicator from '@/components/auth/PasswordStrengthIndicator';
import { useSignup } from '@/hooks/useAuth';
import { toast } from '@/stores/toast';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const signupMutation = useSignup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    signupMutation.mutate({ email, password, full_name: fullName });
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join us for a personalized skincare journey."
      imageSrc="/michela-ampolo-7tDGb3HrITg-unsplash.jpg"
      imageAlt="Skincare collection"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
             <div>
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                    Full Name
                </label>
                <input
                    id="name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-primary focus:bg-white transition-colors placeholder:text-gray-400"
                />
            </div>

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
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                    Password
                </label>
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
                
                {/* Password Strength Indicator */}
                <PasswordStrengthIndicator password={password} show={password.length > 0} />
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                    Confirm Password
                </label>
                <div className="relative">
                    <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-primary focus:bg-white transition-colors placeholder:text-gray-400"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                    <p className="mt-2 text-xs text-red-600">Passwords do not match</p>
                )}
            </div>
        </div>

        <button
            type="submit"
            disabled={signupMutation.isPending}
            className="w-full bg-primary text-white font-bold text-xs uppercase tracking-widest py-4 hover:bg-black/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            {signupMutation.isPending ? (
                 <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating Account...
                </>
            ) : (
                'Create Account'
            )}
        </button>

        <div className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-bold hover:underline">
                Sign in
            </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

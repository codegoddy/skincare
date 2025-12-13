"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Edit2, 
  Save, 
  X, 
  LogOut,
  Loader2,
  ShoppingBag,
  ChevronRight,
  Heart,
  Settings
} from 'lucide-react';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import Container from '@/components/ui/Container';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useLogout } from '@/hooks/useAuth';
import { getAccessToken } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const { data: profile, isLoading, isError } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const logoutMutation = useLogout();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
  });

  // Redirect if no token or profile fetch fails
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push('/login');
      return;
    }
    if (isError && !isLoading) {
      router.push('/login');
    }
  }, [isError, isLoading, router]);

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  const handleSave = () => {
    updateProfileMutation.mutate(formData, {
      onSuccess: () => setIsEditing(false),
    });
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
      });
    }
    setIsEditing(false);
  };

   // Show loading while checking auth or fetching profile
  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)', paddingTop: '5rem' }}>
          <div className="text-center">
            <Loader2 size={32} className="animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-400 text-sm">Loading your profile...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (isError || !profile) {
    return (
      <main className="flex min-h-screen flex-col bg-white">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center pt-20 gap-4">
          <p className="text-gray-500">Unable to load profile</p>
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-accent/30 to-white">
        <Container>
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-primary text-white flex items-center justify-center text-5xl font-serif shadow-lg">
              {profile.full_name?.[0]?.toUpperCase() || profile.email[0].toUpperCase()}
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="font-serif text-4xl md:text-5xl mb-2">
                {profile.full_name || 'Welcome'}
              </h1>
              <p className="text-gray-500">{profile.email}</p>
              <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest">
                Member since {profile.created_at
                  ? new Date(profile.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })
                  : '—'}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar - Quick Links */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Quick Links</h3>
                
                <Link
                  href="/orders"
                  className="flex items-center justify-between p-4 bg-white hover:bg-accent/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag size={18} className="text-gray-400 group-hover:text-primary" />
                    <span className="font-medium">Order History</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </Link>
                
                <Link
                  href="/wishlist"
                  className="flex items-center justify-between p-4 bg-white hover:bg-accent/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Heart size={18} className="text-gray-400 group-hover:text-primary" />
                    <span className="font-medium">Wishlist</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </Link>
                
                <Link
                  href="/settings"
                  className="flex items-center justify-between p-4 bg-white hover:bg-accent/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Settings size={18} className="text-gray-400 group-hover:text-primary" />
                    <span className="font-medium">Settings</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </Link>

                <button
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="w-full flex items-center justify-between p-4 bg-white hover:bg-red-50 transition-colors group text-left"
                >
                  <div className="flex items-center gap-3">
                    <LogOut size={18} className="text-red-400 group-hover:text-red-600" />
                    <span className="font-medium text-red-600">Sign Out</span>
                  </div>
                  {logoutMutation.isPending && <Loader2 size={16} className="animate-spin text-red-400" />}
                </button>
              </div>
            </div>

            {/* Main Content - Profile Details */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Profile Information</h3>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest bg-white hover:bg-accent transition-colors"
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Full Name */}
                  <div className="bg-white p-4">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                      <User size={14} />
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-primary focus:bg-white transition-colors"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-lg font-medium">{profile.full_name || '—'}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="bg-white p-4">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                      <Mail size={14} />
                      Email Address
                    </label>
                    <p className="text-lg font-medium">{profile.email}</p>
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                  </div>

                  {/* Phone */}
                  <div className="bg-white p-4">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                      <Phone size={14} />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-primary focus:bg-white transition-colors"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="text-lg font-medium">{profile.phone || '—'}</p>
                    )}
                  </div>

                  {/* Member Since */}
                  <div className="bg-white p-4">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                      <Calendar size={14} />
                      Member Since
                    </label>
                    <p className="text-lg font-medium">
                      {profile.created_at
                        ? new Date(profile.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : '—'}
                    </p>
                  </div>
                </div>

                {/* Edit Actions */}
                {isEditing && (
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleSave}
                      disabled={updateProfileMutation.isPending}
                      className="flex-1 bg-primary text-white font-bold text-xs uppercase tracking-widest py-4 hover:bg-black/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {updateProfileMutation.isPending ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Save size={14} />
                      )}
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-8 py-4 border border-gray-200 text-gray-600 font-bold text-xs uppercase tracking-widest hover:border-gray-400 transition-colors flex items-center gap-2"
                    >
                      <X size={14} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}

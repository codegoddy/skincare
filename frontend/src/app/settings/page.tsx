"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Settings, 
  ChevronLeft,
  Loader2,
  Bell,
  Lock,
  Mail,
  Trash2,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import Container from '@/components/ui/Container';
import FadeIn from '@/components/ui/FadeIn';
import Button from '@/components/ui/Button';
import { getAccessToken } from '@/lib/api';
import { useSettings, useUpdateSettings, useChangePassword } from '@/hooks/useSettings';
import { toast } from '@/stores/toast';

export default function SettingsPage() {
  const router = useRouter();
  const { data: settingsData, isLoading } = useSettings();
  const updateSettingsMutation = useUpdateSettings();
  const changePasswordMutation = useChangePassword();

  // Password change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleNotificationChange = (key: 'order_updates' | 'promotions' | 'newsletter' | 'product_alerts') => {
    const currentValue = settingsData?.notifications[key] ?? false;
    updateSettingsMutation.mutate({ [key]: !currentValue });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    changePasswordMutation.mutate(
      {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      },
      {
        onSuccess: () => {
          setShowPasswordForm(false);
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)', paddingTop: '5rem' }}>
          <div className="text-center">
            <Loader2 size={32} className="animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-400 text-sm">Loading settings...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const notifications = settingsData?.notifications || {
    order_updates: true,
    promotions: false,
    newsletter: true,
    product_alerts: false,
  };

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header />
      
      <div className="pt-32 pb-20">
        <Container>
          {/* Header */}
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <FadeIn direction="up">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Link href="/profile" className="text-gray-400 hover:text-primary transition-colors absolute left-4 md:left-8">
                  <ChevronLeft size={24} />
                </Link>
                <Settings size={32} className="text-primary" />
              </div>
              <h1 className="text-5xl md:text-7xl font-medium leading-none tracking-tight mb-4">
                ACCOUNT <span className="font-serif italic text-gray-300">SETTINGS</span>
              </h1>
              <p className="text-gray-500">Manage your preferences and security</p>
            </FadeIn>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            {/* Notification Preferences */}
            <FadeIn delay={0.1} direction="up">
              <div className="border-2 border-black">
                <div className="p-6 bg-gray-50 border-b-2 border-black">
                  <div className="flex items-center gap-3">
                    <Bell size={20} className="text-primary" />
                    <h2 className="text-xs font-bold tracking-widest uppercase">Email Notifications</h2>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {[
                    { key: 'order_updates' as const, label: 'Order Updates', description: 'Shipping and delivery notifications' },
                    { key: 'promotions' as const, label: 'Promotions', description: 'Special offers and discounts' },
                    { key: 'newsletter' as const, label: 'Newsletter', description: 'Weekly skincare tips and news' },
                    { key: 'product_alerts' as const, label: 'Product Alerts', description: 'Back in stock and new arrivals' },
                  ].map((item) => (
                    <div key={item.key} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange(item.key)}
                        disabled={updateSettingsMutation.isPending}
                        className={`w-12 h-6 rounded-full transition-colors duration-300 flex items-center disabled:opacity-50 ${
                          notifications[item.key]
                            ? 'bg-primary justify-end' 
                            : 'bg-gray-300 justify-start'
                        }`}
                      >
                        <span className="w-5 h-5 bg-white rounded-full mx-0.5 shadow-sm transition-all flex items-center justify-center">
                          {notifications[item.key] && (
                            <Check size={12} className="text-primary" />
                          )}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Security */}
            <FadeIn delay={0.2} direction="up">
              <div className="border-2 border-black">
                <div className="p-6 bg-gray-50 border-b-2 border-black">
                  <div className="flex items-center gap-3">
                    <Lock size={20} className="text-primary" />
                    <h2 className="text-xs font-bold tracking-widest uppercase">Security</h2>
                  </div>
                </div>
                <div className="p-6">
                  {!showPasswordForm ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Password</p>
                        <p className="text-sm text-gray-500">Change your account password</p>
                      </div>
                      <Button 
                        onClick={() => setShowPasswordForm(true)}
                        className="rounded-none border-2 border-black text-[10px] py-2 px-4 !bg-transparent !text-black hover:!bg-black hover:!text-white transition-all duration-300 uppercase font-bold tracking-widest"
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2 block">Current Password</label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 text-sm focus:outline-none focus:border-black transition-colors"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                          >
                            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2 block">New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 text-sm focus:outline-none focus:border-black transition-colors"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                          >
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2 block">Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 text-sm focus:outline-none focus:border-black transition-colors"
                          required
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button
                          type="submit"
                          disabled={changePasswordMutation.isPending}
                          className="flex-1 rounded-none border-2 border-black text-[10px] py-3 !bg-black !text-white hover:!bg-gray-800 transition-all duration-300 uppercase font-bold tracking-widest disabled:opacity-50"
                        >
                          {changePasswordMutation.isPending ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Update Password'}
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            setShowPasswordForm(false);
                            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                          }}
                          className="rounded-none border-2 border-gray-200 text-[10px] py-3 px-6 !bg-transparent !text-gray-600 hover:!border-gray-400 transition-all duration-300 uppercase font-bold tracking-widest"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </FadeIn>

            {/* Email Preferences */}
            <FadeIn delay={0.3} direction="up">
              <div className="border-2 border-black">
                <div className="p-6 bg-gray-50 border-b-2 border-black">
                  <div className="flex items-center gap-3">
                    <Mail size={20} className="text-primary" />
                    <h2 className="text-xs font-bold tracking-widest uppercase">Email Address</h2>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-500 text-sm">
                    To change your email address, please contact our support team.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Danger Zone */}
            <FadeIn delay={0.4} direction="up">
              <div className="border-2 border-red-200">
                <div className="p-6 bg-red-50 border-b-2 border-red-200">
                  <div className="flex items-center gap-3">
                    <Trash2 size={20} className="text-red-500" />
                    <h2 className="text-xs font-bold tracking-widest uppercase text-red-600">Danger Zone</h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-600">Delete Account</p>
                      <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                    </div>
                    <Button 
                      className="rounded-none border-2 border-red-200 text-[10px] py-2 px-4 !bg-transparent !text-red-600 hover:!bg-red-600 hover:!text-white hover:!border-red-600 transition-all duration-300 uppercase font-bold tracking-widest"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </Container>
      </div>
      <Footer />
    </main>
  );
}

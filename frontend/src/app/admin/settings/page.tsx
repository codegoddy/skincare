"use client";

import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign, 
  Truck, 
  Percent,
  AlertTriangle,
  Loader2,
  Save
} from 'lucide-react';
import { useStoreSettings, useUpdateStoreSettings } from '@/hooks/useAdminUsers';
import CustomSelect from '@/components/ui/CustomSelect';

export default function SettingsPage() {
  const { data: settings, isLoading } = useStoreSettings();
  const updateMutation = useUpdateStoreSettings();
  
  const [formData, setFormData] = useState({
    store_name: '',
    store_email: '',
    store_phone: '',
    store_address: '',
    currency: 'USD',
    currency_symbol: '$',
    tax_rate: 0,
    shipping_fee: 0,
    free_shipping_threshold: 0,
    maintenance_mode: false,
  });

  // Populate form when settings load
  useEffect(() => {
    if (settings) {
      setFormData({
        store_name: settings.store_name || '',
        store_email: settings.store_email || '',
        store_phone: settings.store_phone || '',
        store_address: settings.store_address || '',
        currency: settings.currency || 'USD',
        currency_symbol: settings.currency_symbol || '$',
        tax_rate: settings.tax_rate || 0,
        shipping_fee: settings.shipping_fee || 0,
        free_shipping_threshold: settings.free_shipping_threshold || 0,
        maintenance_mode: settings.maintenance_mode || false,
      });
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Settings</h1>
          <p className="text-gray-500 text-sm mt-1 tracking-wide">Configure your store settings.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Information */}
        <div className="border border-gray-100 bg-white">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <Store size={18} className="text-primary" />
              <h2 className="text-xs font-bold tracking-widest uppercase">Store Information</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2 block">Store Name</label>
              <input
                type="text"
                value={formData.store_name}
                onChange={(e) => handleChange('store_name', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-primary transition-colors"
                placeholder="ZenGlow"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2 block flex items-center gap-2">
                  <Mail size={14} /> Email
                </label>
                <input
                  type="email"
                  value={formData.store_email}
                  onChange={(e) => handleChange('store_email', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="contact@zenglow.com"
                />
              </div>
              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2 block flex items-center gap-2">
                  <Phone size={14} /> Phone
                </label>
                <input
                  type="tel"
                  value={formData.store_phone}
                  onChange={(e) => handleChange('store_phone', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2 block flex items-center gap-2">
                <MapPin size={14} /> Address
              </label>
              <textarea
                value={formData.store_address}
                onChange={(e) => handleChange('store_address', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                rows={2}
                placeholder="123 Skincare Ave, Beauty City, BC 12345"
              />
            </div>
          </div>
        </div>

        {/* Currency & Pricing */}
        <div className="border border-gray-100 bg-white">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <DollarSign size={18} className="text-primary" />
              <h2 className="text-xs font-bold tracking-widest uppercase">Currency & Pricing</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2 block">Currency</label>
                <CustomSelect
                  value={formData.currency}
                  onChange={(val) => handleChange('currency', val)}
                  options={[
                    { label: 'USD - US Dollar', value: 'USD' },
                    { label: 'EUR - Euro', value: 'EUR' },
                    { label: 'GBP - British Pound', value: 'GBP' },
                    { label: 'KES - Kenyan Shilling', value: 'KES' },
                  ]}
                  placeholder="Select currency"
                />
              </div>
              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2 block">Currency Symbol</label>
                <input
                  type="text"
                  value={formData.currency_symbol}
                  onChange={(e) => handleChange('currency_symbol', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="$"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2 block flex items-center gap-2">
                <Percent size={14} /> Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.tax_rate}
                onChange={(e) => handleChange('tax_rate', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="border border-gray-100 bg-white">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-primary" />
              <h2 className="text-xs font-bold tracking-widest uppercase">Shipping</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2 block">Default Shipping Fee</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{formData.currency_symbol}</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.shipping_fee}
                    onChange={(e) => handleChange('shipping_fee', parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2 block">Free Shipping Threshold</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{formData.currency_symbol}</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.free_shipping_threshold}
                    onChange={(e) => handleChange('free_shipping_threshold', parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="0 = no free shipping"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Set to 0 to disable free shipping</p>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="border border-amber-200 bg-amber-50/30">
          <div className="px-6 py-4 border-b border-amber-200 bg-amber-50">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-600" />
              <h2 className="text-xs font-bold tracking-widest uppercase text-amber-700">Maintenance Mode</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Maintenance Mode</p>
                <p className="text-sm text-gray-500">When enabled, customers will see a maintenance page</p>
              </div>
              <button
                type="button"
                onClick={() => handleChange('maintenance_mode', !formData.maintenance_mode)}
                className={`w-12 h-6 rounded-full transition-colors duration-300 flex items-center ${
                  formData.maintenance_mode
                    ? 'bg-amber-500 justify-end' 
                    : 'bg-gray-300 justify-start'
                }`}
              >
                <span className="w-5 h-5 bg-white rounded-full mx-0.5 shadow-sm transition-all" />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}

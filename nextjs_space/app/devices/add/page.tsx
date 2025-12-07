'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Monitor, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AddDevicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    os: '',
    ipAddress: '',
    macAddress: '',
    location: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/devices');
      } else {
        console.error('Failed to create device');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error creating device:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/devices"
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Devices</span>
          </Link>

          <div className="bg-card rounded-xl shadow-md p-8 border">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500">
                <Monitor className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Add New Device</h1>
                <p className="text-sm text-muted-foreground">Register a new device to your security network</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Device Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g., CEO Laptop"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium mb-2">
                    Device Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select type</option>
                    <option value="Desktop">Desktop</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Server">Server</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="os" className="block text-sm font-medium mb-2">
                    Operating System
                  </label>
                  <input
                    type="text"
                    id="os"
                    name="os"
                    value={formData.os}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g., Windows 11, macOS Sonoma"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g., Main Office, Conference Room"
                  />
                </div>

                <div>
                  <label htmlFor="ipAddress" className="block text-sm font-medium mb-2">
                    IP Address
                  </label>
                  <input
                    type="text"
                    id="ipAddress"
                    name="ipAddress"
                    value={formData.ipAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g., 192.168.1.100"
                  />
                </div>

                <div>
                  <label htmlFor="macAddress" className="block text-sm font-medium mb-2">
                    MAC Address
                  </label>
                  <input
                    type="text"
                    id="macAddress"
                    name="macAddress"
                    value={formData.macAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g., 00:1B:44:11:3A:B7"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium mb-2">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  placeholder="Additional notes about this device..."
                />
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                <Link
                  href="/devices"
                  className="px-6 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'Saving...' : 'Save Device'}</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Mail, ArrowLeft, Send, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PhishingTestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    targetEmail: '',
    subject: '',
    testType: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const testTypes = [
    { value: 'link-click', label: 'Suspicious Link Click', description: 'Test if recipients click on suspicious links' },
    { value: 'attachment', label: 'Malicious Attachment', description: 'Simulate opening a dangerous file attachment' },
    { value: 'credential-harvest', label: 'Credential Harvesting', description: 'Test for entering credentials on fake login pages' },
    { value: 'urgent-request', label: 'Urgent Request', description: 'Simulate urgent requests from executives or IT' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/phishing/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/phishing/reports');
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating phishing test:', error);
    } finally {
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
            href="/phishing"
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Phishing Protection</span>
          </Link>

          <div className="bg-card rounded-xl shadow-md p-8 border">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Create Phishing Test</h1>
                <p className="text-sm text-muted-foreground">Configure a phishing simulation for your team</p>
              </div>
            </div>

            <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900 dark:text-blue-100">
                  <p className="font-medium mb-1">Note: UI Only</p>
                  <p>This interface demonstrates phishing test configuration. No actual emails will be sent in this demo version.</p>
                </div>
              </div>
            </div>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                  <Send className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Phishing Test Created!</h3>
                <p className="text-muted-foreground">Redirecting to reports...</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="targetEmail" className="block text-sm font-medium mb-2">
                    Target Email Address *
                  </label>
                  <input
                    type="email"
                    id="targetEmail"
                    name="targetEmail"
                    required
                    value={formData.targetEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="user@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Email Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g., Urgent: Verify Your Account"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">
                    Test Type *
                  </label>
                  <div className="space-y-3">
                    {testTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.testType === type.value
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="testType"
                          value={type.value}
                          checked={formData.testType === type.value}
                          onChange={handleChange}
                          className="mt-1"
                          required
                        />
                        <div>
                          <p className="font-medium">{type.label}</p>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                  <Link
                    href="/phishing"
                    className="px-6 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-600 transition-all disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    <span>{loading ? 'Creating...' : 'Create Test'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

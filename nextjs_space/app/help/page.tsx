'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { HelpCircle, Mail, Phone, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HelpPage() {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ subject: '', message: '' });
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      question: 'How do I add a new device to the system?',
      answer: 'Navigate to the Devices page and click the "Add Device" button. Fill in the required information and click Save.',
    },
    {
      question: 'What should I do if I receive a phishing email?',
      answer: 'Do not click any links or download attachments. Report the email to your IT department immediately and delete it.',
    },
    {
      question: 'How often should I run phishing simulations?',
      answer: 'We recommend running phishing simulations at least quarterly to keep your team aware and vigilant.',
    },
    {
      question: 'Can I customize the incident response plans?',
      answer: 'Yes, you can customize response plans through your dashboard settings or contact support for assistance.',
    },
    {
      question: 'What is two-factor authentication?',
      answer: '2FA adds an extra layer of security by requiring a second form of verification beyond your password.',
    },
    {
      question: 'How do I update my profile information?',
      answer: 'Click on the Settings icon in the navigation bar to access your profile and update your information.',
    },
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      value: 'support@cybershield.com',
      description: 'Response within 24 hours',
      color: 'from-blue-600 to-cyan-500',
    },
    {
      icon: Phone,
      title: 'Phone Support',
      value: '+1 (555) 123-4567',
      description: 'Mon-Fri, 9AM-5PM EST',
      color: 'from-green-600 to-emerald-500',
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      value: 'Available 24/7',
      description: 'Instant support',
      color: 'from-purple-600 to-pink-500',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 mb-4"
            >
              <HelpCircle className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-4">Help & Support</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get the assistance you need to protect your organization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-card rounded-xl shadow-md p-6 border hover:shadow-lg transition-shadow text-center"
                >
                  <div className={`mx-auto p-4 rounded-lg bg-gradient-to-br ${method.color} w-fit mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{method.title}</h3>
                  <p className="text-sm font-medium text-blue-600 mb-1">{method.value}</p>
                  <p className="text-xs text-muted-foreground">{method.description}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-card rounded-xl shadow-md p-8 border"
            >
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b last:border-0 pb-6 last:pb-0">
                    <h3 className="font-bold mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-card rounded-xl shadow-md p-8 border"
            >
              <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
              
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center space-x-2"
                >
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-green-800 dark:text-green-200">
                    Your message has been sent successfully!
                  </span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                    placeholder="Describe your issue or question..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span>{loading ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl shadow-md p-8 text-white text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Need Immediate Assistance?</h2>
            <p className="mb-6 text-blue-100">
              For urgent security issues, please contact our emergency response team immediately.
            </p>
            <a
              href="tel:+15551234567"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>+1 (555) 123-4567</span>
            </a>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

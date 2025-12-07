'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { Mail, BookOpen, BarChart3, Send, Shield, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PhishingPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) return null;

  const features = [
    {
      title: 'Test Phishing Email',
      description: 'Create and configure phishing simulation tests for your team',
      icon: Send,
      href: '/phishing/test',
      color: 'from-purple-600 to-pink-500',
    },
    {
      title: 'Learn About Phishing',
      description: 'Educational resources and best practices to recognize phishing attempts',
      icon: BookOpen,
      href: '/phishing/learn',
      color: 'from-blue-600 to-cyan-500',
    },
    {
      title: 'View Reports',
      description: 'Analyze phishing simulation results and track improvements',
      icon: BarChart3,
      href: '/phishing/reports',
      color: 'from-green-600 to-emerald-500',
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
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-500 mb-4"
            >
              <Mail className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-4">Phishing Protection</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Protect your organization from phishing attacks with simulations, education, and analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Link href={feature.href}>
                    <div className="bg-card rounded-xl shadow-md p-8 border hover:shadow-lg transition-all cursor-pointer group h-full">
                      <div className={`p-4 rounded-lg bg-gradient-to-br ${feature.color} w-fit mb-6 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl shadow-md p-8 border border-yellow-200 dark:border-yellow-800"
          >
            <div className="flex items-start space-x-4">
              <AlertTriangle className="h-8 w-8 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Why Phishing Protection Matters</h3>
                <p className="text-muted-foreground mb-4">
                  Phishing attacks are one of the most common cybersecurity threats, targeting individuals through deceptive emails, messages, or websites. These attacks can lead to:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <Shield className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Data Breaches:</strong> Stolen credentials can expose sensitive company and customer data</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Shield className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Financial Loss:</strong> Direct theft or ransomware payments costing thousands</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Shield className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Reputation Damage:</strong> Loss of customer trust and business relationships</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

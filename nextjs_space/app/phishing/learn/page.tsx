'use client';

import { Navigation } from '@/components/navigation';
import { Shield, AlertTriangle, Link as LinkIcon, Mail, FileText, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PhishingLearnPage() {
  const redFlags = [
    {
      icon: Mail,
      title: 'Suspicious Sender',
      description: 'Check the sender\'s email address carefully. Phishers often use addresses that look similar to legitimate ones.',
      color: 'from-red-600 to-orange-500',
    },
    {
      icon: AlertTriangle,
      title: 'Urgent or Threatening Language',
      description: 'Phishing emails often create a sense of urgency or fear to make you act quickly without thinking.',
      color: 'from-yellow-600 to-orange-500',
    },
    {
      icon: LinkIcon,
      title: 'Suspicious Links',
      description: 'Hover over links to see the actual URL. Be wary of shortened URLs or misspelled domains.',
      color: 'from-purple-600 to-pink-500',
    },
    {
      icon: FileText,
      title: 'Unexpected Attachments',
      description: 'Don\'t open attachments from unknown senders, especially executable files (.exe, .zip, .js).',
      color: 'from-blue-600 to-cyan-500',
    },
    {
      icon: Lock,
      title: 'Requests for Personal Information',
      description: 'Legitimate companies never ask for passwords, credit card numbers, or SSN via email.',
      color: 'from-green-600 to-emerald-500',
    },
  ];

  const bestPractices = [
    'Verify sender identity through a separate channel before acting on requests',
    'Enable two-factor authentication on all important accounts',
    'Keep software and security systems up to date',
    'Use strong, unique passwords for each account',
    'Report suspicious emails to your IT security team',
    'Think before you click - when in doubt, don\'t click',
    'Use email filters and spam protection tools',
    'Regularly train yourself and your team on phishing recognition',
  ];

  const examples = [
    {
      type: 'Suspicious',
      subject: 'URGENT: Verify Your Account Now!',
      from: 'security@paypa1-verify.com',
      warning: 'Misspelled domain, urgent language, unusual sender',
    },
    {
      type: 'Suspicious',
      subject: 'You\'ve won $10,000! Claim now',
      from: 'winner@lotteryrandom.net',
      warning: 'Too good to be true, unknown sender',
    },
    {
      type: 'Legitimate',
      subject: 'Your invoice for Order #12345',
      from: 'noreply@company.com',
      warning: 'Expected email, legitimate domain, specific order number',
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
          <Link
            href="/phishing"
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Phishing Protection</span>
          </Link>

          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 mb-4"
            >
              <Shield className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-4">Learn About Phishing</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Understand phishing tactics and learn how to protect yourself and your organization
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl shadow-md p-8 border mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">What is Phishing?</h2>
            <p className="text-muted-foreground mb-4">
              Phishing is a type of cyber attack where attackers impersonate legitimate organizations or individuals to trick recipients into revealing sensitive information, downloading malware, or taking other harmful actions.
            </p>
            <p className="text-muted-foreground">
              These attacks commonly occur through email, but can also happen via text messages (smishing), phone calls (vishing), or social media. Understanding how to recognize phishing attempts is your first line of defense.
            </p>
          </motion.div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Red Flags to Watch For</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {redFlags.map((flag, index) => {
                const Icon = flag.icon;
                return (
                  <motion.div
                    key={flag.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-card rounded-xl shadow-md p-6 border hover:shadow-lg transition-shadow"
                  >
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${flag.color} w-fit mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{flag.title}</h3>
                    <p className="text-sm text-muted-foreground">{flag.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-card rounded-xl shadow-md p-8 border mb-8"
          >
            <h2 className="text-2xl font-bold mb-6">Email Examples</h2>
            <div className="space-y-4">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    example.type === 'Suspicious'
                      ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                      : 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        example.type === 'Suspicious'
                          ? 'bg-red-600 text-white'
                          : 'bg-green-600 text-white'
                      }`}
                    >
                      {example.type}
                    </span>
                  </div>
                  <p className="font-medium mb-1">Subject: {example.subject}</p>
                  <p className="text-sm text-muted-foreground mb-2">From: {example.from}</p>
                  <p className="text-sm">
                    <strong>Analysis:</strong> {example.warning}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-card rounded-xl shadow-md p-8 border mb-8"
          >
            <h2 className="text-2xl font-bold mb-6">Best Practices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bestPractices.map((practice, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{practice}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl shadow-md p-8 text-white text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Stay Vigilant!</h2>
            <p className="mb-6 text-blue-100">
              When in doubt, always verify through official channels before taking action on any suspicious communication.
            </p>
            <Link
              href="/phishing/test"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              <span>Test Your Knowledge</span>
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

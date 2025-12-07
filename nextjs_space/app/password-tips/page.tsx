'use client';

import { Navigation } from '@/components/navigation';
import { Key, CheckCircle, XCircle, Shield, Lock, Eye, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function PasswordTipsPage() {
  const [password, setPassword] = useState('');

  const checkPasswordStrength = (pwd: string) => {
    const checks = {
      length: pwd.length >= 12,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    };

    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score };
  };

  const { checks, score } = checkPasswordStrength(password);

  const getStrengthColor = (score: number) => {
    if (score <= 2) return 'bg-red-500';
    if (score <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (score: number) => {
    if (score <= 2) return 'Weak';
    if (score <= 4) return 'Medium';
    return 'Strong';
  };

  const dos = [
    'Use at least 12 characters (longer is better)',
    'Mix uppercase and lowercase letters',
    'Include numbers and special characters',
    'Use unique passwords for each account',
    'Consider using a password manager',
    'Enable two-factor authentication when available',
    'Change passwords if you suspect a breach',
    'Use passphrases (e.g., "Coffee!Morning@2024")',
  ];

  const donts = [
    "Don't use personal information (names, birthdays)",
    "Don't use common words or patterns (password123)",
    "Don't reuse passwords across multiple sites",
    "Don't share your passwords with others",
    "Don't write passwords on sticky notes",
    "Don't use sequential patterns (abc123, qwerty)",
    "Don't save passwords in unencrypted files",
    "Don't ignore security update prompts",
  ];

  const examples = [
    {
      password: 'password123',
      strength: 'Very Weak',
      why: 'Common word, sequential numbers, no special characters',
      color: 'text-red-600',
    },
    {
      password: 'John1985!',
      strength: 'Weak',
      why: 'Personal information (name, birth year)',
      color: 'text-orange-600',
    },
    {
      password: 'Tr0pic@lSunset!',
      strength: 'Medium',
      why: 'Good mix but somewhat predictable pattern',
      color: 'text-yellow-600',
    },
    {
      password: 'B3st#C0ff33!M0rn1ng',
      strength: 'Strong',
      why: 'Long, mixed case, numbers, special chars, unpredictable',
      color: 'text-green-600',
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
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-emerald-500 mb-4"
            >
              <Key className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-4">Password Security Tips</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create strong, secure passwords to protect your accounts and sensitive information
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl shadow-md p-8 border mb-8"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <span>Test Password Strength</span>
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Enter a password to test:</label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Type a password..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {password && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Strength:</span>
                      <span className={`text-sm font-bold ${score <= 2 ? 'text-red-600' : score <= 4 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {getStrengthText(score)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${getStrengthColor(score)}`}
                        style={{ width: `${(score / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(checks).map(([key, value]) => (
                      <div
                        key={key}
                        className={`flex items-center space-x-2 p-2 rounded ${
                          value ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
                        }`}
                      >
                        {value ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm capitalize">
                          {key === 'length' ? '12+ characters' : key}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-xl shadow-md p-6 border"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>DO</span>
              </h2>
              <ul className="space-y-3">
                {dos.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-xl shadow-md p-6 border"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span>DON'T</span>
              </h2>
              <ul className="space-y-3">
                {donts.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-xl shadow-md p-8 border mb-8"
          >
            <h2 className="text-2xl font-bold mb-6">Password Examples</h2>
            <div className="space-y-4">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {example.password}
                    </code>
                    <span className={`text-sm font-bold ${example.color}`}>
                      {example.strength}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{example.why}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl shadow-md p-6 border border-yellow-200 dark:border-yellow-800"
          >
            <div className="flex items-start space-x-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold mb-2">Remember</h3>
                <p className="text-muted-foreground">
                  Your password is your first line of defense. A strong password combined with two-factor authentication provides the best protection for your accounts. Never share your passwords, even with people you trust.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500"
            >
              <Shield className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="mt-6 text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Reset Password
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {submitted
                ? "We've sent you a reset link"
                : 'Enter your email to receive a reset link'}
            </p>
          </div>

          {!submitted ? (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 pl-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                Send Reset Link
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 space-y-6"
            >
              <div className="flex items-center justify-center space-x-2 rounded-lg bg-green-50 dark:bg-green-900/20 p-4 text-green-800 dark:text-green-200">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">Check your email for the reset link</span>
              </div>
              <p className="text-sm text-center text-muted-foreground">
                If you don't see the email, check your spam folder or try again.
              </p>
            </motion.div>
          )}

          <div className="mt-6">
            <Link
              href="/login"
              className="flex items-center justify-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to sign in</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

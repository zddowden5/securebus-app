'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import {
  Shield,
  Monitor,
  Mail,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Plus,
  Activity,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Device {
  id: string;
  name: string;
  type: string;
  status: string;
  lastScan: string;
}

interface SecurityMetric {
  label: string;
  value: number;
  icon: any;
  color: string;
  change: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchDevices();
    }
  }, [status, router]);

  const fetchDevices = async () => {
    try {
      const response = await fetch('/api/devices');
      if (response.ok) {
        const data = await response.json();
        setDevices(data.devices || []);
      }
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) return null;

  const activeDevices = devices?.filter((d) => d?.status === 'active')?.length ?? 0;
  const warningDevices = devices?.filter((d) => d?.status === 'warning')?.length ?? 0;
  const totalDevices = devices?.length ?? 0;

  const securityMetrics: SecurityMetric[] = [
    {
      label: 'Total Devices',
      value: totalDevices,
      icon: Monitor,
      color: 'from-blue-600 to-cyan-500',
      change: 5,
    },
    {
      label: 'Active Devices',
      value: activeDevices,
      icon: CheckCircle,
      color: 'from-green-600 to-emerald-500',
      change: 3,
    },
    {
      label: 'Alerts',
      value: warningDevices,
      icon: AlertTriangle,
      color: 'from-yellow-600 to-orange-500',
      change: -2,
    },
    {
      label: 'Security Score',
      value: 87,
      icon: Shield,
      color: 'from-purple-600 to-pink-500',
      change: 7,
    },
  ];

  const recentActivity = [
    { id: 1, action: 'Device scan completed', device: 'CEO Laptop', time: '5 minutes ago' },
    { id: 2, action: 'Security update installed', device: 'Office Desktop PC', time: '2 hours ago' },
    { id: 3, action: 'New device added', device: 'Server - Main', time: '1 day ago' },
    { id: 4, action: 'Phishing test completed', device: 'All Devices', time: '2 days ago' },
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {session?.user?.name ?? 'User'}
            </h1>
            <p className="text-muted-foreground">
              Here's your security overview for {(session?.user as any)?.companyName ?? 'your organization'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {securityMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-xl shadow-md p-6 border hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${metric.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <TrendingUp className={`h-4 w-4 ${metric.change >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                      <span className={metric.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold mb-1">{metric.value}</p>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 bg-card rounded-xl shadow-md p-6 border"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-bold">Recent Activity</h2>
                </div>
                <Link
                  href="/devices"
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.device}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{activity.time}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-xl shadow-md p-6 border"
            >
              <div className="flex items-center space-x-2 mb-6">
                <Shield className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold">Quick Actions</h2>
              </div>
              <div className="space-y-3">
                <Link
                  href="/devices/add"
                  className="flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
                >
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <Plus className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Add Device</p>
                    <p className="text-xs text-muted-foreground">Register new hardware</p>
                  </div>
                </Link>
                <Link
                  href="/phishing/test"
                  className="flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
                >
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                    <Mail className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Phishing Test</p>
                    <p className="text-xs text-muted-foreground">Run email simulation</p>
                  </div>
                </Link>
                <Link
                  href="/response-plan"
                  className="flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
                >
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Response Plans</p>
                    <p className="text-xs text-muted-foreground">View incident plans</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl shadow-md p-8 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Security Tip of the Day</h2>
                <p className="text-blue-100 mb-4">
                  Enable two-factor authentication on all critical accounts to add an extra layer of security.
                </p>
                <Link
                  href="/password-tips"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  <span>Learn More</span>
                </Link>
              </div>
              <Shield className="h-24 w-24 text-white/20" />
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

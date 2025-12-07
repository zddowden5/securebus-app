'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Navigation } from '@/components/navigation';
import { BarChart3, ArrowLeft, TrendingDown, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const Charts = dynamic(() => import('@/components/phishing/phishing-charts'), { 
  ssr: false,
  loading: () => <div className="h-80 flex items-center justify-center">Loading charts...</div>
});

interface PhishingReport {
  month: string;
  year: number;
  emailsSent: number;
  emailsOpened: number;
  linksClicked: number;
  credentialsEntered: number;
  reported: number;
  successRate: number;
}

export default function PhishingReportsPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [reports, setReports] = useState<PhishingReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchReports();
    }
  }, [status, router]);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/phishing/reports');
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
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

  const latestReport = reports?.[reports.length - 1];
  const previousReport = reports?.[reports.length - 2];

  const calculateChange = (current?: number, previous?: number) => {
    if (!current || !previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const clickRateChange = calculateChange(
    latestReport?.linksClicked,
    previousReport?.linksClicked
  );

  const reportRateChange = calculateChange(
    latestReport?.reported,
    previousReport?.reported
  );

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

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Phishing Simulation Reports</h1>
            <p className="text-muted-foreground">
              Track and analyze phishing simulation results over time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl shadow-md p-6 border"
            >
              <p className="text-sm text-muted-foreground mb-1">Total Tests</p>
              <p className="text-3xl font-bold">{reports?.reduce((acc, r) => acc + (r?.emailsSent ?? 0), 0) ?? 0}</p>
              <p className="text-xs text-muted-foreground mt-2">Emails sent</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl shadow-md p-6 border"
            >
              <p className="text-sm text-muted-foreground mb-1">Click Rate</p>
              <p className="text-3xl font-bold">
                {latestReport
                  ? `${((latestReport.linksClicked / latestReport.emailsSent) * 100).toFixed(1)}%`
                  : '0%'}
              </p>
              <div className="flex items-center space-x-1 mt-2">
                {clickRateChange < 0 ? (
                  <TrendingDown className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-xs ${clickRateChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(clickRateChange).toFixed(1)}% from last month
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-xl shadow-md p-6 border"
            >
              <p className="text-sm text-muted-foreground mb-1">Report Rate</p>
              <p className="text-3xl font-bold">
                {latestReport
                  ? `${((latestReport.reported / latestReport.emailsSent) * 100).toFixed(1)}%`
                  : '0%'}
              </p>
              <div className="flex items-center space-x-1 mt-2">
                {reportRateChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-xs ${reportRateChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(reportRateChange).toFixed(1)}% from last month
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-xl shadow-md p-6 border"
            >
              <p className="text-sm text-muted-foreground mb-1">Avg Success Rate</p>
              <p className="text-3xl font-bold">
                {reports?.length > 0
                  ? `${(
                      reports.reduce((acc, r) => acc + (r?.successRate ?? 0), 0) / reports.length
                    ).toFixed(1)}%`
                  : '0%'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">Emails opened</p>
            </motion.div>
          </div>

          <Charts reports={reports} />
        </motion.div>
      </main>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

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

interface ChartsProps {
  reports: PhishingReport[];
}

export default function PhishingCharts({ reports }: ChartsProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card rounded-xl shadow-md p-6 border mb-8"
      >
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-bold">Monthly Trends</h2>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={reports} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="emailsOpened"
                stroke="#60B5FF"
                strokeWidth={2}
                name="Emails Opened"
              />
              <Line
                type="monotone"
                dataKey="linksClicked"
                stroke="#FF9149"
                strokeWidth={2}
                name="Links Clicked"
              />
              <Line
                type="monotone"
                dataKey="reported"
                stroke="#72BF78"
                strokeWidth={2}
                name="Reported"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card rounded-xl shadow-md p-6 border"
      >
        <h2 className="text-xl font-bold mb-6">Engagement Breakdown</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reports?.slice(-6) ?? []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="emailsOpened" fill="#60B5FF" name="Opened" />
              <Bar dataKey="linksClicked" fill="#FF9149" name="Clicked" />
              <Bar dataKey="credentialsEntered" fill="#FF6363" name="Credentials" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Shield, AlertTriangle, Phone, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResponsePlan {
  id: string;
  title: string;
  incidentType: string;
  priority: string;
  steps: string[];
  contacts: string[];
  isActive: boolean;
}

export default function ResponsePlanPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [plans, setPlans] = useState<ResponsePlan[]>([]);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchPlans();
    }
  }, [status, router]);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/response-plans');
      if (response.ok) {
        const data = await response.json();
        setPlans(data.plans || []);
        if (data.plans?.length > 0) {
          setExpandedPlan(data.plans[0]?.id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
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

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'high':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

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
            <h1 className="text-3xl font-bold mb-2">Incident Response Plans</h1>
            <p className="text-muted-foreground">
              Predefined action plans for various security incidents
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl shadow-md p-6 border border-red-200 dark:border-red-800 mb-8">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Emergency Preparedness</h3>
                <p className="text-muted-foreground">
                  Having clear response plans in place can significantly reduce the impact of security incidents. Review these plans regularly and ensure all team members know their roles.
                </p>
              </div>
            </div>
          </div>

          {plans?.length === 0 ? (
            <div className="bg-card rounded-xl shadow-md p-12 border text-center">
              <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Response Plans</h3>
              <p className="text-muted-foreground">
                No incident response plans are currently configured.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan?.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-xl shadow-md border overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedPlan(expandedPlan === plan?.id ? null : plan?.id)
                    }
                    className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-red-600 to-orange-500">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-bold">{plan?.title ?? 'Untitled Plan'}</h3>
                        <p className="text-sm text-muted-foreground">{plan?.incidentType ?? 'Unknown Type'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(
                          plan?.priority ?? ''
                        )}`}
                      >
                        {plan?.priority ?? 'Unknown'} Priority
                      </span>
                      {expandedPlan === plan?.id ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {expandedPlan === plan?.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t p-6"
                    >
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center space-x-2 mb-4">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <h4 className="font-bold">Response Steps</h4>
                          </div>
                          <ol className="space-y-3">
                            {plan?.steps?.map((step, idx) => (
                              <li key={idx} className="flex items-start space-x-3">
                                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 text-sm font-bold">
                                  {idx + 1}
                                </span>
                                <span className="text-sm text-muted-foreground pt-0.5">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 mb-4">
                            <Phone className="h-5 w-5 text-green-600" />
                            <h4 className="font-bold">Emergency Contacts</h4>
                          </div>
                          <div className="space-y-2">
                            {plan?.contacts?.map((contact, idx) => (
                              <div
                                key={idx}
                                className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50"
                              >
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{contact}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

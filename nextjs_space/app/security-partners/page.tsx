'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Users, Star, ExternalLink, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

interface SecurityPartner {
  id: string;
  name: string;
  category: string;
  description: string;
  website?: string;
  features: string[];
  pricing?: string;
  rating?: number;
}

export default function SecurityPartnersPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [partners, setPartners] = useState<SecurityPartner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<SecurityPartner[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchPartners();
    }
  }, [status, router]);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredPartners(partners);
    } else {
      setFilteredPartners(
        partners?.filter((p) => p?.category?.toLowerCase() === selectedCategory?.toLowerCase()) ?? []
      );
    }
  }, [selectedCategory, partners]);

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/security-partners');
      if (response.ok) {
        const data = await response.json();
        setPartners(data.partners || []);
        setFilteredPartners(data.partners || []);
      }
    } catch (error) {
      console.error('Failed to fetch partners:', error);
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

  const categories = ['all', ...Array.from(new Set(partners?.map((p) => p?.category) ?? []))];

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
            <h1 className="text-3xl font-bold mb-2">Security Partners</h1>
            <p className="text-muted-foreground">
              Recommended third-party security solutions to enhance your protection
            </p>
          </div>

          <div className="flex items-center space-x-2 mb-8 overflow-x-auto pb-2">
            <Filter className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners?.map((partner, index) => (
              <motion.div
                key={partner?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl shadow-md p-6 border hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">{partner?.name ?? 'Unknown Partner'}</h3>
                    <p className="text-sm text-muted-foreground">{partner?.category ?? 'Unknown Category'}</p>
                  </div>
                  {partner?.rating && (
                    <div className="flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900/20 px-2 py-1 rounded">
                      <Star className="h-4 w-4 text-yellow-600 fill-yellow-600" />
                      <span className="text-sm font-medium text-yellow-600">{partner.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  {partner?.description ?? 'No description available'}
                </p>

                <div className="mb-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">KEY FEATURES:</p>
                  <div className="flex flex-wrap gap-1">
                    {partner?.features?.slice(0, 3)?.map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {partner?.pricing && (
                  <p className="text-sm font-medium text-green-600 mb-4">{partner.pricing}</p>
                )}

                {partner?.website && (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all"
                  >
                    <span>Learn More</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>

          {filteredPartners?.length === 0 && (
            <div className="bg-card rounded-xl shadow-md p-12 border text-center">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Partners Found</h3>
              <p className="text-muted-foreground">
                No security partners match your current filter.
              </p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

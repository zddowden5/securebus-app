'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import {
  Monitor,
  Plus,
  Laptop,
  Server,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Search,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Device {
  id: string;
  name: string;
  type: string;
  os?: string;
  status: string;
  lastScan?: string;
  location?: string;
}

const getDeviceIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'laptop':
      return Laptop;
    case 'server':
      return Server;
    case 'smartphone':
    case 'mobile':
      return Smartphone;
    default:
      return Monitor;
  }
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    case 'warning':
      return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    case 'inactive':
      return 'text-red-600 bg-red-100 dark:bg-red-900/20';
    default:
      return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
  }
};

const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return CheckCircle;
    case 'warning':
      return AlertTriangle;
    case 'inactive':
      return XCircle;
    default:
      return CheckCircle;
  }
};

export default function DevicesPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
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

  useEffect(() => {
    let filtered = devices ?? [];

    if (searchQuery) {
      filtered = filtered.filter((device) =>
        device?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((device) => device?.status?.toLowerCase() === filterStatus?.toLowerCase());
    }

    setFilteredDevices(filtered);
  }, [searchQuery, filterStatus, devices]);

  const fetchDevices = async () => {
    try {
      const response = await fetch('/api/devices');
      if (response.ok) {
        const data = await response.json();
        setDevices(data.devices || []);
        setFilteredDevices(data.devices || []);
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

  const statusCounts = {
    all: devices?.length ?? 0,
    active: devices?.filter((d) => d?.status === 'active')?.length ?? 0,
    warning: devices?.filter((d) => d?.status === 'warning')?.length ?? 0,
    inactive: devices?.filter((d) => d?.status === 'inactive')?.length ?? 0,
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Device Management</h1>
              <p className="text-muted-foreground">
                Monitor and manage all your connected devices
              </p>
            </div>
            <Link
              href="/devices/add"
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all shadow-md"
            >
              <Plus className="h-5 w-5" />
              <span>Add Device</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Object.entries(statusCounts).map(([status, count], index) => (
              <motion.button
                key={status}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setFilterStatus(status)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  filterStatus === status
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                }`}
              >
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm text-muted-foreground capitalize">{status}</p>
              </motion.button>
            ))}
          </div>

          <div className="bg-card rounded-xl shadow-md p-6 border mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search devices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {filteredDevices?.length === 0 ? (
            <div className="bg-card rounded-xl shadow-md p-12 border text-center">
              <Monitor className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No devices found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || filterStatus !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Get started by adding your first device'}
              </p>
              {!searchQuery && filterStatus === 'all' && (
                <Link
                  href="/devices/add"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Your First Device</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDevices.map((device, index) => {
                const DeviceIcon = getDeviceIcon(device?.type ?? '');
                const StatusIcon = getStatusIcon(device?.status ?? '');
                const statusColor = getStatusColor(device?.status ?? '');

                return (
                  <motion.div
                    key={device?.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/devices/${device?.id}`}>
                      <div className="bg-card rounded-xl shadow-md p-6 border hover:shadow-lg transition-all cursor-pointer group">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 group-hover:scale-110 transition-transform">
                            <DeviceIcon className="h-6 w-6 text-white" />
                          </div>
                          <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                            <StatusIcon className="h-3 w-3" />
                            <span className="capitalize">{device?.status ?? 'Unknown'}</span>
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-1 group-hover:text-blue-600 transition-colors">
                          {device?.name ?? 'Unnamed Device'}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {device?.os ?? device?.type ?? 'Unknown'}
                        </p>
                        {device?.location && (
                          <p className="text-xs text-muted-foreground mb-2">
                            📍 {device.location}
                          </p>
                        )}
                        {device?.lastScan && (
                          <p className="text-xs text-muted-foreground">
                            Last scan: {new Date(device.lastScan).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

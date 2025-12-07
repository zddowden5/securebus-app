'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import {
  Monitor,
  Save,
  ArrowLeft,
  Trash2,
  Edit,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Activity,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Device {
  id: string;
  name: string;
  type: string;
  os?: string;
  status: string;
  lastScan?: string;
  ipAddress?: string;
  macAddress?: string;
  location?: string;
  notes?: string;
  createdAt: string;
}

export default function DeviceDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    os: '',
    ipAddress: '',
    macAddress: '',
    location: '',
    notes: '',
    status: '',
  });

  useEffect(() => {
    fetchDevice();
  }, [params.id]);

  const fetchDevice = async () => {
    try {
      const response = await fetch(`/api/devices/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setDevice(data.device);
        setFormData({
          name: data.device?.name ?? '',
          type: data.device?.type ?? '',
          os: data.device?.os ?? '',
          ipAddress: data.device?.ipAddress ?? '',
          macAddress: data.device?.macAddress ?? '',
          location: data.device?.location ?? '',
          notes: data.device?.notes ?? '',
          status: data.device?.status ?? '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch device:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/devices/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setDevice(data.device);
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating device:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this device?')) return;

    try {
      const response = await fetch(`/api/devices/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/devices');
      }
    } catch (error) {
      console.error('Error deleting device:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Device Not Found</h2>
          <Link href="/devices" className="text-blue-600 hover:text-blue-500">
            Back to Devices
          </Link>
        </div>
      </div>
    );
  }

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

  const StatusIcon = getStatusIcon(device?.status ?? '');
  const statusColor = getStatusColor(device?.status ?? '');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/devices"
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Devices</span>
          </Link>

          <div className="bg-card rounded-xl shadow-md border overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-white/20">
                    <Monitor className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{device?.name ?? 'Unnamed Device'}</h1>
                    <p className="text-blue-100">{device?.type ?? 'Unknown Type'}</p>
                  </div>
                </div>
                <span className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${statusColor}`}>
                  <StatusIcon className="h-4 w-4" />
                  <span className="capitalize">{device?.status ?? 'Unknown'}</span>
                </span>
              </div>
            </div>

            <div className="p-6">
              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Device Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Device Type *</label>
                      <select
                        name="type"
                        required
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="">Select type</option>
                        <option value="Desktop">Desktop</option>
                        <option value="Laptop">Laptop</option>
                        <option value="Server">Server</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Tablet">Tablet</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="active">Active</option>
                        <option value="warning">Warning</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Operating System</label>
                      <input
                        type="text"
                        name="os"
                        value={formData.os}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">IP Address</label>
                      <input
                        type="text"
                        name="ipAddress"
                        value={formData.ipAddress}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">MAC Address</label>
                      <input
                        type="text"
                        name="macAddress"
                        value={formData.macAddress}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Notes</label>
                    <textarea
                      name="notes"
                      rows={4}
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          name: device?.name ?? '',
                          type: device?.type ?? '',
                          os: device?.os ?? '',
                          ipAddress: device?.ipAddress ?? '',
                          macAddress: device?.macAddress ?? '',
                          location: device?.location ?? '',
                          notes: device?.notes ?? '',
                          status: device?.status ?? '',
                        });
                      }}
                      className="px-6 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Operating System</p>
                      <p className="font-medium">{device?.os ?? 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Location</p>
                      <p className="font-medium">{device?.location ?? 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">IP Address</p>
                      <p className="font-medium font-mono text-sm">
                        {device?.ipAddress ?? 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">MAC Address</p>
                      <p className="font-medium font-mono text-sm">
                        {device?.macAddress ?? 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Last Scan</p>
                      <p className="font-medium">
                        {device?.lastScan
                          ? new Date(device.lastScan).toLocaleString()
                          : 'Never'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Added</p>
                      <p className="font-medium">
                        {new Date(device?.createdAt ?? '').toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {device?.notes && (
                    <div className="mb-6">
                      <p className="text-sm text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm bg-muted/50 rounded-lg p-4">{device.notes}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                    <button
                      onClick={handleDelete}
                      className="flex items-center space-x-2 px-6 py-2 rounded-lg border-2 border-red-200 text-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Device</span>
                    </button>
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit Device</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-md p-6 border">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold">Activity Log</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Device scan completed</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Security update installed</p>
                  <p className="text-sm text-muted-foreground">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Device registered</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(device?.createdAt ?? '').toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

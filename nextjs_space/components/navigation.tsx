'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import {
  LayoutDashboard,
  Monitor,
  Mail,
  Shield,
  Users,
  Key,
  HelpCircle,
  Settings,
  Moon,
  Sun,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/devices', icon: Monitor, label: 'Devices' },
  { href: '/phishing', icon: Mail, label: 'Phishing' },
  { href: '/response-plan', icon: Shield, label: 'Response Plans' },
  { href: '/security-partners', icon: Users, label: 'Partners' },
  { href: '/password-tips', icon: Key, label: 'Password Tips' },
  { href: '/help', icon: HelpCircle, label: 'Help' },
];

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession() || {};
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!session) return null;

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-cyan-500" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  SecureBus
                </span>
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center space-x-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              <Link
                href="/profile"
                className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <Settings className="h-5 w-5" />
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center space-x-2 rounded-md px-3 py-2 text-base font-medium',
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="flex items-center space-x-2 px-3 py-2">
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="flex items-center space-x-2 text-muted-foreground"
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  <span>Toggle Theme</span>
                </button>
              </div>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="flex w-full items-center space-x-2 rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

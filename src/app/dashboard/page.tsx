'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Mail, Settings, LogOut, ChevronRight,
  Gauge, Clock, CheckCircle, AlertCircle,
  Send, Link2, Unlink, History
} from 'lucide-react';

interface UserData {
  email: string;
  telegramChatId: number;
  subscriptionStatus: 'free' | 'pro' | 'enterprise';
  emailQuota: {
    limit: number;
    used: number;
    resetAt: Date;
  };
  createdAt: Date;
}

interface Integration {
  provider: string;
  email: string;
  isActive: boolean;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const telegramId = searchParams.get('tid');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>([]);

  useEffect(() => {
    if (telegramId) {
      fetchUserData(telegramId);
    } else {
      setLoading(false);
    }
  }, [telegramId]);

  const fetchUserData = async (tid: string) => {
    try {
      const res = await fetch(`/api/user?tid=${tid}`);
      if (res.ok) {
        const data = await res.json();
        setUserData(data.user);
        setIntegrations(data.integrations || []);
      } else {
        setError('User not found');
      }
    } catch (err) {
      setError('Failed to load data');
    }
    setLoading(false);
  };

  // No Telegram ID - show instructions
  if (!telegramId) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Access Your Dashboard</h1>
            <p className="text-slate-400 mb-6">
              To view your dashboard, use the <code className="bg-slate-800 px-2 py-1 rounded">/dashboard</code> command in the MailSync Telegram bot.
            </p>
            <a
              href="https://t.me/Maisync_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              <Send className="w-4 h-4" />
              Open MailSync Bot
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">User Not Found</h1>
          <p className="text-slate-400">{error || 'Please connect your Gmail first using /connect command'}</p>
        </div>
      </div>
    );
  }

  const quotaPercentage = (userData.emailQuota.used / userData.emailQuota.limit) * 100;
  const resetDate = new Date(userData.emailQuota.resetAt);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">MailSync</span>
          </Link>
          <a
            href="https://t.me/Maisync_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <Send className="w-4 h-4" />
            Back to Bot
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back! </h1>
          <p className="text-slate-400">{userData.email}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Subscription Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Your Plan</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                userData.subscriptionStatus === 'pro' 
                  ? 'bg-violet-500/20 text-violet-400'
                  : userData.subscriptionStatus === 'enterprise'
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-slate-700 text-slate-300'
              }`}>
                {userData.subscriptionStatus.charAt(0).toUpperCase() + userData.subscriptionStatus.slice(1)}
              </span>
            </div>
            
            {userData.subscriptionStatus === 'free' && (
              <a
                href="#pricing"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-500/10 to-violet-600/10 border border-cyan-500/20 rounded-xl hover:border-cyan-500/40 transition-colors"
              >
                <div>
                  <p className="text-white font-medium">Upgrade to Pro</p>
                  <p className="text-slate-400 text-sm">Get 1,000 emails/month</p>
                </div>
                <ChevronRight className="w-5 h-5 text-cyan-400" />
              </a>
            )}
          </motion.div>

          {/* Quota Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Email Quota</h2>
              <Gauge className="w-5 h-5 text-slate-400" />
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">{userData.emailQuota.used} used</span>
                <span className="text-slate-400">{userData.emailQuota.limit} limit</span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    quotaPercentage >= 90 ? 'bg-red-500' : 
                    quotaPercentage >= 70 ? 'bg-amber-500' : 
                    'bg-gradient-to-r from-cyan-500 to-violet-600'
                  }`}
                  style={{ width: `${Math.min(quotaPercentage, 100)}%` }}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Clock className="w-4 h-4" />
              <span>Resets {resetDate.toLocaleDateString()}</span>
            </div>
          </motion.div>
        </div>

        {/* Connected Accounts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Connected Accounts</h2>
          
          {integrations.length === 0 ? (
            <div className="text-center py-8">
              <Link2 className="w-8 h-8 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400">No accounts connected</p>
            </div>
          ) : (
            <div className="space-y-3">
              {integrations.map((integration, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{integration.email}</p>
                      <p className="text-slate-400 text-sm">Gmail</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {integration.isActive ? (
                      <span className="flex items-center gap-1 text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <ActionButton icon={History} label="View History" href="https://t.me/Maisync_bot" />
          <ActionButton icon={Settings} label="Settings" href="https://t.me/Maisync_bot" />
          <ActionButton icon={Link2} label="Add Account" href="https://t.me/Maisync_bot" />
          <ActionButton icon={Unlink} label="Disconnect" href="https://t.me/Maisync_bot" />
        </motion.div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

function ActionButton({ icon: Icon, label, href }: { icon: typeof Mail; label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-2 p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors"
    >
      <Icon className="w-5 h-5 text-slate-400" />
      <span className="text-sm text-slate-300">{label}</span>
    </a>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Mail, TrendingUp, Shield, 
  Search, RefreshCw, Ban, CheckCircle,
  LogOut, Eye, MoreVertical
} from 'lucide-react';

// Simple password protection - in production use proper auth
const ADMIN_PASSWORD = 'mailsync2026'; // Change this!

interface User {
  id: string;
  email: string;
  telegramChatId: number;
  subscriptionStatus: 'free' | 'pro' | 'enterprise';
  createdAt: Date;
  emailQuota: {
    limit: number;
    used: number;
    resetAt: Date;
  };
}

interface Stats {
  totalUsers: number;
  activeToday: number;
  emailsProcessed: number;
  proUsers: number;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeToday: 0,
    emailsProcessed: 0,
    proUsers: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      fetchData();
    } else {
      setError('Invalid password');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch from API route
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
    setLoading(false);
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.telegramChatId?.toString().includes(searchQuery)
  );

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Access</h1>
                <p className="text-slate-400 text-sm">MailSync Dashboard</p>
              </div>
            </div>

            <form onSubmit={handleLogin}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 mb-4"
              />
              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">MailSync Admin</span>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats.totalUsers}
            color="cyan"
          />
          <StatCard
            icon={TrendingUp}
            label="Active Today"
            value={stats.activeToday}
            color="green"
          />
          <StatCard
            icon={Mail}
            label="Emails Processed"
            value={stats.emailsProcessed}
            color="violet"
          />
          <StatCard
            icon={CheckCircle}
            label="Pro Users"
            value={stats.proUsers}
            color="amber"
          />
        </div>

        {/* Users Table */}
        <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Users</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-64"
                />
              </div>
              <button
                onClick={fetchData}
                disabled={loading}
                className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Email</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Telegram ID</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Plan</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Quota</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Joined</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      {loading ? 'Loading...' : 'No users found'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="px-6 py-4 text-white">{user.email}</td>
                      <td className="px-6 py-4 text-slate-400">{user.telegramChatId}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.subscriptionStatus === 'pro' 
                            ? 'bg-violet-500/20 text-violet-400'
                            : user.subscriptionStatus === 'enterprise'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-slate-700 text-slate-300'
                        }`}>
                          {user.subscriptionStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {user.emailQuota?.used || 0} / {user.emailQuota?.limit || 50}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <button className="p-2 text-slate-400 hover:text-white transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: typeof Users;
  label: string;
  value: number;
  color: 'cyan' | 'green' | 'violet' | 'amber';
}) {
  const colors = {
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400',
    green: 'from-green-500/20 to-green-500/5 border-green-500/20 text-green-400',
    violet: 'from-violet-500/20 to-violet-500/5 border-violet-500/20 text-violet-400',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl bg-gradient-to-br ${colors[color]} border backdrop-blur-xl`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${colors[color].split(' ').pop()}`} />
        </div>
        <div>
          <p className="text-slate-400 text-sm">{label}</p>
          <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
        </div>
      </div>
    </motion.div>
  );
}

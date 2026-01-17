'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Mail, MessageSquare } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-violet-600/20 via-transparent to-transparent blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-cyan-500/20 via-transparent to-transparent blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 backdrop-blur-sm mb-6"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">AI-Powered Email Management</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            <span className="bg-clip-text text-transparent bg-glow-gradient animate-glow">
              Your Inbox,
            </span>
            <br />
            <span className="text-white">on Autopilot</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl text-slate-400 mb-8 leading-relaxed"
          >
            MailSync reads your Gmail, summarizes emails with AI, and delivers them to Telegram.
            Reply instantly without opening your inbox.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-xl font-semibold text-white shadow-lg shadow-violet-500/50 hover:shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105">
              <span className="flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            <button className="px-8 py-4 rounded-xl font-semibold text-white border border-slate-700 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300">
              Watch Demo
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-12 grid grid-cols-3 gap-8"
          >
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '500K+', label: 'Emails Processed' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: Animated Phone Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="relative flex justify-center"
        >
          {/* Floating Phone */}
          <motion.div
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-violet-600/30 blur-3xl rounded-full" />

            {/* Phone Frame */}
            <div className="relative w-[300px] h-[600px] bg-slate-900 rounded-[3rem] border-8 border-slate-800 shadow-2xl overflow-hidden">
              {/* Screen Content */}
              <div className="h-full bg-slate-950 p-6 flex flex-col gap-4">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl" />

                {/* Telegram Message Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="mt-8 space-y-3"
                >
                  {/* Message 1 */}
                  <div className="bg-gradient-to-br from-violet-500/10 to-cyan-500/10 backdrop-blur-xl border border-violet-500/20 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-cyan-400 font-semibold mb-1">
                          john@company.com
                        </div>
                        <div className="text-sm text-slate-300 mb-2">
                           Meeting rescheduled to 3 PM tomorrow. Agenda attached.
                        </div>
                        <button className="text-xs bg-violet-500/20 px-3 py-1 rounded-lg text-violet-300 hover:bg-violet-500/30 transition-colors">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Message 2 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.6 }}
                    className="bg-gradient-to-br from-cyan-500/10 to-violet-500/10 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-violet-400 font-semibold mb-1">
                          support@service.com
                        </div>
                        <div className="text-sm text-slate-300 mb-2">
                           Your subscription has been renewed. Invoice #12345.
                        </div>
                        <button className="text-xs bg-cyan-500/20 px-3 py-1 rounded-lg text-cyan-300 hover:bg-cyan-500/30 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Floating Icons */}
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-20 -left-10 w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl shadow-lg shadow-cyan-500/50 flex items-center justify-center"
          >
            <Mail className="w-8 h-8 text-white" />
          </motion.div>

          <motion.div
            animate={{
              y: [0, 15, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-32 -right-10 w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl shadow-lg shadow-violet-500/50 flex items-center justify-center"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

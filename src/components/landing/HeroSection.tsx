'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Mail, MessageSquare, Send } from 'lucide-react';

const TELEGRAM_BOT_URL = 'https://t.me/Maisync_bot';

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
            <a 
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-xl font-semibold text-white shadow-lg shadow-violet-500/50 hover:shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Open in Telegram
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>

            <a 
              href="#features"
              className="px-8 py-4 rounded-xl font-semibold text-white border border-slate-700 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300"
            >
              Learn More
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-12 grid grid-cols-3 gap-8"
          >
            {[
              { label: 'Active Users', value: '10K+' },
              { label: 'Emails Processed', value: '1M+' },
              { label: 'Time Saved', value: '500h+' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: Visual Demo */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative"
        >
          <div className="relative">
            {/* Floating Cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-8 -left-8 bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">New Email</div>
                  <div className="text-xs text-slate-400">Meeting at 3pm...</div>
                </div>
              </div>
            </motion.div>

            {/* Main Chat Preview */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white">MailSync Bot</div>
                  <div className="text-sm text-green-400">Online</div>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-2xl rounded-tl-sm p-4 max-w-[80%]">
                  <p className="text-sm text-slate-200">
                     <strong>New email from John</strong><br/>
                    Subject: Q4 Report Ready<br/><br/>
                     Summary: John has completed the Q4 report and needs your approval by Friday.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-cyan-500/20 to-violet-600/20 border border-cyan-500/30 rounded-2xl rounded-tr-sm p-4 max-w-[80%] ml-auto">
                  <p className="text-sm text-white">Reply: "Looks great, approved! "</p>
                </div>

                <div className="bg-slate-700/50 rounded-2xl rounded-tl-sm p-4 max-w-[80%]">
                  <p className="text-sm text-slate-200">
                     Reply sent successfully!
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -bottom-6 -right-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-xl rounded-2xl p-4 shadow-2xl"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-green-400 font-medium">AI Processing...</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

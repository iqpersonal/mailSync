'use client';

import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="relative backdrop-blur-xl bg-slate-900/80 border border-slate-800 rounded-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">MailSync</span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#docs" className="text-slate-300 hover:text-white transition-colors">
                Docs
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4">
              <button className="hidden sm:block px-6 py-2 text-white hover:text-cyan-400 transition-colors">
                Sign In
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Menu, X } from 'lucide-react';

const TELEGRAM_BOT_URL = 'https://t.me/Maisync_bot';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">MailSync</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">
                Pricing
              </a>
              <Link href="/privacy" className="text-slate-300 hover:text-white transition-colors">
                Privacy
              </Link>
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <a 
                href={TELEGRAM_BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 text-white hover:text-cyan-400 transition-colors"
              >
                Open in Telegram
              </a>
              <a 
                href={TELEGRAM_BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
              >
                Get Started
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden"
              >
                <div className="pt-6 pb-2 border-t border-slate-700 mt-4 flex flex-col gap-4">
                  <a 
                    href="#features" 
                    onClick={() => setIsOpen(false)}
                    className="text-slate-300 hover:text-white transition-colors py-2"
                  >
                    Features
                  </a>
                  <a 
                    href="#pricing" 
                    onClick={() => setIsOpen(false)}
                    className="text-slate-300 hover:text-white transition-colors py-2"
                  >
                    Pricing
                  </a>
                  <Link 
                    href="/privacy" 
                    onClick={() => setIsOpen(false)}
                    className="text-slate-300 hover:text-white transition-colors py-2"
                  >
                    Privacy
                  </Link>
                  <Link 
                    href="/terms" 
                    onClick={() => setIsOpen(false)}
                    className="text-slate-300 hover:text-white transition-colors py-2"
                  >
                    Terms
                  </Link>
                  <a 
                    href={TELEGRAM_BOT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-xl font-semibold text-white text-center hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                  >
                    Get Started
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
}

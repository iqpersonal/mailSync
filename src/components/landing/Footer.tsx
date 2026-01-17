import Link from 'next/link';
import { Mail, Send, Github, Twitter } from 'lucide-react';

const TELEGRAM_BOT_URL = 'https://t.me/Maisync_bot';

export default function Footer() {
  return (
    <footer className="relative bg-slate-950 border-t border-slate-800">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">MailSync</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-md">
              AI-powered email management delivered to Telegram. Get instant summaries, 
              reply on the go, and never miss important messages.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href={TELEGRAM_BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <Send className="w-5 h-5 text-slate-300" />
              </a>
              <a 
                href="https://github.com/iqpersonal/mailSync"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <Github className="w-5 h-5 text-slate-300" />
              </a>
              <a 
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5 text-slate-300" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-slate-400 hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-slate-400 hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                  Open Bot
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="mailto:info@ezy4me.com" className="text-slate-400 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
             2026 MailSync. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm">
            Made with  for productivity
          </p>
        </div>
      </div>
    </footer>
  );
}

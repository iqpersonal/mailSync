import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-xl bg-slate-900/80 border border-slate-800 rounded-2xl px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">MailSync</span>
              </Link>
              <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12">
            <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
            <p className="text-slate-400 mb-8">Last updated: January 17, 2026</p>
            
            <div className="space-y-8 text-slate-300">
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">1. Information We Collect</h2>
                <p className="mb-3">MailSync Bot collects the following information:</p>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li>Your Telegram user ID and chat ID</li>
                  <li>Your Gmail email address</li>
                  <li>Email metadata (sender, subject, date) for processing summaries</li>
                  <li>OAuth tokens to access your Gmail account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
                <p className="mb-3">We use your information to:</p>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li>Send you AI-generated summaries of your emails via Telegram</li>
                  <li>Process and categorize your incoming emails</li>
                  <li>Enable email reply functionality through the bot</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">3. Data Storage & Security</h2>
                <p className="text-slate-400">
                  Your OAuth tokens are stored securely in Firebase Firestore with encryption. 
                  We do not store the full content of your emails - only metadata needed for summaries.
                  Email content is processed in real-time and not permanently stored.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">4. Third-Party Services</h2>
                <p className="mb-3">We use the following third-party services:</p>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li>Google Gmail API - to access your emails</li>
                  <li>OpenAI API - to generate email summaries</li>
                  <li>Telegram Bot API - to send you notifications</li>
                  <li>Firebase/Google Cloud - for data storage and hosting</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">5. Data Deletion</h2>
                <p className="text-slate-400">
                  You can disconnect your Gmail account at any time using the /disconnect command in the bot.
                  This will revoke our access to your Gmail and delete your stored tokens.
                  To request complete data deletion, contact us at <a href="mailto:info@ezy4me.com" className="text-cyan-400 hover:underline">info@ezy4me.com</a>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">6. Your Rights</h2>
                <p className="mb-3">You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li>Access your personal data</li>
                  <li>Request deletion of your data</li>
                  <li>Revoke Gmail access at any time</li>
                  <li>Opt out of the service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">7. Contact</h2>
                <p className="text-slate-400">
                  For questions about this privacy policy, contact us at: <a href="mailto:info@ezy4me.com" className="text-cyan-400 hover:underline">info@ezy4me.com</a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">MailSync</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <a href="https://t.me/Maisync_bot" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Telegram</a>
          </div>
          <p className="text-sm text-slate-500"> 2026 MailSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

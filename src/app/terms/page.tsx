import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
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
            <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
            <p className="text-slate-400 mb-8">Last updated: January 17, 2026</p>
            
            <div className="space-y-8 text-slate-300">
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                <p className="text-slate-400">
                  By using the MailSync Bot, you agree to these terms. If you do not agree, please do not use our service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">2. Service Description</h2>
                <p className="text-slate-400">
                  MailSync Bot is a Telegram bot that connects to your Gmail account to provide AI-generated 
                  summaries of your emails and enable quick replies through the Telegram interface.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">3. User Responsibilities</h2>
                <p className="mb-3">You agree to:</p>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li>Provide accurate information when connecting your accounts</li>
                  <li>Keep your Telegram account secure</li>
                  <li>Not use the service for spam or malicious purposes</li>
                  <li>Comply with Gmail's terms of service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">4. Gmail Access</h2>
                <p className="text-slate-400">
                  By connecting your Gmail account, you authorize us to access your emails for the purpose 
                  of generating summaries and sending replies on your behalf. You can revoke this access at any time.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">5. Limitations</h2>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li>AI-generated summaries may not be 100% accurate</li>
                  <li>Service may experience downtime for maintenance</li>
                  <li>Free tier users have limited daily email processing quota</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">6. Disclaimer</h2>
                <p className="text-slate-400">
                  The service is provided "as is" without warranties. We are not responsible for any 
                  missed emails, incorrect summaries, or actions taken based on AI-generated content.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">7. Termination</h2>
                <p className="text-slate-400">
                  We reserve the right to terminate accounts that violate these terms or abuse the service.
                  You may disconnect your account at any time using the /disconnect command.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">8. Changes to Terms</h2>
                <p className="text-slate-400">
                  We may update these terms. Continued use of the service after changes constitutes acceptance.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">9. Contact</h2>
                <p className="text-slate-400">
                  For questions about these terms, contact us at: <a href="mailto:info@ezy4me.com" className="text-cyan-400 hover:underline">info@ezy4me.com</a>
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

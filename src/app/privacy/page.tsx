export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-400 mb-4">Last updated: January 17, 2026</p>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
        <p className="text-gray-300 mb-2">MailSync Bot collects the following information:</p>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>Your Telegram user ID and chat ID</li>
          <li>Your Gmail email address</li>
          <li>Email metadata (sender, subject, date) for processing summaries</li>
          <li>OAuth tokens to access your Gmail account</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
        <p className="text-gray-300">We use your information to:</p>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>Send you AI-generated summaries of your emails via Telegram</li>
          <li>Process and categorize your incoming emails</li>
          <li>Enable email reply functionality through the bot</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. Data Storage & Security</h2>
        <p className="text-gray-300">
          Your OAuth tokens are stored securely in Firebase Firestore with encryption. 
          We do not store the full content of your emails - only metadata needed for summaries.
          Email content is processed in real-time and not permanently stored.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. Third-Party Services</h2>
        <p className="text-gray-300">We use the following third-party services:</p>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>Google Gmail API - to access your emails</li>
          <li>OpenAI API - to generate email summaries</li>
          <li>Telegram Bot API - to send you notifications</li>
          <li>Firebase/Google Cloud - for data storage and hosting</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Data Deletion</h2>
        <p className="text-gray-300">
          You can disconnect your Gmail account at any time using the /disconnect command in the bot.
          This will revoke our access to your Gmail and delete your stored tokens.
          To request complete data deletion, contact us at info@ezy4me.com.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
        <p className="text-gray-300">You have the right to:</p>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>Access your personal data</li>
          <li>Request deletion of your data</li>
          <li>Revoke Gmail access at any time</li>
          <li>Opt out of the service</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">7. Contact</h2>
        <p className="text-gray-300">
          For questions about this privacy policy, contact us at: info@ezy4me.com
        </p>
      </section>
    </div>
  );
}

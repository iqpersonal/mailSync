# MailSync - AI-Powered Email Management SaaS

MailSync reads your Gmail, uses AI to summarize emails, and sends them to Telegram where you can reply instantly.

## Tech Stack

**Backend:**
- Firebase Cloud Functions (2nd Gen)
- Firestore Database
- Node.js + TypeScript

**Frontend:**
- Next.js 14 (App Router)
- Tailwind CSS
- Framer Motion

**Integrations:**
- OpenAI API (GPT-4o-mini)
- Gmail API (googleapis)
- Telegram Bot API (Telegraf)

---

## Project Structure

```
mail/
 functions/              # Firebase Cloud Functions
    src/
       index.ts       # Main entry point
       bot/           # Telegram bot logic
       services/      # Gmail, OpenAI, Firestore
       config/        # Configuration
       types/         # TypeScript interfaces
    package.json

 src/                   # Next.js Frontend
    app/              # App Router pages
    components/       # React components
    lib/              # Utilities

 package.json          # Frontend dependencies
```

---

## Setup Instructions

### 1. Prerequisites

- Node.js 18+
- Firebase CLI (`npm install -g firebase-tools`)
- Telegram Bot Token (from @BotFather)
- OpenAI API Key
- Google Cloud Project with Gmail API enabled

### 2. Backend Setup (Firebase Functions)

```bash
# Navigate to functions directory
cd functions

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
TELEGRAM_BOT_TOKEN=your_bot_token
OPENAI_API_KEY=sk-your_key
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_secret
GOOGLE_REDIRECT_URI=https://your-project.cloudfunctions.net/gmailAuth/callback
FRONTEND_URL=http://localhost:3000
```

### 3. Initialize Firebase

```bash
# Login to Firebase
firebase login

# Initialize Firebase (select Functions and Firestore)
firebase init

# Deploy functions
firebase deploy --only functions
```

### 4. Set Telegram Webhook

After deploying, set the Telegram webhook:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://your-project.cloudfunctions.net/telegramWebhook"
```

### 5. Frontend Setup

```bash
# Return to root directory
cd ..

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

### Backend (functions/.env)
- `TELEGRAM_BOT_TOKEN` - From @BotFather
- `OPENAI_API_KEY` - From OpenAI dashboard
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- `GOOGLE_REDIRECT_URI` - Your OAuth callback URL
- `FRONTEND_URL` - Your Next.js app URL

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://your-project.cloudfunctions.net
```

---

## Firestore Database Schema

### Collections:

**users/**
- `uid`: string
- `email`: string
- `telegramChatId`: number
- `subscriptionStatus`: 'free' | 'pro' | 'enterprise'
- `emailQuota`: { limit, used, resetAt }

**integrations/**
- `userId`: string
- `provider`: 'google'
- `accessToken`: string
- `refreshToken`: string
- `expiryDate`: number

**threads/**
- `threadId`: string
- `userId`: string
- `subject`: string
- `aiSummary`: string
- `status`: 'DRAFT' | 'SENT' | 'PENDING'

**usageLogs/**
- `userId`: string
- `month`: '2026-01'
- `emailsProcessed`: number
- `summariesSent`: number

---

## Telegram Bot Commands

- `/start` - Welcome message
- `/connect` - Link Gmail account
- `/status` - Check connection status
- `/help` - Show help

---

## Development

### Backend (Functions)
```bash
cd functions
npm run build       # Compile TypeScript
npm run serve       # Run local emulator
npm run deploy      # Deploy to Firebase
```

### Frontend (Next.js)
```bash
npm run dev         # Development server
npm run build       # Production build
npm run start       # Production server
```

---

## Features

 AI-powered email summaries
 Telegram bot integration
 Gmail OAuth authentication
 Real-time email notifications
 Reply to emails from Telegram
 Glassmorphic futuristic UI
 Framer Motion animations
 Responsive design

---

## Next Steps

1. Configure Firebase Firestore security rules
2. Set up Gmail Push Notifications (Pub/Sub)
3. Implement email reply functionality
4. Add user dashboard
5. Integrate payment processing (Stripe)
6. Add analytics and monitoring

---

## License

MIT

---

## Support

For issues and questions, visit: https://github.com/yourusername/mailsync

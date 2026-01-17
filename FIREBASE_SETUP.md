# Firebase Setup Complete! 

Your Firebase project **atscv-673b8** has been integrated into MailSync.

##  Files Created/Updated

1. **src/lib/firebase.ts** - Firebase client SDK for Next.js
2. **.firebaserc** - Firebase project configuration
3. **firebase.json** - Firebase services config (Functions + Firestore)
4. **firestore.rules** - Security rules for database
5. **firestore.indexes.json** - Database indexes
6. **functions/.env.example** - Updated with your project URLs
7. **.env.example** - Updated with your Firebase config
8. **package.json** - Added Firebase SDK dependency

---

##  Quick Deploy Steps

### 1. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd functions
npm install
cd ..
```

### 2. Create Environment Files

**Backend (.env):**
```bash
cd functions
cp .env.example .env
```

Edit `functions/.env` and add:
- Your Telegram Bot Token (get from @BotFather)
- Your OpenAI API Key
- Your Google OAuth credentials

**Frontend (.env.local):**
```bash
# In root directory
cp .env.example .env.local
```

### 3. Deploy to Firebase

```bash
# Login (if not already)
firebase login

# Deploy Firestore rules and functions
firebase deploy
```

Your functions will be deployed to:
- `https://us-central1-atscv-673b8.cloudfunctions.net/telegramWebhook`
- `https://us-central1-atscv-673b8.cloudfunctions.net/gmailAuth`

### 4. Set Telegram Webhook

After deploying functions, run:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://us-central1-atscv-673b8.cloudfunctions.net/telegramWebhook"
```

### 5. Configure Google OAuth

In Google Cloud Console (console.cloud.google.com):

1. Select project: **atscv-673b8**
2. Enable **Gmail API**
3. Create OAuth 2.0 credentials
4. Add authorized redirect URI:
   ```
   https://us-central1-atscv-673b8.cloudfunctions.net/gmailAuth/callback
   ```
5. Copy Client ID and Secret to `functions/.env`

---

##  Local Development

### Run Frontend:
```bash
npm run dev
```
Open: http://localhost:3000

### Test Functions Locally:
```bash
cd functions
npm run serve
```
Functions will run on: http://localhost:5001

---

##  Firestore Security Rules

Your database is protected with these rules:
-  Users can only access their own data
-  Integrations are user-scoped
-  Threads are user-scoped
-  Usage logs are read-only (only Cloud Functions can write)

---

##  Firebase Console Links

- **Console**: https://console.firebase.google.com/project/atscv-673b8
- **Functions**: https://console.firebase.google.com/project/atscv-673b8/functions
- **Firestore**: https://console.firebase.google.com/project/atscv-673b8/firestore
- **Authentication**: https://console.firebase.google.com/project/atscv-673b8/authentication

---

##  Next Steps

1. **Enable Authentication Providers:**
   - Go to Firebase Console > Authentication
   - Enable Google Sign-In (for future dashboard login)

2. **Set Up Billing (Required for Cloud Functions):**
   - Functions require Blaze (pay-as-you-go) plan
   - Go to Firebase Console > Upgrade

3. **Configure CORS (if needed):**
   - Add your domain to Firebase Console > Hosting

4. **Monitor Functions:**
   ```bash
   firebase functions:log
   ```

---

##  Your Firebase Project

**Project ID:** atscv-673b8  
**Region:** us-central1  
**Functions URL:** https://us-central1-atscv-673b8.cloudfunctions.net  
**Auth Domain:** atscv-673b8.firebaseapp.com  
**Storage:** atscv-673b8.firebasestorage.app  

---

##  Ready to Deploy!

Run these commands to get started:

```bash
# Install all dependencies
npm install && cd functions && npm install && cd ..

# Deploy everything
firebase deploy

# Start local development
npm run dev
```

Your Firebase is configured and ready! 

import * as functions from 'firebase-functions';
import { bot } from './bot/index';
import './bot/handlers';
import { storeEmailContext } from './bot/handlers';
import express from 'express';
import { google } from 'googleapis';
import { config } from './config/env';
import { db } from './config/firebase';
import { getGmailClient, getHistoryChanges, getEmailById, setupGmailWatch } from './services/gmail';
import { summarizeEmail } from './services/openai';

// ========================================
// TELEGRAM BOT WEBHOOK (Cloud Function)
// ========================================
const telegramApp = express();
telegramApp.use(express.json());

telegramApp.post('/', async (req, res) => {
  try {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Telegram webhook error:', error);
    res.status(500).send('Error');
  }
});

export const telegramBot = functions
  .region('us-central1')
  .https.onRequest(telegramApp);

// ========================================
// GMAIL OAUTH FLOW (Cloud Function)
// ========================================
const oauth2Client = new google.auth.OAuth2(
  config.google.clientId,
  config.google.clientSecret,
  config.google.redirectUri
);

const gmailApp = express();

gmailApp.get('/auth', (req, res) => {
  const telegramChatId = req.query.telegram_chat_id as string;
  
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.modify',
    ],
    state: telegramChatId,
  });

  res.redirect(authUrl);
});

gmailApp.get('/callback', async (req, res) => {
  const code = req.query.code as string;
  const telegramChatId = req.query.state as string;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const profile = await gmail.users.getProfile({ userId: 'me' });
    const email = profile.data.emailAddress!;

    const userRef = db.collection('users').doc();
    await userRef.set({
      uid: userRef.id,
      email,
      telegramChatId: parseInt(telegramChatId),
      subscriptionStatus: 'free',
      createdAt: new Date(),
      updatedAt: new Date(),
      emailQuota: { limit: 50, used: 0, resetAt: new Date() },
    });

    await db.collection('integrations').add({
      userId: userRef.id,
      provider: 'google',
      email,
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token!,
      expiryDate: tokens.expiry_date!,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await bot.telegram.sendMessage(
      parseInt(telegramChatId),
      ` Gmail connected successfully!\n\nEmail: ${email}\n\nUse /watch to enable real-time notifications.`
    );

    res.send('<h1> Connected!</h1><p>You can close this window and return to Telegram.</p>');
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).send('Authentication failed');
  }
});

export const gmailAuth = functions
  .region('us-central1')
  .https.onRequest(gmailApp);

// ========================================
// GMAIL PUBSUB LISTENER (Real-time Notifications)
// ========================================
export const gmailPubSub = functions
  .region('us-central1')
  .pubsub.topic('gmail-notifications')
  .onPublish(async (message) => {
    try {
      console.log('Gmail notification received');

      const data = message.data
        ? JSON.parse(Buffer.from(message.data, 'base64').toString())
        : {};

      console.log('Notification data:', data);

      const emailAddress = data.emailAddress;
      const historyId = data.historyId;

      if (!emailAddress || !historyId) {
        console.log('Missing email address or history ID');
        return;
      }

      const integrationSnapshot = await db
        .collection('integrations')
        .where('email', '==', emailAddress)
        .where('provider', '==', 'google')
        .where('gmailWatch.active', '==', true)
        .limit(1)
        .get();

      if (integrationSnapshot.empty) {
        console.log('No active integration found for:', emailAddress);
        return;
      }

      const integrationDoc = integrationSnapshot.docs[0];
      const integration = integrationDoc.data();
      const lastHistoryId = integration.gmailWatch?.historyId;

      const gmail = await getGmailClient(
        integration.accessToken,
        integration.refreshToken
      );

      const newMessageIds = await getHistoryChanges(gmail, lastHistoryId);

      console.log(`Found ${newMessageIds.length} new messages`);

      if (newMessageIds.length === 0) {
        await integrationDoc.ref.update({
          'gmailWatch.historyId': historyId,
        });
        return;
      }

      const userSnapshot = await db
        .collection('users')
        .doc(integration.userId)
        .get();

      if (!userSnapshot.exists) {
        console.log('User not found');
        return;
      }

      const user = userSnapshot.data()!;
      const telegramChatId = user.telegramChatId;

      for (const messageId of newMessageIds) {
        try {
          const email = await getEmailById(gmail, messageId);

          const summary = await summarizeEmail(
            email.subject,
            email.snippet,
            email.from
          );

          await storeEmailContext(telegramChatId, email.id, {
            subject: email.subject,
            from: email.from,
            body: email.body || email.snippet,
          });

          const telegramMessage = 
            ` *New Email Arrived!*\n\n` +
            `*From:* ${email.from}\n` +
            `*Subject:* ${email.subject}\n\n` +
            `*AI Summary:*\n${summary}`;

          await bot.telegram.sendMessage(telegramChatId, telegramMessage, {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  { text: ' Generate Reply', callback_data: `reply_${email.id}` },
                  { text: ' Custom Reply', callback_data: `custom_${email.id}` },
                ],
              ],
            },
          });

          await db.collection('threads').add({
            threadId: email.threadId,
            userId: integration.userId,
            subject: email.subject,
            from: email.from,
            aiSummary: summary,
            status: 'notified',
            telegramMessageId: null,
            createdAt: new Date(),
          });

        } catch (error) {
          console.error('Error processing email:', messageId, error);
        }
      }

      await integrationDoc.ref.update({
        'gmailWatch.historyId': historyId,
      });

      console.log(`Processed ${newMessageIds.length} emails successfully`);
    } catch (error) {
      console.error('Gmail Pub/Sub error:', error);
    }
  });

// ========================================
// SCHEDULED WATCH RENEWAL (Every 6 days)
// ========================================
export const renewGmailWatch = functions
  .region('us-central1')
  .pubsub.schedule('every 144 hours') // Every 6 days (before 7-day expiry)
  .onRun(async () => {
    console.log('Starting Gmail watch renewal...');

    try {
      // Find all active integrations with Gmail watch
      const integrationsSnapshot = await db
        .collection('integrations')
        .where('provider', '==', 'google')
        .where('gmailWatch.active', '==', true)
        .get();

      console.log(`Found ${integrationsSnapshot.size} active watches to renew`);

      for (const doc of integrationsSnapshot.docs) {
        const integration = doc.data();

        try {
          const gmail = await getGmailClient(
            integration.accessToken,
            integration.refreshToken
          );

          const watchData = await setupGmailWatch(gmail, 'gmail-notifications');

          await doc.ref.update({
            'gmailWatch.historyId': watchData.historyId,
            'gmailWatch.expiration': watchData.expiration,
            'gmailWatch.updatedAt': new Date(),
          });

          console.log(`Renewed watch for: ${integration.email}`);
        } catch (error) {
          console.error(`Failed to renew watch for ${integration.email}:`, error);
          
          // Notify user of failure
          try {
            const userDoc = await db.collection('users').doc(integration.userId).get();
            if (userDoc.exists) {
              const user = userDoc.data()!;
              await bot.telegram.sendMessage(
                user.telegramChatId,
                ' Your email notifications may have stopped working.\n\nUse /watch to re-enable them.'
              );
            }
          } catch (e) {
            console.error('Failed to notify user:', e);
          }
        }
      }

      console.log('Gmail watch renewal completed');
    } catch (error) {
      console.error('Watch renewal error:', error);
    }

    return null;
  });
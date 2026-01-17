import { Timestamp } from 'firebase-admin/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  telegramChatId?: number;
  subscriptionStatus: 'free' | 'pro' | 'enterprise';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  emailQuota: {
    limit: number;        // 50 for free, 1000 for pro
    used: number;
    resetAt: Timestamp;
  };
}

export interface Integration {
  userId: string;
  provider: 'google';
  email: string;
  accessToken: string;
  refreshToken: string;
  expiryDate: number;       // Unix timestamp
  historyId?: string;       // Gmail history tracking
  watchExpiration?: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Thread {
  threadId: string;         // Gmail thread ID
  userId: string;
  emailId: string;          // Gmail message ID
  subject: string;
  from: {
    name: string;
    email: string;
  };
  snippet: string;          // Email preview
  aiSummary: string;        // GPT-4o-mini summary
  status: 'DRAFT' | 'SENT' | 'PENDING';
  currentDraft?: string;    // User's draft reply
  sentAt?: Timestamp;
  receivedAt: Timestamp;
  telegramMessageId?: number;
  labels: string[];         // Gmail labels
}

export interface UsageLog {
  userId: string;
  month: string;            // Format: '2026-01'
  emailsProcessed: number;
  summariesSent: number;
  repliesSent: number;
  openaiTokensUsed: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface BotSession {
  telegramChatId: number;
  userId?: string;
  state: 'idle' | 'awaiting_reply' | 'awaiting_gmail_link';
  contextThreadId?: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;
}

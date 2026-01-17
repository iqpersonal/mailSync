import { db } from '../config/firebase';

export async function getUserByTelegramId(telegramChatId: number) {
  const snapshot = await db.collection('users')
    .where('telegramChatId', '==', telegramChatId)
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  
  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
  };
}

export async function getIntegration(userId: string, provider: string) {
  const snapshot = await db.collection('integrations')
    .where('userId', '==', userId)
    .where('provider', '==', provider)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
  };
}

export async function saveThread(threadData: any) {
  return await db.collection('threads').add({
    ...threadData,
    createdAt: new Date(),
  });
}

export async function updateUsageLog(userId: string, month: string, updates: any) {
  const logRef = db.collection('usageLogs').doc(`${userId}_${month}`);
  const doc = await logRef.get();

  if (doc.exists) {
    await logRef.update({
      ...updates,
      updatedAt: new Date(),
    });
  } else {
    await logRef.set({
      userId,
      month,
      emailsProcessed: 0,
      summariesSent: 0,
      repliesSent: 0,
      openaiTokensUsed: 0,
      ...updates,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

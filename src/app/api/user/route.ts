import { NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const telegramId = searchParams.get('tid');

  if (!telegramId) {
    return NextResponse.json({ error: 'Telegram ID required' }, { status: 400 });
  }

  try {
    // Find user by telegram chat ID
    const usersSnapshot = await db.collection('users')
      .where('telegramChatId', '==', parseInt(telegramId))
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();

    // Get integrations for this user
    const integrationsSnapshot = await db.collection('integrations')
      .where('userId', '==', userDoc.id)
      .get();

    const integrations = integrationsSnapshot.docs.map(doc => ({
      provider: doc.data().provider,
      email: doc.data().email,
      isActive: doc.data().isActive,
    }));

    return NextResponse.json({
      user: {
        id: userDoc.id,
        email: userData.email,
        telegramChatId: userData.telegramChatId,
        subscriptionStatus: userData.subscriptionStatus,
        emailQuota: userData.emailQuota,
        createdAt: userData.createdAt?.toDate?.() || userData.createdAt,
      },
      integrations,
    });
  } catch (error) {
    console.error('User API error:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

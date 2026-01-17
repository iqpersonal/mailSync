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
  try {
    // Get all users
    const usersSnapshot = await db.collection('users').get();
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
    }));

    // Calculate stats
    const totalUsers = users.length;
    const proUsers = users.filter((u: any) => u.subscriptionStatus === 'pro').length;
    const enterpriseUsers = users.filter((u: any) => u.subscriptionStatus === 'enterprise').length;
    
    // Active today (users who have quota used > 0 and quota reset is today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeToday = users.filter((u: any) => {
      const resetAt = u.emailQuota?.resetAt;
      if (!resetAt) return false;
      const resetDate = new Date(resetAt);
      return resetDate >= today && u.emailQuota?.used > 0;
    }).length;

    // Total emails processed (sum of all used quotas)
    const emailsProcessed = users.reduce((sum: number, u: any) => {
      return sum + (u.emailQuota?.used || 0);
    }, 0);

    return NextResponse.json({
      stats: {
        totalUsers,
        activeToday,
        emailsProcessed,
        proUsers: proUsers + enterpriseUsers,
      },
      users,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

'use client';

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC2HLl4MeolajGMExN27ASTiDfWL8AStns",
  authDomain: "atscv-673b8.firebaseapp.com",
  projectId: "atscv-673b8",
  storageBucket: "atscv-673b8.firebasestorage.app",
  messagingSenderId: "747734902447",
  appId: "1:747734902447:web:d7e9bb3e433c85fb8a965a",
  measurementId: "G-CB2LER13HP"
};

// Initialize Firebase (singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

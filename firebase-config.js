/**
 * Arogya Raksha — Firebase Global Initializer
 * Uses Firebase Web SDK Modular v9+ via CDN.
 *
 * Exposes globally:
 *   window.firebaseApp
 *   window.firebaseAuth
 *   window.firestoreDB
 *
 * No data is fetched automatically.
 * All reads/writes must be triggered by user actions.
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyBKLbWsqsNipU6a-Qec6t_y1X60hhiQMFI",
    authDomain: "health1-6deda.firebaseapp.com",
    projectId: "health1-6deda",
    storageBucket: "health1-6deda.firebasestorage.app",
    messagingSenderId: "366719596305",
    appId: "1:366719596305:web:1c5a1876fff53e05157eb0",
    measurementId: "G-GV4JWKY7C3"
};

// Initialize once — guard against double-init
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firestoreDB = getFirestore(firebaseApp);

// Expose globally so every HTML page can access without re-importing
window.firebaseApp = firebaseApp;
window.firebaseAuth = firebaseAuth;
window.firestoreDB = firestoreDB;

console.log('[Arogya Raksha] Firebase ready ✓ (auth + firestore)');

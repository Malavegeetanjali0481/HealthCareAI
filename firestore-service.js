/**
 * Arogya Raksha — Firestore Service Layer (Modular v9+)
 * ──────────────────────────────────────────────────
 * All writes are triggered ONLY by user actions.
 * No data is read or fetched automatically.
 *
 * Collections:
 *   users/                – role mapping after login
 *   triage_records/       – AI symptom assessment results
 *   patients/             – patient health profiles
 *   telemedicine_queue/   – consultation queue entries
 *   alerts/               – (reserved, no auto-load)
 *   education_content/    – (reserved, no auto-load)
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';
import {
    getFirestore, collection, doc,
    addDoc, setDoc, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';

// ── Single initialization (guard against double-init) ──────────────
const firebaseConfig = {
    apiKey: "AIzaSyBKLbWsqsNipU6a-Qec6t_y1X60hhiQMFI",
    authDomain: "health1-6deda.firebaseapp.com",
    projectId: "health1-6deda",
    storageBucket: "health1-6deda.firebasestorage.app",
    messagingSenderId: "366719596305",
    appId: "1:366719596305:web:1c5a1876fff53e05157eb0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Expose globally so non-module scripts can call them
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firestoreDB = db;

// ── Helper – current user uid (null if not logged in) ───────────────
function uid() {
    const u = auth.currentUser;
    return u ? u.uid : (sessionStorage.getItem('ha_uid') || 'anonymous');
}

// ══════════════════════════════════════════════════════════
// 1. TRIAGE RECORD
//    Call after AI results are shown in triage.html
// ══════════════════════════════════════════════════════════
window.saveTriage = async function saveTriage({ role, age, gender, symptoms, riskLevel }) {
    try {
        await addDoc(collection(db, 'triage_records'), {
            uid: uid(),
            role: role || sessionStorage.getItem('ha_role') || 'unknown',
            age: age,
            gender: gender,
            symptoms: symptoms,          // string[]
            riskLevel: riskLevel,         // 'LOW' | 'MEDIUM' | 'HIGH'
            timestamp: serverTimestamp()
        });
        console.log('[Firestore] triage_records ✓');
    } catch (e) {
        console.warn('[Firestore] triage_records write failed:', e.message);
    }
};

// ══════════════════════════════════════════════════════════
// 2. PATIENT PROFILE
//    Call on profile create / update
// ══════════════════════════════════════════════════════════
window.savePatientProfile = async function savePatientProfile({ name, age, village, medicalHistory, riskHistory }) {
    const patientId = uid();
    try {
        await setDoc(doc(db, 'patients', patientId), {
            uid: patientId,
            name: name,
            age: age,
            village: village,
            medicalHistory: medicalHistory || [],   // string[]
            riskHistory: riskHistory || [],   // string[]
            updatedAt: serverTimestamp()
        }, { merge: true });
        console.log('[Firestore] patients ✓');
    } catch (e) {
        console.warn('[Firestore] patients write failed:', e.message);
    }
};

// ══════════════════════════════════════════════════════════
// 3. TELEMEDICINE QUEUE ENTRY
//    Call when a case is confirmed / added to queue
// ══════════════════════════════════════════════════════════
window.saveTelemedicineEntry = async function saveTelemedicineEntry({ patientId, patientName, riskScore, priority, assignedDoctor, status }) {
    try {
        await addDoc(collection(db, 'telemedicine_queue'), {
            patientId: patientId || uid(),
            patientName: patientName || 'Unknown',
            riskScore: riskScore || 0,
            priority: priority || 'Medium',   // 'High' | 'Medium' | 'Low'
            assignedDoctor: assignedDoctor || 'Unassigned',
            status: status || 'Waiting',  // 'Waiting' | 'In Progress' | 'Completed'
            timestamp: serverTimestamp()
        });
        console.log('[Firestore] telemedicine_queue ✓');
    } catch (e) {
        console.warn('[Firestore] telemedicine_queue write failed:', e.message);
    }
};

// ══════════════════════════════════════════════════════════
// 4. USER ROLE MAPPING
//    Called automatically after login / signup (login.html)
// ══════════════════════════════════════════════════════════
window.saveUserRole = async function saveUserRole({ userId, role, displayName }) {
    try {
        await setDoc(doc(db, 'users', userId), {
            uid: userId,
            role: role,
            displayName: displayName || '',
            updatedAt: serverTimestamp()
        }, { merge: true });
        console.log('[Firestore] users ✓');
    } catch (e) {
        console.warn('[Firestore] users write failed:', e.message);
    }
};

// ══════════════════════════════════════════════════════════
// 5. RESERVED COLLECTIONS (no auto-load)
//    alerts, education_content — available for future use
// ══════════════════════════════════════════════════════════
window.saveAlert = async function saveAlert({ type, message, district, severity }) {
    try {
        await addDoc(collection(db, 'alerts'), {
            type, message, district,
            severity: severity || 'Medium',
            createdBy: uid(),
            timestamp: serverTimestamp()
        });
        console.log('[Firestore] alerts ✓');
    } catch (e) {
        console.warn('[Firestore] alerts write failed:', e.message);
    }
};

console.log('[Arogya Raksha] firestore-service.js loaded ✓');

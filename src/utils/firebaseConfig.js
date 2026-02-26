/**
 * SAVR · Firebase Configuration
 * ─────────────────────────────────────────────────────────────────
 * HOW TO GET YOUR CONFIG:
 *  1. Go to https://console.firebase.google.com
 *  2. Create a project (e.g. "savr-blockchain")
 *  3. Add a Web App (the </> icon)
 *  4. Enable Realtime Database:
 *       Build → Realtime Database → Create database → Start in test mode
 *  5. Copy the config object below and replace with your values.
 *  6. In Realtime Database rules, set read/write to true for demo:
 *       { "rules": { ".read": true, ".write": true } }
 */

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCq8mDN3hJFX_0Xt_OLuHMN7eUXgQk4Tsg",
    authDomain: "savr-blockchain.firebaseapp.com",
    databaseURL: "https://savr-blockchain-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "savr-blockchain",
    storageBucket: "savr-blockchain.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abc123def456",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

/**
 * SAVR Blockchain Security Layer
 * ─────────────────────────────────────────────────────────────────
 * Each profile save / prescription upload is SHA-256 hashed and
 * written to Firebase Realtime Database so ALL patients' records
 * aggregate on the admin dashboard — across any browser or device.
 *
 * Local localStorage is kept as a fast offline cache.
 * Firebase is the source of truth for the admin view.
 */

import { ref, push } from 'firebase/database';
import { db } from './firebaseConfig';

const LEDGER_KEY = 'savr_blockchain_ledger';

/** SHA-256 via Web Crypto API → hex string */
async function sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Load this patient's local chain (for prevHash chaining) */
function loadLocalLedger() {
    try {
        const raw = localStorage.getItem(LEDGER_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveLocalLedger(ledger) {
    localStorage.setItem(LEDGER_KEY, JSON.stringify(ledger));
}

/**
 * Hash & append a new block.
 * → Writes to Firebase (visible to admin across ALL devices/users)
 * → Also caches locally in localStorage
 *
 * @param {'PROFILE_SAVE' | 'PRESCRIPTION_ADD'} type
 * @param {object} payload
 */
export async function appendBlock(type, payload) {
    const localLedger = loadLocalLedger();
    const prevBlock = localLedger[localLedger.length - 1];
    const prevHash = prevBlock ? prevBlock.blockHash : '0'.repeat(64);

    const timestamp = new Date().toISOString();
    const dataHash = await sha256(JSON.stringify(payload));
    const index = localLedger.length;
    const blockHash = await sha256(`${index}${timestamp}${type}${dataHash}${prevHash}`);

    const block = { index, timestamp, type, dataHash, prevHash, blockHash };

    // ── Write to Firebase (shared across all users) ──────────────
    try {
        await push(ref(db, 'blockchain/blocks'), block);
    } catch (err) {
        console.warn('[SAVR] Firebase write failed, falling back to localStorage only:', err);
    }

    // ── Cache locally ─────────────────────────────────────────────
    localLedger.push(block);
    saveLocalLedger(localLedger);

    return block;
}

/** Still exported for compatibility — reads only local cache */
export function loadLedger() {
    return loadLocalLedger();
}

export function clearLedger() {
    localStorage.removeItem(LEDGER_KEY);
}

/**
 * SAVR Blockchain Security Layer
 * ─────────────────────────────────────────────────────────────
 * Simulates an on-device blockchain ledger for medical data.
 * Every profile save & prescription upload is SHA-256 hashed
 * and appended to an immutable chain stored in localStorage.
 *
 * Storage key : "savr_blockchain_ledger"
 * Each block   : { index, timestamp, type, dataHash, prevHash, blockHash }
 */

const LEDGER_KEY = 'savr_blockchain_ledger';

/** SHA-256 using Web Crypto API → returns hex string */
async function sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Load the existing ledger from localStorage */
export function loadLedger() {
    try {
        const raw = localStorage.getItem(LEDGER_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

/** Persist ledger to localStorage */
function saveLedger(ledger) {
    localStorage.setItem(LEDGER_KEY, JSON.stringify(ledger));
}

/**
 * Append a new block to the chain.
 * @param {'PROFILE_SAVE' | 'PRESCRIPTION_ADD'} type
 * @param {object} payload  - the raw data object to hash
 * @returns {object} the new block
 */
export async function appendBlock(type, payload) {
    const ledger = loadLedger();
    const prevBlock = ledger[ledger.length - 1];
    const prevHash = prevBlock ? prevBlock.blockHash : '0'.repeat(64);

    const timestamp = new Date().toISOString();
    const dataHash = await sha256(JSON.stringify(payload));

    // Block hash = SHA-256 of (index + timestamp + type + dataHash + prevHash)
    const index = ledger.length;
    const blockHash = await sha256(`${index}${timestamp}${type}${dataHash}${prevHash}`);

    const block = {
        index,
        timestamp,
        type,
        dataHash,
        prevHash,
        blockHash,
    };

    ledger.push(block);
    saveLedger(ledger);
    return block;
}

/** Clear the ledger (for testing only) */
export function clearLedger() {
    localStorage.removeItem(LEDGER_KEY);
}

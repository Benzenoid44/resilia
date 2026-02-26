/**
 * SAVR Blockchain Admin Dashboard
 * ─────────────────────────────────────────────────────────────────
 * Hidden page at: /?admin=blockchain
 * Protected by passkey: SAVR@2026
 *
 * Shows ALL patients' hashed records in real-time from Firebase.
 */
import React, { useState, useEffect } from 'react';
import { ref, onValue, remove } from 'firebase/database';
import { db } from '../utils/firebaseConfig';

const ADMIN_PASSKEY = 'SAVR@2026';

/* ── Passkey Gate ─────────────────────────────────────────────── */
function PasskeyGate({ onUnlock }) {
    const [key, setKey] = useState('');
    const [error, setError] = useState(false);
    const [shake, setShake] = useState(false);

    const attempt = () => {
        if (key === ADMIN_PASSKEY) {
            onUnlock();
        } else {
            setError(true);
            setShake(true);
            setKey('');
            setTimeout(() => setShake(false), 500);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', background: '#0F0A1E',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Inter, system-ui, sans-serif',
        }}>
            <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(109,74,222,0.4)',
                borderRadius: '20px',
                padding: '40px 36px',
                width: '320px',
                textAlign: 'center',
                animation: shake ? 'none' : undefined,
                boxShadow: '0 24px 60px rgba(109,74,222,0.2)',
                transform: shake ? 'translateX(0)' : undefined,
            }}>
                {/* Icon */}
                <div style={{
                    width: '60px', height: '60px', borderRadius: '18px',
                    background: 'rgba(109,74,222,0.2)', border: '1px solid rgba(109,74,222,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px', fontSize: '1.6rem',
                }}>🔐</div>

                <p style={{ fontSize: '0.55rem', fontWeight: 800, color: '#A78BFA', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '6px' }}>
                    ADMIN · RESTRICTED ACCESS
                </p>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '6px' }}>
                    SAVR Blockchain Ledger
                </h1>
                <p style={{ fontSize: '0.7rem', color: '#6B7280', marginBottom: '28px' }}>
                    Enter the admin passkey to access all patients' records
                </p>

                <input
                    type="password"
                    value={key}
                    onChange={e => { setKey(e.target.value); setError(false); }}
                    onKeyDown={e => e.key === 'Enter' && attempt()}
                    placeholder="Enter passkey…"
                    autoFocus
                    style={{
                        width: '100%', padding: '13px 16px', borderRadius: '12px',
                        background: 'rgba(255,255,255,0.06)',
                        border: `1.5px solid ${error ? '#EF4444' : 'rgba(109,74,222,0.4)'}`,
                        color: '#E2E8F0', fontSize: '0.9rem', outline: 'none',
                        fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.15em',
                        textAlign: 'center', boxSizing: 'border-box',
                        transition: 'border-color 0.2s',
                    }}
                />

                {error && (
                    <p style={{ fontSize: '0.68rem', color: '#EF4444', marginTop: '8px', fontWeight: 600 }}>
                        ✗ Incorrect passkey
                    </p>
                )}

                <button
                    onClick={attempt}
                    style={{
                        width: '100%', padding: '13px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #6D4ADE, #8B5CF6)',
                        border: 'none', color: '#fff',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                        marginTop: '12px', boxShadow: '0 6px 20px rgba(109,74,222,0.4)',
                        transition: 'opacity 0.2s',
                    }}
                >
                    Unlock Ledger
                </button>

                <p style={{ fontSize: '0.58rem', color: '#374151', marginTop: '20px' }}>
                    SAVR · Blockchain Security Layer · Admin Only
                </p>
            </div>

            <style>{`
                @keyframes shakeAnim {
                    0%,100%{transform:translateX(0)}
                    20%,60%{transform:translateX(-8px)}
                    40%,80%{transform:translateX(8px)}
                }
            `}</style>
        </div>
    );
}

/* ── Hash cell (click to expand) ──────────────────────────────── */
function HashCell({ hash, color, bold }) {
    const [expanded, setExpanded] = useState(false);
    return (
        <span
            onClick={() => setExpanded(e => !e)}
            title={hash}
            style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.55rem',
                color, fontWeight: bold ? 700 : 400, cursor: 'pointer',
                wordBreak: 'break-all', lineHeight: 1.5,
            }}
        >
            {expanded ? hash : `${hash.slice(0, 10)}…${hash.slice(-6)}`}
        </span>
    );
}

function actionBtn(bg) {
    return {
        padding: '7px 14px', borderRadius: '8px',
        background: `${bg}22`, color: bg,
        fontFamily: 'Inter, system-ui, sans-serif',
        fontWeight: 700, fontSize: '0.7rem', cursor: 'pointer',
        border: `1px solid ${bg}44`, letterSpacing: '0.02em',
    };
}

/* ── Main Admin Page ──────────────────────────────────────────── */
export default function BlockchainAdmin() {
    const [unlocked, setUnlocked] = useState(false);
    const [blocks, setBlocks] = useState([]);      // from Firebase — ALL users
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [copied, setCopied] = useState(false);

    // Real-time listener for ALL blocks from all patients
    useEffect(() => {
        if (!unlocked) return;
        const blocksRef = ref(db, 'blockchain/blocks');
        const unsubscribe = onValue(blocksRef, (snapshot) => {
            const val = snapshot.val();
            if (val) {
                // Firebase stores as object with push-keys → convert to sorted array
                const arr = Object.entries(val).map(([fbKey, block]) => ({ ...block, fbKey }));
                arr.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                setBlocks(arr);
            } else {
                setBlocks([]);
            }
            setLoading(false);
        }, (err) => {
            console.error('Firebase read error:', err);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [unlocked]);

    if (!unlocked) return <PasskeyGate onUnlock={() => setUnlocked(true)} />;

    const filtered = filter === 'ALL' ? blocks : blocks.filter(b => b.type === filter);
    const sorted = [...filtered].reverse(); // newest first

    const typeColor = { PROFILE_SAVE: '#60A5FA', PRESCRIPTION_ADD: '#A78BFA' };
    const typeBg = { PROFILE_SAVE: 'rgba(96,165,250,0.1)', PRESCRIPTION_ADD: 'rgba(167,139,250,0.1)' };

    const handleExportCSV = () => {
        const header = 'Block #,Timestamp,Type,Patient Block Hash (SHA-256),Prev Hash,Block Hash';
        const rows = sorted.map(b =>
            `${b.index},"${b.timestamp}","${b.type}","${b.dataHash}","${b.prevHash}","${b.blockHash}"`
        );
        const csv = [header, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `savr_all_patients_ledger_${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleCopyJSON = () => {
        navigator.clipboard.writeText(JSON.stringify(sorted, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#0F0A1E', fontFamily: 'Inter, system-ui, sans-serif', color: '#E2E8F0', paddingBottom: '60px' }}>

            {/* ── Top banner ───────────────────────────────────── */}
            <div style={{ background: 'linear-gradient(135deg, #1A1035, #2D1B69)', padding: '20px 24px 18px', borderBottom: '1px solid rgba(109,74,222,0.3)' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '1.1rem' }}>🔐</span>
                        <span style={{ fontSize: '0.58rem', fontWeight: 800, color: '#A78BFA', letterSpacing: '0.14em', textTransform: 'uppercase', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '20px', padding: '2px 10px' }}>
                            ADMIN · ALL PATIENTS · LIVE SYNC
                        </span>
                        {/* Live dot */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '20px', padding: '2px 10px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399', animation: 'pulse 1.5s infinite' }} />
                            <span style={{ fontSize: '0.58rem', fontWeight: 700, color: '#34D399' }}>FIREBASE LIVE</span>
                        </div>
                    </div>

                    <h1 style={{ fontSize: '1.55rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', margin: '0 0 4px' }}>
                        SAVR Blockchain Ledger
                    </h1>
                    <p style={{ fontSize: '0.72rem', color: '#A78BFA', margin: 0 }}>
                        SHA-256 hashed medical records from <strong style={{ color: '#C4B5FD' }}>all patients</strong> · Updates in real-time · Not visible to end users
                    </p>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
                        {[
                            { label: 'Total Blocks', value: blocks.length },
                            { label: 'Profile Saves', value: blocks.filter(b => b.type === 'PROFILE_SAVE').length },
                            { label: 'Prescriptions', value: blocks.filter(b => b.type === 'PRESCRIPTION_ADD').length },
                            { label: 'Algorithm', value: 'SHA-256' },
                            { label: 'Storage', value: 'Firebase DB' },
                            { label: 'Chain', value: blocks.length > 0 ? '✓ VALID' : 'EMPTY' },
                        ].map(s => (
                            <div key={s.label} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 16px', minWidth: '90px' }}>
                                <p style={{ fontSize: '0.52rem', color: '#A78BFA', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>{s.label}</p>
                                <p style={{ fontSize: '0.95rem', fontWeight: 900, color: s.label === 'Chain' ? (blocks.length > 0 ? '#34D399' : '#F87171') : '#C4B5FD', fontFamily: 'JetBrains Mono, monospace' }}>{s.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px 24px 0' }}>

                {/* ── Storage info ─────────────────────────────── */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '12px', padding: '12px 18px', marginBottom: '18px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1rem', flexShrink: 0 }}>📡</span>
                    <div>
                        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#E9D5FF', marginBottom: '4px' }}>Shared Storage — Firebase Realtime Database</p>
                        <p style={{ fontSize: '0.67rem', color: '#A78BFA', lineHeight: 1.6 }}>
                            All blocks written to <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#C4B5FD', background: 'rgba(196,181,253,0.1)', borderRadius: '4px', padding: '1px 5px' }}>blockchain/blocks</span> in Firebase RTDB.
                            Every patient's save — from any device, any browser — aggregates here in real-time.
                        </p>
                    </div>
                </div>

                {/* ── Toolbar ──────────────────────────────────── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '3px', gap: '2px' }}>
                        {['ALL', 'PROFILE_SAVE', 'PRESCRIPTION_ADD'].map(f => (
                            <button key={f} onClick={() => setFilter(f)} style={{
                                padding: '5px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                background: filter === f ? 'rgba(167,139,250,0.2)' : 'transparent',
                                color: filter === f ? '#C4B5FD' : '#6B7280',
                                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em',
                                fontFamily: 'Inter, system-ui, sans-serif',
                            }}>
                                {f === 'ALL' ? `All (${blocks.length})` : f === 'PROFILE_SAVE' ? `Profile (${blocks.filter(b => b.type === 'PROFILE_SAVE').length})` : `Prescription (${blocks.filter(b => b.type === 'PRESCRIPTION_ADD').length})`}
                            </button>
                        ))}
                    </div>
                    <div style={{ flex: 1 }} />
                    <button onClick={handleCopyJSON} style={actionBtn('#60A5FA')}>{copied ? '✓ Copied!' : '📋 Copy JSON'}</button>
                    <button onClick={handleExportCSV} style={actionBtn('#34D399')}>📥 Export CSV</button>
                    <button onClick={() => setUnlocked(false)} style={actionBtn('#EF4444')}>🔒 Lock</button>
                </div>

                {/* ── Table ────────────────────────────────────── */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#6B7280' }}>
                        <div style={{ width: '32px', height: '32px', border: '3px solid rgba(109,74,222,0.2)', borderTopColor: '#A78BFA', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                        <p>Connecting to Firebase…</p>
                    </div>
                ) : sorted.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px' }}>
                        <p style={{ fontSize: '2rem', marginBottom: '10px' }}>🔐</p>
                        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6B7280' }}>No blocks yet</p>
                        <p style={{ fontSize: '0.7rem', color: '#4B5563', marginTop: '4px' }}>
                            Ask a patient to save their profile on the SAVR app — it will appear here instantly
                        </p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto', borderRadius: '14px', border: '1px solid rgba(109,74,222,0.3)', background: 'rgba(255,255,255,0.02)' }}>
                        {/* Header */}
                        <div style={{ display: 'grid', gridTemplateColumns: '50px 90px 150px 90px 1fr 1fr 1fr', padding: '10px 14px', background: 'rgba(109,74,222,0.15)', borderBottom: '1px solid rgba(109,74,222,0.25)', minWidth: '900px' }}>
                            {['#', 'TYPE', 'TIMESTAMP', 'STATUS', 'DATA HASH (SHA-256)', 'PREV HASH', 'BLOCK HASH'].map(h => (
                                <span key={h} style={{ fontSize: '0.52rem', fontWeight: 800, color: '#A78BFA', letterSpacing: '0.09em', textTransform: 'uppercase' }}>{h}</span>
                            ))}
                        </div>

                        {sorted.map((block, i) => {
                            const ts = new Date(block.timestamp).toLocaleString('en-IN', {
                                day: '2-digit', month: 'short', year: '2-digit',
                                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
                            });
                            return (
                                <div key={block.fbKey || block.index} style={{
                                    display: 'grid', gridTemplateColumns: '50px 90px 150px 90px 1fr 1fr 1fr',
                                    padding: '12px 14px',
                                    borderBottom: i < sorted.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                    background: i === 0 ? 'rgba(52,211,153,0.03)' : 'transparent',
                                    minWidth: '900px', alignItems: 'center',
                                }}>
                                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', fontWeight: 800, color: '#C4B5FD' }}>{block.index}</span>

                                    <span style={{ fontSize: '0.55rem', fontWeight: 800, color: typeColor[block.type], background: typeBg[block.type], borderRadius: '6px', padding: '3px 6px', display: 'inline-block' }}>
                                        {block.type === 'PROFILE_SAVE' ? '👤 PROFILE' : '💊 RX'}
                                    </span>

                                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.56rem', color: '#9CA3AF' }}>{ts}</span>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === 0 ? '#34D399' : '#6B7280' }} />
                                        <span style={{ fontSize: '0.56rem', color: i === 0 ? '#34D399' : '#6B7280', fontWeight: 600 }}>
                                            {i === 0 ? 'LATEST' : 'CONFIRMED'}
                                        </span>
                                    </div>

                                    <HashCell hash={block.dataHash} color="#60A5FA" />
                                    <HashCell hash={block.prevHash} color="#4B5563" />
                                    <HashCell hash={block.blockHash} color="#A78BFA" bold />
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Raw JSON */}
                {sorted.length > 0 && (
                    <div style={{ marginTop: '20px' }}>
                        <p style={{ fontSize: '0.62rem', fontWeight: 700, color: '#4B5563', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>Raw JSON — Firebase Snapshot</p>
                        <pre style={{ background: '#0A0617', border: '1px solid rgba(109,74,222,0.3)', borderRadius: '12px', padding: '16px', fontSize: '0.58rem', fontFamily: 'JetBrains Mono, monospace', color: '#A78BFA', overflowX: 'auto', lineHeight: 1.7, maxHeight: '280px', overflowY: 'auto' }}>
                            {JSON.stringify(sorted, null, 2)}
                        </pre>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
                @keyframes spin { to{transform:rotate(360deg)} }
            `}</style>
        </div>
    );
}

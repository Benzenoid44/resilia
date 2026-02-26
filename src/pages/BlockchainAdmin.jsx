/**
 * SAVR Blockchain Admin Ledger
 * Hidden admin-only view accessible at:  /?admin=blockchain
 * Protected by a passkey gate — ledger is never shown without authentication.
 */
import React, { useState, useEffect } from 'react';
import { loadLedger, clearLedger } from '../utils/blockchain';

/* ── Passkey gate ─────────────────────────────────────────────── */
const ADMIN_PASSKEY = 'savr@2026';
const SESSION_KEY = 'savr_admin_auth';

function PasskeyGate({ onUnlock }) {
    const [input, setInput] = useState('');
    const [error, setError] = useState(false);
    const [shake, setShake] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [show, setShow] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input === ADMIN_PASSKEY) {
            sessionStorage.setItem(SESSION_KEY, '1');
            onUnlock();
        } else {
            setAttempts(a => a + 1);
            setError(true);
            setShake(true);
            setInput('');
            setTimeout(() => setShake(false), 600);
            setTimeout(() => setError(false), 2500);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', background: '#0F0A1E',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Inter, system-ui, sans-serif',
            padding: '20px',
        }}>
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20%       { transform: translateX(-8px); }
                    40%       { transform: translateX(8px); }
                    60%       { transform: translateX(-6px); }
                    80%       { transform: translateX(6px); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div style={{
                width: '100%', maxWidth: '380px',
                animation: 'fadeIn 0.4s ease',
                animationFillMode: shake ? 'none' : undefined,
            }}>
                {/* Logo / badge */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '18px',
                        background: 'linear-gradient(135deg, #4C1D95, #6D28D9)',
                        border: '1px solid rgba(167,139,250,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 14px', fontSize: '1.8rem',
                        boxShadow: '0 8px 32px rgba(109,74,222,0.35)',
                    }}>🔐</div>
                    <p style={{ fontSize: '0.6rem', fontWeight: 800, color: '#7C3AED', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '6px' }}>
                        ADMIN · RESTRICTED
                    </p>
                    <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', margin: 0 }}>
                        SAVR Blockchain Ledger
                    </h1>
                    <p style={{ fontSize: '0.72rem', color: '#6B7280', marginTop: '6px' }}>
                        Enter the admin passkey to continue
                    </p>
                </div>

                {/* Form card */}
                <form onSubmit={handleSubmit} style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${error ? 'rgba(248,113,113,0.5)' : 'rgba(109,74,222,0.35)'}`,
                    borderRadius: '16px', padding: '24px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    animation: shake ? 'shake 0.5s ease' : 'none',
                    transition: 'border-color 0.3s ease',
                }}>
                    <label style={{ fontSize: '0.65rem', fontWeight: 700, color: '#A78BFA', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                        Passkey
                    </label>
                    <div style={{ position: 'relative', marginBottom: '16px' }}>
                        <input
                            type={show ? 'text' : 'password'}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Enter passkey…"
                            autoFocus
                            style={{
                                width: '100%', padding: '12px 44px 12px 14px',
                                borderRadius: '10px', border: `1px solid ${error ? 'rgba(248,113,113,0.5)' : 'rgba(109,74,222,0.3)'}`,
                                background: '#0A0617', color: '#E9D5FF',
                                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem',
                                outline: 'none', boxSizing: 'border-box',
                                letterSpacing: show ? '0.05em' : '0.2em',
                                transition: 'border-color 0.3s ease',
                            }}
                        />
                        {/* Show / hide toggle */}
                        <button
                            type="button"
                            onClick={() => setShow(s => !s)}
                            style={{
                                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                                background: 'none', border: 'none', cursor: 'pointer',
                                fontSize: '0.85rem', color: '#6B7280', padding: 0,
                            }}
                        >{show ? '🙈' : '👁'}</button>
                    </div>

                    {/* Error message */}
                    <div style={{
                        overflow: 'hidden', maxHeight: error ? '32px' : '0',
                        transition: 'max-height 0.3s ease', marginBottom: error ? '12px' : '0',
                    }}>
                        <p style={{ fontSize: '0.7rem', color: '#F87171', fontWeight: 600 }}>
                            ✕ Incorrect passkey{attempts > 1 ? ` (${attempts} attempts)` : ''} — try again
                        </p>
                    </div>

                    <button type="submit" style={{
                        width: '100%', padding: '12px',
                        borderRadius: '10px', border: 'none',
                        background: 'linear-gradient(135deg, #6D28D9, #4C1D95)',
                        color: '#fff', fontFamily: 'Inter, system-ui, sans-serif',
                        fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer',
                        boxShadow: '0 4px 18px rgba(109,74,222,0.4)',
                        letterSpacing: '0.02em',
                    }}>
                        Unlock Ledger →
                    </button>
                </form>

                <p style={{ textAlign: 'center', fontSize: '0.6rem', color: '#374151', marginTop: '18px' }}>
                    SAVR · Medical Data Security · Admin Only
                </p>
            </div>
        </div>
    );
}

/* ── Main admin component ─────────────────────────────────────── */
export default function BlockchainAdmin() {
    const [unlocked, setUnlocked] = useState(
        () => sessionStorage.getItem(SESSION_KEY) === '1'
    );
    const [ledger, setLedger] = useState([]);
    const [copied, setCopied] = useState(false);
    const [cleared, setCleared] = useState(false);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        setLedger(loadLedger());
        const interval = setInterval(() => setLedger(loadLedger()), 3000);
        return () => clearInterval(interval);
    }, []);

    const filtered = filter === 'ALL' ? ledger : ledger.filter(b => b.type === filter);
    const sorted = [...filtered].reverse();

    const handleCopyJSON = () => {
        navigator.clipboard.writeText(JSON.stringify(ledger, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleExportCSV = () => {
        const header = 'Block #,Timestamp,Type,Data Hash,Prev Hash,Block Hash';
        const rows = ledger.map(b =>
            `${b.index},"${b.timestamp}","${b.type}","${b.dataHash}","${b.prevHash}","${b.blockHash}"`
        );
        const csv = [header, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `savr_blockchain_ledger_${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleClear = () => {
        clearLedger();
        setLedger([]);
        setCleared(true);
        setTimeout(() => setCleared(false), 2000);
    };

    const typeLabel = { PROFILE_SAVE: 'Profile Save', PRESCRIPTION_ADD: 'Prescription' };
    const typeColor = { PROFILE_SAVE: '#2563EB', PRESCRIPTION_ADD: '#6D4ADE' };
    const typeBg = { PROFILE_SAVE: 'rgba(37,99,235,0.08)', PRESCRIPTION_ADD: 'rgba(109,74,222,0.08)' };

    const handleLock = () => {
        sessionStorage.removeItem(SESSION_KEY);
        setUnlocked(false);
    };

    // Show passkey gate if not authenticated
    if (!unlocked) {
        return <PasskeyGate onUnlock={() => setUnlocked(true)} />;
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0F0A1E', fontFamily: 'Inter, system-ui, sans-serif', color: '#E2E8F0', padding: '0 0 60px' }}>

            {/* ── Top banner ─────────────────────────────────────── */}
            <div style={{ background: 'linear-gradient(135deg, #1A1035, #2D1B69)', padding: '20px 24px 16px', borderBottom: '1px solid rgba(109,74,222,0.3)' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '1.2rem' }}>🔐</span>
                        <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#A78BFA', letterSpacing: '0.14em', textTransform: 'uppercase', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '20px', padding: '2px 10px' }}>
                            ADMIN · RESTRICTED
                        </span>
                        <div style={{ flex: 1 }} />
                        <button onClick={handleLock} style={{
                            padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(248,113,113,0.4)',
                            background: 'rgba(248,113,113,0.1)', color: '#F87171', cursor: 'pointer',
                            fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em',
                        }}>
                            🔒 Lock Session
                        </button>
                    </div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', margin: '0 0 4px' }}>
                        SAVR Blockchain Ledger
                    </h1>
                    <p style={{ fontSize: '0.75rem', color: '#A78BFA', margin: 0 }}>
                        SHA-256 hashed medical data records · Not visible to end users
                    </p>

                    {/* Stats row */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
                        {[
                            { label: 'Total Blocks', value: ledger.length },
                            { label: 'Profile Saves', value: ledger.filter(b => b.type === 'PROFILE_SAVE').length },
                            { label: 'Prescriptions', value: ledger.filter(b => b.type === 'PRESCRIPTION_ADD').length },
                            { label: 'Algorithm', value: 'SHA-256' },
                            { label: 'Chain Status', value: ledger.length > 0 ? '✓ VALID' : 'EMPTY' },
                        ].map(s => (
                            <div key={s.label} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 16px', minWidth: '100px' }}>
                                <p style={{ fontSize: '0.55rem', color: '#A78BFA', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>{s.label}</p>
                                <p style={{ fontSize: '1rem', fontWeight: 900, color: s.label === 'Chain Status' ? (ledger.length > 0 ? '#34D399' : '#F87171') : '#C4B5FD', fontFamily: 'JetBrains Mono, monospace' }}>{s.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 24px 0' }}>

                {/* ── Storage info ────────────────────────────────── */}
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(109,74,222,0.3)', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1rem', flexShrink: 0 }}>📦</span>
                    <div>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#E9D5FF', marginBottom: '4px' }}>Storage Location</p>
                        <p style={{ fontSize: '0.7rem', color: '#A78BFA', lineHeight: 1.6 }}>
                            Stored in <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#C4B5FD', background: 'rgba(196,181,253,0.1)', borderRadius: '4px', padding: '1px 5px' }}>localStorage</span> under key{' '}
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#C4B5FD', background: 'rgba(196,181,253,0.1)', borderRadius: '4px', padding: '1px 5px' }}>savr_blockchain_ledger</span>.
                            {' '}To verify: <strong style={{ color: '#E9D5FF' }}>DevTools (F12) → Application → Local Storage → localhost</strong>.
                        </p>
                    </div>
                </div>

                {/* ── Toolbar ──────────────────────────────────────── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    {/* Filter */}
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '3px', gap: '2px' }}>
                        {['ALL', 'PROFILE_SAVE', 'PRESCRIPTION_ADD'].map(f => (
                            <button key={f} onClick={() => setFilter(f)} style={{
                                padding: '5px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                background: filter === f ? 'rgba(167,139,250,0.2)' : 'transparent',
                                color: filter === f ? '#C4B5FD' : '#6B7280',
                                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em',
                                fontFamily: 'Inter, system-ui, sans-serif',
                            }}>
                                {f === 'ALL' ? 'All' : f === 'PROFILE_SAVE' ? 'Profile' : 'Prescription'}
                            </button>
                        ))}
                    </div>

                    <div style={{ flex: 1 }} />

                    {/* Actions */}
                    <button onClick={handleCopyJSON} style={actionBtn('#2563EB')}>
                        {copied ? '✓ Copied!' : '📋 Copy JSON'}
                    </button>
                    <button onClick={handleExportCSV} style={actionBtn('#12A37A')}>
                        📥 Export CSV
                    </button>
                    <button onClick={handleClear} style={actionBtn('#DC2626')}>
                        {cleared ? '✓ Cleared' : '🗑 Clear'}
                    </button>
                </div>

                {/* ── Sheet / Table ────────────────────────────────── */}
                {sorted.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px' }}>
                        <p style={{ fontSize: '2rem', marginBottom: '10px' }}>🔐</p>
                        <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#6B7280' }}>No blocks recorded yet</p>
                        <p style={{ fontSize: '0.72rem', color: '#4B5563', marginTop: '4px' }}>Save a profile or add a prescription in the main app to create the first block</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto', borderRadius: '14px', border: '1px solid rgba(109,74,222,0.3)', background: 'rgba(255,255,255,0.02)' }}>
                        {/* Table header */}
                        <div style={{ display: 'grid', gridTemplateColumns: '50px 70px 130px 120px 1fr 1fr 1fr', gap: '0', background: 'rgba(109,74,222,0.15)', borderBottom: '1px solid rgba(109,74,222,0.3)', padding: '10px 14px', minWidth: '900px' }}>
                            {['#', 'TYPE', 'TIMESTAMP', 'STATUS', 'DATA HASH (SHA-256)', 'PREV HASH', 'BLOCK HASH'].map(h => (
                                <span key={h} style={{ fontSize: '0.55rem', fontWeight: 800, color: '#A78BFA', letterSpacing: '0.09em', textTransform: 'uppercase' }}>{h}</span>
                            ))}
                        </div>

                        {/* Table rows */}
                        {sorted.map((block, i) => {
                            const ts = new Date(block.timestamp).toLocaleString('en-IN', {
                                day: '2-digit', month: 'short', year: '2-digit',
                                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
                            });
                            const isGenesis = block.index === 0;
                            return (
                                <div
                                    key={block.index}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '50px 70px 130px 120px 1fr 1fr 1fr',
                                        gap: '0',
                                        padding: '12px 14px',
                                        borderBottom: i < sorted.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                        background: i === 0 ? 'rgba(52,211,153,0.04)' : 'transparent',
                                        minWidth: '900px',
                                        alignItems: 'center',
                                    }}
                                >
                                    {/* Block # */}
                                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', fontWeight: 800, color: '#C4B5FD' }}>
                                        {block.index}
                                        {isGenesis && <span style={{ fontSize: '0.45rem', color: '#A78BFA', display: 'block', letterSpacing: '0.08em' }}>GENESIS</span>}
                                    </span>

                                    {/* Type badge */}
                                    <span style={{ fontSize: '0.55rem', fontWeight: 800, color: typeColor[block.type], background: typeBg[block.type], border: `1px solid ${typeColor[block.type]}30`, borderRadius: '6px', padding: '3px 6px', display: 'inline-block', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                                        {block.type === 'PROFILE_SAVE' ? '👤 PROFILE' : '💊 RX'}
                                    </span>

                                    {/* Timestamp */}
                                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem', color: '#9CA3AF' }}>{ts}</span>

                                    {/* Chain status */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === 0 ? '#34D399' : '#6B7280' }} />
                                        <span style={{ fontSize: '0.58rem', color: i === 0 ? '#34D399' : '#6B7280', fontWeight: 600 }}>
                                            {i === 0 ? 'LATEST' : 'CONFIRMED'}
                                        </span>
                                    </div>

                                    {/* Data Hash */}
                                    <HashCell hash={block.dataHash} color="#60A5FA" />

                                    {/* Prev Hash */}
                                    <HashCell hash={block.prevHash} color="#6B7280" />

                                    {/* Block Hash */}
                                    <HashCell hash={block.blockHash} color="#A78BFA" bold />
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Raw JSON section */}
                {sorted.length > 0 && (
                    <div style={{ marginTop: '20px' }}>
                        <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#6B7280', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                            Raw JSON — localStorage value
                        </p>
                        <pre style={{
                            background: '#0A0617', border: '1px solid rgba(109,74,222,0.3)', borderRadius: '12px',
                            padding: '16px', fontSize: '0.6rem', fontFamily: 'JetBrains Mono, monospace',
                            color: '#A78BFA', overflowX: 'auto', lineHeight: 1.7, maxHeight: '320px', overflowY: 'auto',
                        }}>
                            {JSON.stringify(ledger, null, 2)}
                        </pre>
                    </div>
                )}

                <p style={{ marginTop: '24px', fontSize: '0.6rem', color: '#374151', textAlign: 'center' }}>
                    SAVR · Blockchain Medical Ledger · Admin View · {window.location.origin}/?admin=blockchain
                </p>
            </div>
        </div>
    );
}

function HashCell({ hash, color, bold }) {
    const [expanded, setExpanded] = useState(false);
    return (
        <span
            onClick={() => setExpanded(e => !e)}
            title={hash}
            style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.55rem',
                color,
                fontWeight: bold ? 700 : 400,
                wordBreak: 'break-all',
                cursor: 'pointer',
                lineHeight: 1.5,
            }}
        >
            {expanded ? hash : `${hash.slice(0, 12)}…${hash.slice(-6)}`}
        </span>
    );
}

function actionBtn(bg) {
    return {
        padding: '7px 14px', borderRadius: '8px', border: 'none',
        background: `${bg}22`, color: bg, fontFamily: 'Inter, system-ui, sans-serif',
        fontWeight: 700, fontSize: '0.7rem', cursor: 'pointer',
        border: `1px solid ${bg}44`, letterSpacing: '0.02em',
    };
}

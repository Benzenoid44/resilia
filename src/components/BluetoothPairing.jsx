import React, { useState, useEffect, useRef } from 'react';
import { Bluetooth, BluetoothSearching, BluetoothConnected, ChevronRight, Signal } from 'lucide-react';

const DEVICE_NAME = 'SAVR';

const STATES = {
    IDLE: 'idle',
    SCANNING: 'scanning',
    FOUND: 'found',
    PAIRING: 'pairing',
    PAIRED: 'paired',
};

export default function BluetoothPairing({ onConnected }) {
    const [state, setState] = useState(STATES.IDLE);
    const [progress, setProgress] = useState(0);
    const [dots, setDots] = useState('');
    const [signalStrength, setSignalStrength] = useState(0);
    const timerRef = useRef(null);

    // Animate dots
    useEffect(() => {
        if (state === STATES.SCANNING || state === STATES.PAIRING) {
            const iv = setInterval(() => setDots(d => (d.length >= 3 ? '' : d + '.')), 420);
            return () => clearInterval(iv);
        }
        setDots('');
    }, [state]);

    // Simulate scan → found
    useEffect(() => {
        if (state !== STATES.SCANNING) return;
        timerRef.current = setTimeout(() => {
            setSignalStrength(Math.floor(Math.random() * 20) + 75);
            setState(STATES.FOUND);
        }, 2800);
        return () => clearTimeout(timerRef.current);
    }, [state]);

    // Simulate pairing progress
    useEffect(() => {
        if (state !== STATES.PAIRING) return;
        setProgress(0);
        let p = 0;
        const iv = setInterval(() => {
            p += Math.random() * 14 + 4;
            if (p >= 100) {
                p = 100;
                clearInterval(iv);
                setProgress(100);
                setTimeout(() => setState(STATES.PAIRED), 400);
                return;
            }
            setProgress(p);
        }, 180);
        return () => clearInterval(iv);
    }, [state]);

    // Trigger onConnected after paired animation
    useEffect(() => {
        if (state !== STATES.PAIRED) return;
        const t = setTimeout(onConnected, 1600);
        return () => clearTimeout(t);
    }, [state, onConnected]);

    const startScan = () => setState(STATES.SCANNING);
    const startPairing = () => setState(STATES.PAIRING);

    // Signal bars
    const BarsIcon = ({ strength }) => {
        const bars = strength > 85 ? 4 : strength > 70 ? 3 : strength > 50 ? 2 : 1;
        return (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2.5px', height: '14px' }}>
                {[1, 2, 3, 4].map(b => (
                    <div key={b} style={{
                        width: '3px', height: `${b * 3.2}px`,
                        borderRadius: '1px',
                        background: b <= bars ? '#12A37A' : 'rgba(0,0,0,0.12)',
                        transition: 'background 0.3s',
                    }} />
                ))}
            </div>
        );
    };

    const renderContent = () => {
        switch (state) {
            case STATES.IDLE:
                return (
                    <>
                        <div style={iconWrapStyle('#2563EB')}>
                            <Bluetooth size={40} color="#2563EB" strokeWidth={1.6} />
                        </div>
                        <h2 style={headingStyle}>Connect Your SAVR</h2>
                        <p style={subStyle}>Make sure Bluetooth is enabled and your SAVR device is powered on and nearby.</p>
                        <button style={btnStyle('#2563EB')} onClick={startScan}>
                            <BluetoothSearching size={17} />
                            Scan for Devices
                        </button>
                    </>
                );

            case STATES.SCANNING:
                return (
                    <>
                        <div style={{ ...iconWrapStyle('#6D4ADE'), position: 'relative' }}>
                            <Bluetooth size={40} color="#6D4ADE" strokeWidth={1.6} />
                            {[0, 1, 2].map(i => (
                                <div key={i} style={{
                                    position: 'absolute', inset: 0, borderRadius: '50%',
                                    border: '1.5px solid rgba(109,74,222,0.3)',
                                    animation: `pulse-ring 2.4s ${i * 0.8}s infinite`,
                                }} />
                            ))}
                        </div>
                        <h2 style={headingStyle}>Scanning{dots}</h2>
                        <p style={subStyle}>Looking for SAVR devices in range…</p>
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D97706', animation: 'pulse-dot 1.2s infinite' }} />
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Searching nearby devices…</span>
                            </div>
                        </div>
                    </>
                );

            case STATES.FOUND:
                return (
                    <>
                        <div style={iconWrapStyle('#12A37A')}>
                            <BluetoothSearching size={40} color="#12A37A" strokeWidth={1.6} />
                        </div>
                        <h2 style={headingStyle}>Device Found!</h2>
                        <p style={subStyle}>Tap <strong style={{ color: 'var(--text-primary)' }}>Connect</strong> to pair with your SAVR.</p>

                        <div style={{
                            ...cardStyle,
                            marginTop: '8px',
                            cursor: 'pointer',
                            border: '1.5px solid rgba(18,163,122,0.3)',
                            background: 'rgba(18,163,122,0.05)',
                        }} onClick={startPairing}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '10px',
                                    background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Bluetooth size={20} color="#2563EB" strokeWidth={1.8} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)', letterSpacing: '0.02em' }}>{DEVICE_NAME}</div>
                                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>Health IoT · BLE 5.2</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                <BarsIcon strength={signalStrength} />
                                <span style={{ fontSize: '0.6rem', color: '#12A37A', fontWeight: 700 }}>{signalStrength}%</span>
                            </div>
                            <ChevronRight size={16} color="var(--text-muted)" style={{ marginLeft: '4px' }} />
                        </div>

                        <button style={btnStyle('#2563EB')} onClick={startPairing}>
                            <BluetoothConnected size={17} />
                            Connect
                        </button>
                        <button style={ghostBtnStyle} onClick={startScan}>Scan Again</button>
                    </>
                );

            case STATES.PAIRING:
                return (
                    <>
                        <div style={iconWrapStyle('#2563EB')}>
                            <BluetoothConnected size={40} color="#2563EB" strokeWidth={1.6} style={{ animation: 'float 1.4s ease-in-out infinite' }} />
                        </div>
                        <h2 style={headingStyle}>Pairing{dots}</h2>
                        <p style={subStyle}>Establishing secure connection to <strong style={{ color: 'var(--text-primary)' }}>{DEVICE_NAME}</strong>…</p>

                        <div style={{ width: '100%', marginTop: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Handshaking…</span>
                                <span style={{ fontSize: '0.72rem', color: '#2563EB', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{Math.round(progress)}%</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(0,0,0,0.07)', borderRadius: '10px', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%',
                                    width: `${progress}%`,
                                    background: 'linear-gradient(90deg, #6D4ADE, #2563EB)',
                                    borderRadius: '10px',
                                    transition: 'width 0.18s ease',
                                }} />
                            </div>
                        </div>
                    </>
                );

            case STATES.PAIRED:
                return (
                    <>
                        <div style={{ position: 'relative', ...iconWrapStyle('#12A37A') }}>
                            <BluetoothConnected size={48} color="#12A37A" strokeWidth={1.6} />
                            <div style={{
                                position: 'absolute', bottom: '-4px', right: '-4px',
                                width: '22px', height: '22px', borderRadius: '50%',
                                background: '#12A37A', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(18,163,122,0.4)',
                            }}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <h2 style={{ ...headingStyle, color: '#12A37A' }}>Paired!</h2>
                        <p style={subStyle}><strong style={{ color: 'var(--text-primary)' }}>{DEVICE_NAME}</strong> is connected. Loading your dashboard…</p>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div style={{
            width: '100vw', height: '100vh',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            background: '#E8EDF5',
        }}>
            <div style={{
                width: '100%', maxWidth: '430px', height: '100%', maxHeight: '932px',
                background: 'var(--bg-primary)',
                display: 'flex', flexDirection: 'column',
                position: 'relative', overflow: 'hidden',
                boxShadow: '0 0 60px rgba(0,0,0,0.12)',
            }}>
                {/* Status bar */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 20px 6px',
                    background: 'rgba(244,247,251,0.98)',
                    borderBottom: '1px solid var(--border)',
                }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Bluetooth size={13} color={state !== STATES.IDLE ? '#2563EB' : 'var(--text-muted)'} />
                        <Signal size={13} color="var(--text-muted)" />
                    </div>
                </div>

                {/* BT label */}
                <div style={{ padding: '28px 28px 0', textAlign: 'center' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.18)',
                        borderRadius: '20px', padding: '4px 12px', marginBottom: '32px',
                    }}>
                        <Bluetooth size={11} color="#2563EB" />
                        <span style={{ fontSize: '0.65rem', color: '#2563EB', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Bluetooth Pairing</span>
                    </div>

                    <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px',
                        animation: 'fade-in 0.35s ease both',
                    }}>
                        {renderContent()}
                    </div>
                </div>

                {/* Bottom tint */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '160px',
                    background: 'radial-gradient(ellipse at 50% 100%, rgba(37,99,235,0.04) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
            </div>
        </div>
    );
}

// ── Shared styles ──────────────────────────────────────────────────────────
const colorMap = {
    '#2563EB': { bg: 'rgba(37,99,235,0.07)', border: 'rgba(37,99,235,0.2)' },
    '#12A37A': { bg: 'rgba(18,163,122,0.07)', border: 'rgba(18,163,122,0.2)' },
    '#6D4ADE': { bg: 'rgba(109,74,222,0.07)', border: 'rgba(109,74,222,0.2)' },
};

const iconWrapStyle = (color) => ({
    width: '92px', height: '92px', borderRadius: '50%',
    background: (colorMap[color] || colorMap['#2563EB']).bg,
    border: `1.5px solid ${(colorMap[color] || colorMap['#2563EB']).border}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '4px',
});

const headingStyle = {
    fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)',
    letterSpacing: '-0.01em', textAlign: 'center',
};

const subStyle = {
    fontSize: '0.82rem', color: 'var(--text-secondary)', textAlign: 'center',
    lineHeight: 1.6, maxWidth: '280px',
};

const cardStyle = {
    width: '100%', padding: '14px 16px', borderRadius: 'var(--radius-md)',
    background: '#FFFFFF', border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-card)',
    display: 'flex', alignItems: 'center', gap: '8px',
    marginTop: '4px', transition: 'all 0.2s ease',
};

const btnStyle = (color) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    width: '100%', padding: '14px', borderRadius: 'var(--radius-md)',
    background: color,
    border: 'none',
    color: '#FFFFFF', fontFamily: 'var(--font-main)', fontWeight: 700,
    fontSize: '0.95rem', cursor: 'pointer', marginTop: '8px',
    transition: 'opacity 0.2s ease', letterSpacing: '0.02em',
    boxShadow: `0 4px 14px ${color}40`,
});

const ghostBtnStyle = {
    background: 'none', border: 'none', color: 'var(--text-muted)',
    fontFamily: 'var(--font-main)', fontSize: '0.8rem', cursor: 'pointer',
    marginTop: '4px', padding: '6px',
};

import React, { useState, useEffect, useRef } from 'react';
import { X, Wind } from 'lucide-react';

const PHASES = [
    { label: 'Inhale', duration: 4, color: '#2563EB', instruction: 'Breathe in slowly through your nose' },
    { label: 'Hold', duration: 7, color: '#6D4ADE', instruction: 'Hold your breath gently' },
    { label: 'Exhale', duration: 8, color: '#12A37A', instruction: 'Breathe out slowly through your mouth' },
];
const TOTAL = PHASES.reduce((s, p) => s + p.duration, 0); // 19s

export default function BreathingExercise({ onClose }) {
    const [cycleCount, setCycleCount] = useState(0);
    const [phaseIdx, setPhaseIdx] = useState(0);
    const [elapsed, setElapsed] = useState(0);       // seconds within current phase
    const [running, setRunning] = useState(false);
    const intervalRef = useRef(null);

    const phase = PHASES[phaseIdx];
    const progress = running ? elapsed / phase.duration : 0;   // 0..1
    const circumference = 2 * Math.PI * 58; // r=58

    useEffect(() => {
        if (!running) return;
        intervalRef.current = setInterval(() => {
            setElapsed(prev => {
                const next = prev + 0.05;
                if (next >= phase.duration) {
                    const nextIdx = (phaseIdx + 1) % PHASES.length;
                    setPhaseIdx(nextIdx);
                    if (nextIdx === 0) setCycleCount(c => c + 1);
                    return 0;
                }
                return next;
            });
        }, 50);
        return () => clearInterval(intervalRef.current);
    }, [running, phaseIdx, phase.duration]);

    const toggle = () => {
        if (running) {
            setRunning(false);
            setPhaseIdx(0);
            setElapsed(0);
        } else {
            setRunning(true);
        }
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0,
                background: 'rgba(26,34,51,0.35)',
                backdropFilter: 'blur(6px)',
                zIndex: 300,
                display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    width: '100%', maxWidth: '430px',
                    background: '#FFFFFF',
                    borderTop: `3px solid ${phase.color}`,
                    borderRadius: '24px 24px 0 0',
                    padding: '0 24px 36px',
                    animation: 'slide-up 0.32s cubic-bezier(0.4,0,0.2,1)',
                    maxHeight: '85vh', overflowY: 'auto',
                    boxShadow: '0 -4px 40px rgba(0,0,0,0.12)',
                }}
            >
                {/* Handle */}
                <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
                    <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'rgba(0,0,0,0.08)' }} />
                </div>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Wind size={20} color="#2563EB" strokeWidth={2} />
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1A2233' }}>4-7-8 Breathing</h2>
                    </div>
                    <button onClick={onClose} style={closeBtnStyle}>
                        <X size={16} color="#5A6880" />
                    </button>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#5A6880', marginBottom: '24px' }}>
                    A clinically proven technique to calm the autonomic nervous system and reduce cortisol.
                </p>

                {/* Cycle indicator */}
                {cycleCount > 0 && (
                    <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.72rem', background: '#F0FBF7', color: '#12A37A', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', border: '1px solid rgba(18,163,122,0.2)' }}>
                            Cycle {cycleCount} complete ✓
                        </span>
                    </div>
                )}

                {/* Breathing circle */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <div style={{ position: 'relative', width: '140px', height: '140px' }}>
                        <svg width="140" height="140" viewBox="0 0 140 140">
                            {/* Track */}
                            <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="8" />
                            {/* Progress */}
                            <circle
                                cx="70" cy="70" r="58"
                                fill="none"
                                stroke={phase.color}
                                strokeWidth="8"
                                strokeDasharray={circumference}
                                strokeDashoffset={circumference * (1 - progress)}
                                strokeLinecap="round"
                                transform="rotate(-90 70 70)"
                                style={{ transition: 'stroke-dashoffset 0.05s linear, stroke 0.6s ease' }}
                            />
                        </svg>
                        {/* Center content */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        }}>
                            {running ? (
                                <>
                                    <span style={{ fontSize: '2rem', fontWeight: 900, color: phase.color, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                                        {Math.ceil(phase.duration - elapsed)}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: phase.color, marginTop: '2px' }}>
                                        {phase.label}
                                    </span>
                                </>
                            ) : (
                                <span style={{ fontSize: '0.78rem', color: '#A0ABBE', fontWeight: 600 }}>Ready</span>
                            )}
                        </div>
                    </div>

                    {/* Phase label */}
                    <p style={{ fontSize: '0.82rem', color: '#5A6880', textAlign: 'center', minHeight: '20px' }}>
                        {running ? phase.instruction : 'Tap Start to begin guided breathing'}
                    </p>

                    {/* Phase steps */}
                    <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                        {PHASES.map((p, i) => (
                            <div key={p.label} style={{
                                flex: 1, textAlign: 'center', padding: '8px 4px',
                                borderRadius: '10px',
                                background: running && phaseIdx === i ? `${p.color}12` : 'rgba(0,0,0,0.03)',
                                border: `1px solid ${running && phaseIdx === i ? `${p.color}30` : 'transparent'}`,
                                transition: 'all 0.4s ease',
                            }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: running && phaseIdx === i ? p.color : '#A0ABBE', fontFamily: 'var(--font-mono)' }}>{p.duration}s</div>
                                <div style={{ fontSize: '0.6rem', fontWeight: 600, color: running && phaseIdx === i ? p.color : '#A0ABBE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{p.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <button
                        onClick={toggle}
                        style={{
                            width: '100%', padding: '14px',
                            borderRadius: '14px',
                            background: running ? 'rgba(220,38,38,0.07)' : phase.color,
                            border: running ? '1px solid rgba(220,38,38,0.2)' : 'none',
                            color: running ? '#DC2626' : '#FFFFFF',
                            fontFamily: 'var(--font-main)', fontWeight: 700,
                            fontSize: '0.95rem', cursor: 'pointer',
                            boxShadow: running ? 'none' : `0 4px 14px ${phase.color}40`,
                            transition: 'all 0.3s ease',
                        }}
                    >
                        {running ? 'Stop Session' : 'Start Breathing'}
                    </button>
                </div>
            </div>
        </div>
    );
}

const closeBtnStyle = {
    background: '#F4F7FB', border: '1px solid rgba(0,0,0,0.07)',
    borderRadius: '50%', width: '32px', height: '32px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
};

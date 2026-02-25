import React from 'react';
import { FlaskConical } from 'lucide-react';
import StressAnalysisPanel from '../components/StressAnalysisPanel';
import { useLiveData } from '../hooks/useLiveData';

export default function DemoPage() {
    const { getStressAnalysis } = useLiveData();

    return (
        <div style={{ padding: '0 0 32px', background: 'var(--bg-primary)' }}>
            {/* Header */}
            <div style={{ padding: '18px 20px 16px', background: '#FFFFFF', borderBottom: '1px solid var(--border)', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                            SAVR · Presentation
                        </p>
                        <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginTop: '1px' }}>
                            Stress Simulator
                        </h1>
                    </div>
                    <div style={{
                        width: '42px', height: '42px', borderRadius: '50%',
                        background: 'rgba(109,74,222,0.08)', border: '1px solid rgba(109,74,222,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <FlaskConical size={20} color="#6D4ADE" strokeWidth={2} />
                    </div>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    Tap the <strong style={{ color: 'var(--text-primary)' }}>LIVE</strong> button to cycle through stress scenarios for your demo.
                </p>
            </div>

            {/* Stress panel */}
            <StressAnalysisPanel getStressAnalysis={getStressAnalysis} />

            {/* How-to card */}
            <div style={{
                margin: '10px 14px 0',
                background: 'rgba(109,74,222,0.04)',
                border: '1px solid rgba(109,74,222,0.14)',
                borderRadius: '12px',
                padding: '14px 16px',
            }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6D4ADE', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    🎬 Demo Guide
                </p>
                {[
                    ['🟢 LIVE', 'Real sensor data — continuous monitoring'],
                    ['🟢 LOW', 'Score 22 — all vitals calm, no action needed'],
                    ['🟡 MOD', 'Score 56 — elevated stress, shows GP cards'],
                    ['🔴 HIGH', 'Score 83 — severe stress, hospitals + SOS'],
                ].map(([label, desc]) => (
                    <div key={label} style={{ display: 'flex', gap: '10px', marginBottom: '6px', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1A2233', flexShrink: 0, minWidth: '52px' }}>{label}</span>
                        <span style={{ fontSize: '0.7rem', color: '#5A6880' }}>{desc}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

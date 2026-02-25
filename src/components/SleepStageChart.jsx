import React from 'react';

const STAGES = [
    { key: 'awake', label: 'Awake', color: '#FF4D6D', pct: 8 },
    { key: 'n1', label: 'N1', color: '#7B61FF', pct: 12 },
    { key: 'n2', label: 'N2', color: '#4CC9F0', pct: 40 },
    { key: 'n3', label: 'N3 Deep', color: '#06FFA5', pct: 18 },
    { key: 'rem', label: 'REM', color: '#FFD60A', pct: 22 },
];

export default function SleepStageChart({ totalHours = 7.5 }) {
    return (
        <div style={{ width: '100%' }}>
            {/* Stacked bar */}
            <div style={{
                display: 'flex',
                height: '20px',
                borderRadius: '10px',
                overflow: 'hidden',
                gap: '1.5px',
                marginBottom: '10px',
            }}>
                {STAGES.map((s) => (
                    <div
                        key={s.key}
                        style={{
                            flex: s.pct,
                            background: s.color,
                            opacity: 0.85,
                            transition: 'flex 0.8s ease',
                        }}
                    />
                ))}
            </div>
            {/* Legend */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 10px' }}>
                {STAGES.map((s) => (
                    <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: s.color }} />
                        <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>
                            {s.label} <span style={{ color: s.color, fontWeight: 600 }}>{s.pct}%</span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

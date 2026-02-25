import React from 'react';

export default function BurnoutGauge({ value = 22 }) {
    const pct = Math.max(0, Math.min(100, value));
    const radius = 46;
    const circ = 2 * Math.PI * radius;
    const arcLen = circ * 0.75; // 270° arc
    const offset = arcLen - (pct / 100) * arcLen;

    // Calm clinical colour scale
    const color = pct < 30 ? '#12A37A' : pct < 70 ? '#D97706' : '#DC2626';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ position: 'relative', width: '110px', height: '90px' }}>
                <svg width="110" height="90" viewBox="0 0 110 100">
                    <defs>
                        <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#12A37A" />
                            <stop offset="50%" stopColor="#D97706" />
                            <stop offset="100%" stopColor="#DC2626" />
                        </linearGradient>
                    </defs>
                    {/* Track */}
                    <circle
                        cx="55" cy="58" r={radius}
                        fill="none"
                        stroke="rgba(0,0,0,0.07)"
                        strokeWidth="10"
                        strokeDasharray={`${arcLen} ${circ}`}
                        strokeDashoffset={circ * 0.125}
                        strokeLinecap="round"
                        transform="rotate(-225 55 58)"
                    />
                    {/* Value arc */}
                    <circle
                        cx="55" cy="58" r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth="10"
                        strokeDasharray={`${arcLen - offset} ${circ}`}
                        strokeDashoffset={circ * 0.125}
                        strokeLinecap="round"
                        transform="rotate(-225 55 58)"
                        style={{ transition: 'stroke-dasharray 0.8s ease, stroke 0.5s ease' }}
                    />
                    {/* Centre value */}
                    <text
                        x="55" y="60"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={color}
                        fontSize="16"
                        fontWeight="800"
                        fontFamily="Outfit, sans-serif"
                        style={{ transition: 'fill 0.5s ease' }}
                    >
                        {Math.round(pct)}%
                    </text>
                </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '90px', marginTop: '-8px' }}>
                <span style={{ fontSize: '0.58rem', color: '#12A37A', fontWeight: 600 }}>LOW</span>
                <span style={{ fontSize: '0.58rem', color: '#DC2626', fontWeight: 600 }}>HIGH</span>
            </div>
        </div>
    );
}

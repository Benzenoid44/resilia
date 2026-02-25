import React, { useState, useRef } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import { RISK_COLORS } from '../data/healthConfig';
import RiskBadge from './RiskBadge';
import ECGWave from './ECGWave';
import SleepStageChart from './SleepStageChart';
import BurnoutGauge from './BurnoutGauge';
import DetailModal from './DetailModal';

export default function HealthCard({ param, data }) {
    const [showModal, setShowModal] = useState(false);
    const [pressed, setPressed] = useState(false);

    const color = param.color;
    const riskColor = RISK_COLORS[data?.riskLevel] || '#A0ABBE';

    const displayValue = !data ? '--' :
        param.isSpecial === 'bp'
            ? `${data.value}/${data.diastolic}`
            : param.unit === 'steps'
                ? Number(data.value).toLocaleString()
                : data.value;

    const TrendIcon = !data || data.trend === 'stable' ? Minus
        : data.trend === 'up' ? TrendingUp : TrendingDown;
    const trendColor = !data || data.trend === 'stable' ? 'var(--text-muted)'
        : data.trend === 'up' ? '#DC2626' : '#2563EB';

    return (
        <>
            <div
                onClick={() => data && setShowModal(true)}
                onMouseDown={() => setPressed(true)}
                onMouseUp={() => setPressed(false)}
                onTouchStart={() => setPressed(true)}
                onTouchEnd={() => setPressed(false)}
                style={{
                    background: '#FFFFFF',
                    border: '1px solid var(--border)',
                    borderLeft: `3px solid ${riskColor}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    transform: pressed ? 'scale(0.97)' : 'scale(1)',
                    boxShadow: data?.riskLevel === 'critical'
                        ? `0 2px 16px rgba(220,38,38,0.10), 0 1px 6px rgba(0,0,0,0.05)`
                        : 'var(--shadow-card)',
                    animation: 'fade-in 0.4s ease both',
                }}
            >
                {/* Subtle top-right tint */}
                <div style={{
                    position: 'absolute',
                    top: 0, right: 0,
                    width: '60px', height: '60px',
                    background: `radial-gradient(circle at top right, ${color}0D, transparent 70%)`,
                    pointerEvents: 'none',
                }} />

                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <span style={{ fontSize: '1.1rem' }}>{param.icon}</span>
                        <div>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.01em' }}>
                                {param.shortName}
                            </div>
                            <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', marginTop: '0px' }}>
                                {param.name}
                            </div>
                        </div>
                    </div>
                    <RiskBadge riskLevel={data?.riskLevel || 'unknown'} />
                </div>

                {/* Special viz */}
                {param.isSpecial === 'ecg' && (
                    <div style={{ marginBottom: '6px' }}>
                        <ECGWave color={color} height={36} />
                    </div>
                )}
                {param.isSpecial === 'sleep' && (
                    <div style={{ marginBottom: '8px' }}>
                        <SleepStageChart totalHours={data?.value} />
                    </div>
                )}
                {param.isSpecial === 'burnout' && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                        <BurnoutGauge value={data?.value ?? 22} />
                    </div>
                )}

                {/* Value */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                        <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: param.isSpecial === 'bp' ? '1.35rem' : '1.6rem',
                            fontWeight: 800,
                            color: color,
                            letterSpacing: '-0.02em',
                            transition: 'color 0.3s ease',
                            // No neon glow — let the color speak for itself
                        }}>
                            {displayValue}
                        </span>
                        <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginLeft: '3px' }}>{param.unit}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', opacity: 0.75 }}>
                        <TrendIcon size={12} color={trendColor} />
                    </div>
                </div>

                {/* Sparkline */}
                {!param.isSpecial && data?.history && (
                    <div style={{ height: '32px', marginBottom: '6px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.history.slice(-30)}>
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke={color}
                                    strokeWidth={1.5}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Range footer */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--border)',
                }}>
                    <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)' }}>
                        Normal: <span style={{ color: 'var(--text-secondary)' }}>{param.normalLabel}</span>
                    </span>
                    <ChevronRight size={12} color="var(--text-muted)" />
                </div>
            </div>

            {showModal && data && (
                <DetailModal param={param} data={data} onClose={() => setShowModal(false)} />
            )}
        </>
    );
}

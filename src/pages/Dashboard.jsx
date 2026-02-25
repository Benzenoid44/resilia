import React from 'react';
import { RefreshCw, Heart } from 'lucide-react';
import { HEALTH_PARAMS } from '../data/healthConfig';
import { useLiveData } from '../hooks/useLiveData';
import HealthCard from '../components/HealthCard';
import StressAnalysisPanel from '../components/StressAnalysisPanel';

export default function Dashboard() {
    const { liveData, getOverallRisk, getWellnessScore, getStressAnalysis } = useLiveData();
    const overallRisk = getOverallRisk();
    const wellnessScore = getWellnessScore();

    // Calm clinical accent colours for the wellness banner
    const riskConfig = {
        normal: { color: '#12A37A', bg: '#F0FBF7', border: 'rgba(18,163,122,0.2)', label: 'All Vitals Normal' },
        warning: { color: '#D97706', bg: '#FFFBF0', border: 'rgba(217,119,6,0.2)', label: 'Caution Alerts' },
        critical: { color: '#DC2626', bg: '#FFF5F5', border: 'rgba(220,38,38,0.2)', label: 'Critical Alerts' },
    };
    const rc = riskConfig[overallRisk] || riskConfig.normal;

    const criticals = HEALTH_PARAMS.filter(p => liveData[p.id]?.riskLevel === 'critical');
    const warnings = HEALTH_PARAMS.filter(p => liveData[p.id]?.riskLevel === 'warning');

    return (
        <div style={{ padding: '0 0 20px', background: 'var(--bg-primary)' }}>
            {/* Header */}
            <div style={{ padding: '18px 20px 16px', background: '#FFFFFF', borderBottom: '1px solid var(--border)', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                        <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                            Welcome back
                        </p>
                        <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginTop: '1px' }}>
                            Health Dashboard
                        </h1>
                    </div>
                    <div style={{
                        width: '42px', height: '42px',
                        borderRadius: '50%',
                        background: 'rgba(37,99,235,0.08)',
                        border: '1px solid rgba(37,99,235,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Heart size={20} color="var(--blue)" strokeWidth={2} />
                    </div>
                </div>

                {/* Wellness Summary Card */}
                <div style={{
                    background: rc.bg,
                    border: `1px solid ${rc.border}`,
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    <div>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, marginBottom: '4px' }}>
                            Overall Wellness
                        </p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                            <span style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '2.6rem',
                                fontWeight: 800,
                                color: rc.color,
                                lineHeight: 1,
                            }}>
                                {wellnessScore}
                            </span>
                            <span style={{ fontSize: '1rem', color: rc.color, fontWeight: 600, opacity: 0.7 }}>/100</span>
                        </div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            {overallRisk === 'normal'
                                ? '✓ All vitals within normal range'
                                : overallRisk === 'warning'
                                    ? `⚠ ${warnings.length} parameter${warnings.length > 1 ? 's' : ''} need attention`
                                    : `! ${criticals.length} critical alert${criticals.length > 1 ? 's' : ''}`}
                        </p>
                    </div>

                    {/* Score ring */}
                    <svg width="68" height="68" viewBox="0 0 72 72">
                        <circle cx="36" cy="36" r="30" fill="none" stroke={`${rc.color}20`} strokeWidth="6" />
                        <circle
                            cx="36" cy="36" r="30"
                            fill="none"
                            stroke={rc.color}
                            strokeWidth="6"
                            strokeDasharray={`${(wellnessScore / 100) * 188} 188`}
                            strokeDashoffset="47"
                            strokeLinecap="round"
                            transform="rotate(-90 36 36)"
                            style={{ transition: 'stroke-dasharray 0.8s ease' }}
                        />
                        <text x="36" y="40" textAnchor="middle" fill={rc.color} fontSize="11" fontWeight="800" fontFamily="Outfit">
                            {overallRisk === 'normal' ? '✓' : overallRisk === 'warning' ? '!' : '!!'}
                        </text>
                    </svg>
                </div>

                {/* Alert banner */}
                {(criticals.length > 0 || warnings.length > 0) && (
                    <div style={{
                        marginTop: '10px',
                        background: 'rgba(220,38,38,0.05)',
                        border: '1px solid rgba(220,38,38,0.15)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}>
                        <span style={{ fontSize: '0.85rem' }}>⚠</span>
                        <p style={{ fontSize: '0.7rem', color: '#B91C1C', lineHeight: 1.5 }}>
                            {criticals.length > 0 && <><strong>{criticals.map(p => p.shortName).join(', ')}</strong> {criticals.length > 1 ? 'are' : 'is'} in critical range. </>}
                            {warnings.length > 0 && <span>{warnings.map(p => p.shortName).join(', ')} need{warnings.length === 1 ? 's' : ''} attention.</span>}
                        </p>
                    </div>
                )}
            </div>

            {/* Stress Analysis Panel */}
            <StressAnalysisPanel getStressAnalysis={getStressAnalysis} />

            {/* Cards Grid */}
            <div style={{ padding: '0 14px' }}>
                <SectionHeader label="Cardiac" icon="❤️" />
                <div style={gridStyle}>
                    {HEALTH_PARAMS.filter(p => p.category === 'cardiac').map(param => (
                        <HealthCard key={param.id} param={param} data={liveData[param.id]} />
                    ))}
                </div>

                <SectionHeader label="Vitals" icon="🌡️" />
                <div style={gridStyle}>
                    {HEALTH_PARAMS.filter(p => p.category === 'vitals').map(param => (
                        <HealthCard key={param.id} param={param} data={liveData[param.id]} />
                    ))}
                </div>

                <SectionHeader label="Sleep" icon="🌙" />
                <div style={gridStyle}>
                    {HEALTH_PARAMS.filter(p => p.category === 'sleep').map(param => (
                        <HealthCard key={param.id} param={param} data={liveData[param.id]} />
                    ))}
                </div>

                <SectionHeader label="Neuro & Stress" icon="🧠" />
                <div style={gridStyle}>
                    {HEALTH_PARAMS.filter(p => p.category === 'neuro' || p.category === 'stress').map(param => (
                        <HealthCard key={param.id} param={param} data={liveData[param.id]} />
                    ))}
                </div>

                <SectionHeader label="Metabolic & Fitness" icon="🏃" />
                <div style={gridStyle}>
                    {HEALTH_PARAMS.filter(p => p.category === 'metabolic' || p.category === 'fitness').map(param => (
                        <HealthCard key={param.id} param={param} data={liveData[param.id]} />
                    ))}
                </div>

                {/* Last sync */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '16px', opacity: 0.55 }}>
                    <RefreshCw size={10} color="var(--text-muted)" />
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        LIVE · SAVR PATCH · syncing
                    </span>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--green)', animation: 'pulse-dot 1.5s infinite' }} />
                </div>
            </div>
        </div>
    );
}

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '8px',
};

function SectionHeader({ label, icon }) {
    return (
        <div style={{ marginBottom: '10px', marginTop: '18px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '1rem' }}>{icon}</span>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {label}
            </p>
        </div>
    );
}

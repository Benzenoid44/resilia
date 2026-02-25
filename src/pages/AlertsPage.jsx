import React, { useState, useEffect, useCallback } from 'react';
import {
    Bell, Wind, Coffee, Users, Siren,
    Pill, MapPin, Phone, Building2,
    Activity, ChevronRight, Clock, TrendingUp,
} from 'lucide-react';
import { useLiveData } from '../hooks/useLiveData';
import { STRESS_CONFIG } from '../data/stressEngine';
import { HEALTH_PARAMS } from '../data/healthConfig';
import BreathingExercise from '../components/BreathingExercise';
import SOSModal from '../components/SOSModal';

/* ── Arc gauge (small) ──────────────────────────────────────────── */
const RADIUS = 40;
const CIRC = 2 * Math.PI * RADIUS;
const ARC = CIRC * (240 / 360);

function MiniArc({ score, color }) {
    const filled = ARC * (score / 100);
    return (
        <svg width="96" height="76" viewBox="0 0 96 76">
            <defs>
                <linearGradient id="mini-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#12A37A" />
                    <stop offset="50%" stopColor="#D97706" />
                    <stop offset="100%" stopColor="#DC2626" />
                </linearGradient>
            </defs>
            <circle cx="48" cy="50" r={RADIUS}
                fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="7"
                strokeDasharray={`${ARC} ${CIRC}`}
                strokeDashoffset={CIRC * 0.333}
                strokeLinecap="round"
                transform="rotate(150 48 50)"
            />
            <circle cx="48" cy="50" r={RADIUS}
                fill="none" stroke="url(#mini-grad)" strokeWidth="7"
                strokeDasharray={`${filled} ${CIRC}`}
                strokeDashoffset={CIRC * 0.333}
                strokeLinecap="round"
                transform="rotate(150 48 50)"
                style={{ transition: 'stroke-dasharray 0.8s ease' }}
            />
            <text x="48" y="52" textAnchor="middle"
                fill={color} fontSize="17" fontWeight="900"
                fontFamily="JetBrains Mono, monospace">
                {score}
            </text>
        </svg>
    );
}

/* ── Action card row ───────────────────────────────────────────── */
function ActionRow({ icon, label, sub, color, onClick }) {
    return (
        <div onClick={onClick} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '11px 14px', borderRadius: '12px', marginBottom: '8px',
            background: '#FAFBFD', border: `1px solid rgba(0,0,0,0.07)`,
            borderLeft: `3px solid ${color}`,
            cursor: onClick ? 'pointer' : 'default',
        }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {icon}
            </div>
            <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1A2233' }}>{label}</p>
                {sub && <p style={{ fontSize: '0.65rem', color: '#5A6880', marginTop: '1px' }}>{sub}</p>}
            </div>
            {onClick && <ChevronRight size={14} color="#A0ABBE" />}
        </div>
    );
}

/* ── Parameter alert row ───────────────────────────────────────── */
function ParamAlert({ param, data }) {
    const isWarning = data?.riskLevel === 'warning';
    const isCritical = data?.riskLevel === 'critical';
    const color = isCritical ? '#DC2626' : '#D97706';
    const bg = isCritical ? '#FFF5F5' : '#FFFBF0';
    const border = isCritical ? 'rgba(220,38,38,0.2)' : 'rgba(217,119,6,0.2)';

    return (
        <div style={{
            padding: '10px 14px', borderRadius: '10px', marginBottom: '8px',
            background: bg, border: `1px solid ${border}`,
            borderLeft: `3px solid ${color}`,
            display: 'flex', alignItems: 'center', gap: '10px',
        }}>
            <span style={{ fontSize: '1.1rem' }}>{param.icon}</span>
            <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1A2233' }}>{param.name}</p>
                <p style={{ fontSize: '0.65rem', color: '#5A6880', marginTop: '1px' }}>
                    {isCritical ? 'Critical' : 'Caution'} · {param.normalLabel}
                </p>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 800, color }}>
                {data?.value}{param.unit === 'steps' ? '' : ` ${param.unit}`}
            </div>
        </div>
    );
}

/* ── Timestamp helper ──────────────────────────────────────────── */
function now() {
    return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

/* ── Main page ─────────────────────────────────────────────────── */
export default function AlertsPage() {
    const { liveData, getStressAnalysis } = useLiveData();
    const [analysis, setAnalysis] = useState(() => getStressAnalysis());
    const [showBreathing, setShowBreathing] = useState(false);
    const [showSOS, setShowSOS] = useState(false);
    const [mbActive, setMbActive] = useState(false);
    const [mbTime, setMbTime] = useState(300);
    const [ts] = useState(now());

    useEffect(() => {
        const id = setInterval(() => setAnalysis(getStressAnalysis()), 2000);
        return () => clearInterval(id);
    }, [getStressAnalysis]);

    useEffect(() => {
        if (!mbActive) {
            const timer = setTimeout(() => setMbTime(300), 0);
            return () => clearTimeout(timer);
        }
        const id = setInterval(() => setMbTime(t => { if (t <= 1) { setMbActive(false); return 300; } return t - 1; }), 1000);
        return () => clearInterval(id);
    }, [mbActive]);

    const { score, level, topFactors } = analysis;
    const cfg = STRESS_CONFIG[level];
    const fmtMb = `${Math.floor(mbTime / 60)}:${String(mbTime % 60).padStart(2, '0')}`;

    const critParams = HEALTH_PARAMS.filter(p => liveData[p.id]?.riskLevel === 'critical');
    const warnParams = HEALTH_PARAMS.filter(p => liveData[p.id]?.riskLevel === 'warning');
    const abnormalAll = [...critParams, ...warnParams];

    const renderActions = () => {
        if (level === 'low') return (
            <>
                <ActionRow icon={<Activity size={17} color="#12A37A" />} label="Live Dashboard Active" sub="All vitals within normal range · Monitoring continuous" color="#12A37A" />
            </>
        );

        if (level === 'moderate') return (
            <>
                <div style={{ padding: '10px 14px', borderRadius: '10px', marginBottom: '8px', background: '#FFFBF0', border: '1px solid rgba(217,119,6,0.25)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Bell size={18} color="#D97706" />
                    <p style={{ fontSize: '0.76rem', color: '#D97706', fontWeight: 700 }}>Stress elevated — action recommended</p>
                </div>
                <ActionRow icon={<Wind size={17} color="#2563EB" />} label="Breathing Exercise" sub="4-7-8 technique · ~2 min" color="#2563EB" onClick={() => setShowBreathing(true)} />
                <ActionRow icon={<Coffee size={17} color="#12A37A" />} label="Micro-break Reminder" sub={mbActive ? `Break active · ${fmtMb} left` : 'Step away for 5 min'} color="#12A37A" onClick={() => setMbActive(a => !a)} />
                <ActionRow icon={<Users size={17} color="#6D4ADE" />} label="Peer Support" sub="Message a trusted contact" color="#6D4ADE" onClick={() => window.open('sms:', '_self')} />
            </>
        );

        // severe
        return (
            <>
                <div style={{ padding: '12px 16px', borderRadius: '12px', marginBottom: '10px', background: '#FFF5F5', border: '1.5px solid rgba(220,38,38,0.3)', display: 'flex', alignItems: 'center', gap: '12px', animation: 'pulse-dot 1.2s infinite' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Siren size={20} color="#fff" />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.82rem', fontWeight: 800, color: '#DC2626' }}>Severe Stress — Immediate Action</p>
                        <p style={{ fontSize: '0.65rem', color: '#B91C1C' }}>SOS functions activated below</p>
                    </div>
                </div>
                <ActionRow icon={<Pill size={17} color="#6D4ADE" />} label="Medication Guidance" sub="Review your prescribed medication" color="#6D4ADE" onClick={() => setShowSOS(true)} />
                <ActionRow icon={<MapPin size={17} color="#2563EB" />} label="Share Location" sub="Send live location to emergency contact" color="#2563EB" onClick={() => setShowSOS(true)} />
                <ActionRow icon={<Building2 size={17} color="#12A37A" />} label="Nearby Hospital" sub="City Medical Center · 1.2 km" color="#12A37A" onClick={() => setShowSOS(true)} />
                <button onClick={() => setShowSOS(true)} style={{
                    width: '100%', padding: '13px', borderRadius: '12px',
                    background: '#DC2626', border: 'none', color: '#fff',
                    fontFamily: 'var(--font-main)', fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 4px 18px rgba(220,38,38,0.3)',
                }}>
                    <Phone size={16} color="#fff" fill="#fff" /> Open SOS Panel
                </button>
            </>
        );
    };

    return (
        <>
            <div style={{ padding: '0 0 24px', background: 'var(--bg-primary)' }}>
                {/* Header */}
                <div style={{ padding: '18px 20px 14px', background: '#FFFFFF', borderBottom: '1px solid var(--border)', marginBottom: '14px' }}>
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Health Monitoring</p>
                    <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginTop: '1px' }}>Alerts & Analysis</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
                        <Clock size={11} color="var(--text-muted)" />
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Last updated: {ts}</span>
                    </div>
                </div>

                <div style={{ padding: '0 16px' }}>
                    {/* ── Stress analysis card ────────────────────────────── */}
                    <div style={{
                        background: '#FFFFFF', border: `1px solid ${cfg.border}`,
                        borderTop: `3px solid ${cfg.color}`,
                        borderRadius: '16px', padding: '16px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                        marginBottom: '14px',
                    }}>
                        {/* Title row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                            <div>
                                <p style={{ fontSize: '0.65rem', color: '#A0ABBE', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>AI Stress Analysis</p>
                                <p style={{ fontSize: '0.7rem', color: '#5A6880', marginTop: '1px' }}>{cfg.tagline}</p>
                            </div>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '5px',
                                background: cfg.bg, border: `1px solid ${cfg.border}`,
                                borderRadius: '20px', padding: '4px 10px',
                            }}>
                                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: cfg.color, animation: 'pulse-dot 1.8s infinite' }} />
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{cfg.label}</span>
                            </div>
                        </div>

                        {/* Arc + factors */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                            <MiniArc score={score} color={cfg.color} />
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.6rem', fontWeight: 700, color: '#A0ABBE', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Top Drivers</p>
                                {topFactors.map(f => (
                                    <div key={f.id} style={{ marginBottom: '6px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                            <span style={{ fontSize: '0.65rem', color: '#5A6880' }}>{f.label}</span>
                                            <span style={{ fontSize: '0.65rem', color: cfg.color, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{f.pct}%</span>
                                        </div>
                                        <div style={{ height: '3px', background: 'rgba(0,0,0,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${Math.min(100, f.pct)}%`, background: cfg.color, borderRadius: '3px', transition: 'width 0.8s ease' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', marginBottom: '12px' }} />

                        {/* Actions */}
                        <p style={{ fontSize: '0.62rem', fontWeight: 700, color: '#A0ABBE', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>
                            {level === 'low' ? 'Status' : level === 'moderate' ? 'Recommended Actions' : 'Immediate Actions'}
                        </p>
                        {renderActions()}
                    </div>

                    {/* ── Parameter alerts ────────────────────────────────── */}
                    {abnormalAll.length > 0 ? (
                        <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <Bell size={15} color="#DC2626" />
                                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1A2233' }}>
                                    {abnormalAll.length} Vital{abnormalAll.length > 1 ? 's' : ''} Need Attention
                                </p>
                            </div>
                            {critParams.map(p => <ParamAlert key={p.id} param={p} data={liveData[p.id]} />)}
                            {warnParams.map(p => <ParamAlert key={p.id} param={p} data={liveData[p.id]} />)}
                        </div>
                    ) : (
                        <div style={{ background: '#F0FBF7', border: '1px solid rgba(18,163,122,0.2)', borderRadius: '16px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                            <p style={{ fontSize: '1.5rem', marginBottom: '6px' }}>✓</p>
                            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#12A37A' }}>All Vitals Normal</p>
                            <p style={{ fontSize: '0.7rem', color: '#5A6880', marginTop: '3px' }}>No alerts at this time · Monitoring active</p>
                        </div>
                    )}
                </div>
            </div>

            {showBreathing && <BreathingExercise onClose={() => setShowBreathing(false)} />}
            {showSOS && <SOSModal onClose={() => setShowSOS(false)} />}
        </>
    );
}

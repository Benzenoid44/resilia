import React, { useState, useEffect, useRef } from 'react';
import {
    Wind, Coffee, Users, Bell, Siren,
    Pill, MapPin, Phone, Building2, User,
    Activity, ChevronRight, TrendingUp,
} from 'lucide-react';
import { STRESS_CONFIG } from '../data/stressEngine';
import BreathingExercise from './BreathingExercise';
import SOSModal from './SOSModal';

/* ── Arc gauge helpers ─────────────────────────────────────────── */
const RADIUS = 54;
const STROKE = 9;
const CIRC = 2 * Math.PI * RADIUS;
// 240° arc (start at 150°, end at 30°)
const ARC_DEG = 240;
const ARC_LEN = CIRC * (ARC_DEG / 360);

function ArcGauge({ score, color }) {
    const filled = ARC_LEN * (score / 100);
    return (
        <svg width="130" height="100" viewBox="0 0 130 100">
            <defs>
                <linearGradient id="stress-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#12A37A" />
                    <stop offset="50%" stopColor="#D97706" />
                    <stop offset="100%" stopColor="#DC2626" />
                </linearGradient>
            </defs>
            {/* Track */}
            <circle cx="65" cy="65" r={RADIUS}
                fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth={STROKE}
                strokeDasharray={`${ARC_LEN} ${CIRC}`}
                strokeDashoffset={CIRC * 0.333}
                strokeLinecap="round"
                transform="rotate(150 65 65)"
            />
            {/* Value arc */}
            <circle cx="65" cy="65" r={RADIUS}
                fill="none" stroke="url(#stress-grad)" strokeWidth={STROKE}
                strokeDasharray={`${filled} ${CIRC}`}
                strokeDashoffset={CIRC * 0.333}
                strokeLinecap="round"
                transform="rotate(150 65 65)"
                style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)' }}
            />
            {/* Score number */}
            <text x="65" y="62" textAnchor="middle"
                fill={color} fontSize="22" fontWeight="900"
                fontFamily="JetBrains Mono, monospace"
                style={{ transition: 'fill 0.5s' }}>
                {score}
            </text>
            <text x="65" y="75" textAnchor="middle"
                fill="#A0ABBE" fontSize="9" fontWeight="600"
                fontFamily="Outfit, sans-serif" letterSpacing="1">
                /100
            </text>
        </svg>
    );
}

/* ── Factor bar ────────────────────────────────────────────────── */
function FactorBar({ label, pct, color }) {
    return (
        <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span style={{ fontSize: '0.68rem', color: '#5A6880', fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: '0.68rem', color, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{pct}%</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(0,0,0,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                    height: '100%', width: `${Math.min(100, pct)}%`,
                    background: color, borderRadius: '4px',
                    transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                }} />
            </div>
        </div>
    );
}

/* ── Action card ───────────────────────────────────────────────── */
function ActionCard({ icon, title, subtitle, color, onClick, pulse }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px', borderRadius: '12px',
                background: hovered ? `${color}10` : '#FAFBFD',
                border: `1px solid ${hovered ? `${color}30` : 'rgba(0,0,0,0.07)'}`,
                borderLeft: `3px solid ${color}`,
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                marginBottom: '8px',
                animation: pulse ? 'pulse-ring 2s ease-out infinite' : 'none',
            }}
        >
            <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: `${color}14`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
            }}>
                {icon}
            </div>
            <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1A2233' }}>{title}</p>
                {subtitle && <p style={{ fontSize: '0.65rem', color: '#5A6880', marginTop: '1px' }}>{subtitle}</p>}
            </div>
            {onClick && <ChevronRight size={14} color="#A0ABBE" />}
        </div>
    );
}

/* ── Main panel ────────────────────────────────────────────────── */
export default function StressAnalysisPanel({ getStressAnalysis }) {
    const [analysis, setAnalysis] = useState(() => getStressAnalysis());
    const [showBreathing, setShowBreathing] = useState(false);
    const [showSOS, setShowSOS] = useState(false);
    const [microBreakActive, setMicroBreakActive] = useState(false);
    const [mbTime, setMbTime] = useState(300); // 5 min countdown
    const intervalRef = useRef(null);

    // Refresh stress analysis every 2s
    useEffect(() => {
        const id = setInterval(() => {
            setAnalysis(getStressAnalysis());
        }, 2000);
        return () => clearInterval(id);
    }, [getStressAnalysis]);

    // Micro-break countdown
    useEffect(() => {
        if (!microBreakActive) { clearInterval(intervalRef.current); setMbTime(300); return; }
        intervalRef.current = setInterval(() => {
            setMbTime(t => { if (t <= 1) { setMicroBreakActive(false); return 300; } return t - 1; });
        }, 1000);
        return () => clearInterval(intervalRef.current);
    }, [microBreakActive]);

    const { score, level, topFactors } = analysis;
    const cfg = STRESS_CONFIG[level];

    const fmtMb = `${Math.floor(mbTime / 60)}:${String(mbTime % 60).padStart(2, '0')}`;

    /* ── Action sections per level ─────────────────────────────── */
    const renderActions = () => {
        if (level === 'low') {
            return (
                <div style={{ marginTop: '14px' }}>
                    <ActionLabel label="Status" />
                    <ActionCard
                        icon={<Activity size={18} color="#12A37A" />}
                        title="Live Dashboard Active"
                        subtitle="All parameters within normal range · Continuous monitoring on"
                        color="#12A37A"
                    />
                </div>
            );
        }

        if (level === 'moderate') {
            return (
                <div style={{ marginTop: '14px' }}>
                    <ActionLabel label="Recommended Actions" />
                    <ActionCard
                        icon={<Bell size={18} color="#D97706" />}
                        title="Alert Notification"
                        subtitle="Elevated stress detected — consider a break"
                        color="#D97706"
                        pulse
                    />
                    <ActionCard
                        icon={<Wind size={18} color="#2563EB" />}
                        title="Breathing Exercise"
                        subtitle="4-7-8 technique · ~2 min · clinically proven"
                        color="#2563EB"
                        onClick={() => setShowBreathing(true)}
                    />
                    <ActionCard
                        icon={<Coffee size={18} color="#12A37A" />}
                        title="Micro-break Reminder"
                        subtitle={microBreakActive
                            ? `Break active · ${fmtMb} remaining`
                            : 'Step away for 5 minutes · hydrate'}
                        color="#12A37A"
                        onClick={() => setMicroBreakActive(a => !a)}
                    />
                    <ActionCard
                        icon={<Users size={18} color="#6D4ADE" />}
                        title="Peer Support"
                        subtitle="Reach out to a trusted contact"
                        color="#6D4ADE"
                        onClick={() => window.open('sms:', '_self')}
                    />

                    {/* Nearby Doctors */}
                    <ActionLabel label="Nearby Doctors" />
                    <NearbyDoctorCard
                        name="Dr. Sanjay Mehta"
                        specialty="General Physician"
                        distance="0.8 km"
                        phone="+91 98100 11223"
                        available
                    />
                    <NearbyDoctorCard
                        name="Dr. Priya Iyer"
                        specialty="General Practitioner"
                        distance="1.4 km"
                        phone="+91 98200 44556"
                        available
                    />
                </div>
            );
        }

        // severe
        return (
            <div style={{ marginTop: '14px' }}>
                <ActionLabel label="Immediate Actions Required" />
                {/* Loud Alert pulsing */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px', borderRadius: '12px', marginBottom: '8px',
                    background: '#FFF5F5', border: '1.5px solid rgba(220,38,38,0.3)',
                    animation: 'pulse-dot 1s infinite',
                }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Siren size={18} color="#fff" />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.82rem', fontWeight: 800, color: '#DC2626' }}>Severe Stress Detected</p>
                        <p style={{ fontSize: '0.65rem', color: '#B91C1C' }}>Immediate attention required</p>
                    </div>
                </div>
                <ActionCard
                    icon={<Pill size={18} color="#6D4ADE" />}
                    title="Medication Guidance"
                    subtitle="Review your prescribed medication"
                    color="#6D4ADE"
                    onClick={() => setShowSOS(true)}
                />
                <ActionCard
                    icon={<MapPin size={18} color="#2563EB" />}
                    title="Share Location"
                    subtitle="Send your location to emergency contact"
                    color="#2563EB"
                    onClick={() => setShowSOS(true)}
                />

                {/* Nearby Doctors */}
                <ActionLabel label="Nearby Doctors & Hospitals" />
                <NearbyDoctorCard
                    name="City Medical Center"
                    specialty="Emergency & Cardiology"
                    distance="1.2 km"
                    phone="+91 11 2345 6789"
                    available
                    isHospital
                />
                <NearbyDoctorCard
                    name="Dr. Arvind Rao"
                    specialty="Cardiologist"
                    distance="1.8 km"
                    phone="+91 98300 77889"
                    available
                />
                <NearbyDoctorCard
                    name="Dr. Neha Kapoor"
                    specialty="Psychiatrist · Stress Specialist"
                    distance="2.1 km"
                    phone="+91 98400 22334"
                    available={false}
                />

                <button
                    onClick={() => setShowSOS(true)}
                    style={{
                        width: '100%', padding: '14px', borderRadius: '12px',
                        background: '#DC2626', border: 'none',
                        color: '#fff', fontFamily: 'var(--font-main)',
                        fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        boxShadow: '0 4px 20px rgba(220,38,38,0.35)',
                        marginTop: '4px',
                    }}
                >
                    <Phone size={16} color="#fff" fill="#fff" />
                    Open SOS Panel
                </button>
            </div>
        );
    };

    return (
        <>
            <div style={{
                margin: '0 14px 6px',
                background: '#FFFFFF',
                border: `1px solid ${cfg.border}`,
                borderTop: `3px solid ${cfg.color}`,
                borderRadius: '16px',
                padding: '16px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                animation: 'fade-in 0.4s ease both',
            }}>
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                        <p style={{ fontSize: '0.65rem', color: '#A0ABBE', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                            AI Stress Analysis
                        </p>
                        <p style={{ fontSize: '0.7rem', color: '#5A6880', marginTop: '2px' }}>
                            {cfg.tagline}
                        </p>
                    </div>
                    {/* Level badge */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        background: cfg.bg, border: `1px solid ${cfg.border}`,
                        borderRadius: '20px', padding: '4px 10px',
                    }}>
                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: cfg.color, animation: 'pulse-dot 1.8s infinite' }} />
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            {cfg.label}
                        </span>
                    </div>
                </div>

                {/* Gauge + factors */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <ArcGauge score={score} color={cfg.color} />

                    <div style={{ flex: 1, paddingTop: '6px' }}>
                        <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#A0ABBE', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                            Top Drivers
                        </p>
                        {topFactors.length > 0
                            ? topFactors.map(f => (
                                <FactorBar key={f.id} label={f.label} pct={f.pct} color={cfg.color} />
                            ))
                            : <p style={{ fontSize: '0.72rem', color: '#A0ABBE' }}>No significant contributors</p>
                        }
                    </div>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '12px 0 0' }} />

                {/* Action flows */}
                {renderActions()}
            </div>

            {/* Modals */}
            {showBreathing && <BreathingExercise onClose={() => setShowBreathing(false)} />}
            {showSOS && <SOSModal onClose={() => setShowSOS(false)} />}
        </>
    );
}

function ActionLabel({ label }) {
    return (
        <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#A0ABBE', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>
            {label}
        </p>
    );
}

/* ── Nearby Doctor Card ─────────────────────────────────────────── */
function NearbyDoctorCard({ name, specialty, distance, phone, available, isHospital }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '12px',
            background: '#FAFBFD',
            border: '1px solid rgba(0,0,0,0.07)',
            borderLeft: `3px solid ${isHospital ? '#DC2626' : '#2563EB'}`,
            marginBottom: '8px',
        }}>
            <div style={{
                width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                background: isHospital ? 'rgba(220,38,38,0.08)' : 'rgba(37,99,235,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                {isHospital
                    ? <Building2 size={18} color="#DC2626" />
                    : <User size={18} color="#2563EB" />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.76rem', fontWeight: 700, color: '#1A2233', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</p>
                <p style={{ fontSize: '0.63rem', color: '#5A6880', marginTop: '1px' }}>{specialty}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <MapPin size={10} color="#A0ABBE" />
                    <span style={{ fontSize: '0.6rem', color: '#A0ABBE' }}>{distance}</span>
                    <span style={{
                        fontSize: '0.58rem', fontWeight: 700,
                        color: available ? '#12A37A' : '#D97706',
                        background: available ? 'rgba(18,163,122,0.08)' : 'rgba(217,119,6,0.08)',
                        padding: '1px 6px', borderRadius: '10px',
                    }}>{available ? 'Available Now' : 'By Appointment'}</span>
                </div>
            </div>
            <a
                href={`tel:${phone}`}
                style={{
                    width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                    background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    textDecoration: 'none',
                }}
                title={`Call ${name}`}
            >
                <Phone size={14} color="#fff" fill="#fff" />
            </a>
        </div>
    );
}

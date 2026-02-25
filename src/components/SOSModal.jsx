import React, { useEffect, useRef } from 'react';
import { X, Siren, MapPin, Phone, Building2, Pill } from 'lucide-react';

// Simulated nearest hospital
const HOSPITAL = { name: 'City Medical Center', distance: '1.2 km', address: '14 Health Ave, Sector 5' };
const EMERGENCY_NUMBER = '112';

export default function SOSModal({ onClose }) {
    const audioRef = useRef(null);

    // Play an alert beep on mount using Web Audio API
    useEffect(() => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const playBeep = (freq, start, dur) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = freq;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.3, ctx.currentTime + start);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
                osc.start(ctx.currentTime + start);
                osc.stop(ctx.currentTime + start + dur);
            };
            playBeep(880, 0, 0.18);
            playBeep(880, 0.22, 0.18);
            playBeep(880, 0.44, 0.35);
        } catch (_) { /* audio not available — silently ignore */ }
    }, []);

    const shareLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                const { latitude: lat, longitude: lng } = pos.coords;
                window.open(`https://maps.google.com/?q=${lat},${lng}`, '_blank');
            }, () => {
                window.open('https://maps.google.com/', '_blank');
            });
        } else {
            window.open('https://maps.google.com/', '_blank');
        }
    };

    const openHospital = () => {
        window.open(`https://maps.google.com/?q=${encodeURIComponent(HOSPITAL.name)}`, '_blank');
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0,
                background: 'rgba(220,38,38,0.15)',
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
                    borderTop: '3px solid #DC2626',
                    borderRadius: '24px 24px 0 0',
                    padding: '0 20px 36px',
                    animation: 'slide-up 0.32s cubic-bezier(0.4,0,0.2,1)',
                    maxHeight: '88vh', overflowY: 'auto',
                    boxShadow: '0 -4px 40px rgba(220,38,38,0.2)',
                }}
            >
                {/* Handle */}
                <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
                    <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'rgba(0,0,0,0.08)' }} />
                </div>

                {/* SOS Banner */}
                <div style={{
                    background: '#FFF5F5', border: '1px solid rgba(220,38,38,0.2)',
                    borderRadius: '14px', padding: '14px 16px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    marginBottom: '20px',
                    animation: 'pulse-dot 1.4s infinite',
                }}>
                    <div style={{
                        width: '44px', height: '44px', borderRadius: '50%',
                        background: '#DC2626',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, boxShadow: '0 0 0 6px rgba(220,38,38,0.15)',
                    }}>
                        <Siren size={22} color="#fff" strokeWidth={2} />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#DC2626' }}>SOS Activated</p>
                        <p style={{ fontSize: '0.7rem', color: '#B91C1C', marginTop: '1px' }}>
                            Severe stress detected · Take action now
                        </p>
                    </div>
                    <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                        <X size={18} color="#B91C1C" />
                    </button>
                </div>

                {/* Medication Guidance */}
                <SectionTitle icon={<Pill size={15} color="#6D4ADE" />} label="Medication Guidance" color="#6D4ADE" />
                <div style={infoCardStyle('#6D4ADE')}>
                    <p style={{ fontSize: '0.78rem', color: '#5A6880', lineHeight: 1.6 }}>
                        If prescribed, consider your <strong style={{ color: '#1A2233' }}>anxiolytic or beta-blocker</strong> dose as directed by your physician. Do <strong style={{ color: '#DC2626' }}>not</strong> self-medicate beyond your prescription.
                    </p>
                    <p style={{ fontSize: '0.68rem', color: '#A0ABBE', marginTop: '6px' }}>
                        Last medication log: <span style={{ color: '#6D4ADE', fontWeight: 600 }}>Not recorded · Update in Profile</span>
                    </p>
                </div>

                {/* Share Location */}
                <SectionTitle icon={<MapPin size={15} color="#2563EB" />} label="Share Location" color="#2563EB" />
                <button onClick={shareLocation} style={actionBtnStyle('#2563EB')}>
                    <MapPin size={16} color="#fff" />
                    Share My Location
                </button>

                {/* Nearby Hospital */}
                <SectionTitle icon={<Building2 size={15} color="#12A37A" />} label="Nearest Hospital" color="#12A37A" />
                <div style={{ ...infoCardStyle('#12A37A'), cursor: 'pointer' }} onClick={openHospital}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1A2233' }}>{HOSPITAL.name}</p>
                            <p style={{ fontSize: '0.7rem', color: '#5A6880', marginTop: '2px' }}>{HOSPITAL.address}</p>
                        </div>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#12A37A', background: '#F0FBF7', border: '1px solid rgba(18,163,122,0.2)', borderRadius: '20px', padding: '2px 8px', whiteSpace: 'nowrap' }}>
                            {HOSPITAL.distance}
                        </span>
                    </div>
                    <p style={{ fontSize: '0.65rem', color: '#12A37A', marginTop: '6px', fontWeight: 600 }}>Tap to open in Maps →</p>
                </div>

                {/* Direct Call */}
                <SectionTitle icon={<Phone size={15} color="#DC2626" />} label="Emergency Call" color="#DC2626" />
                <a href={`tel:${EMERGENCY_NUMBER}`} style={{ textDecoration: 'none' }}>
                    <button style={{ ...actionBtnStyle('#DC2626'), marginBottom: '0' }}>
                        <Phone size={16} color="#fff" fill="#fff" />
                        Call Emergency ({EMERGENCY_NUMBER})
                    </button>
                </a>
            </div>
        </div>
    );
}

function SectionTitle({ icon, label, color }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', marginTop: '16px' }}>
            {icon}
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        </div>
    );
}

const infoCardStyle = (color) => ({
    background: '#FAFBFD', border: '1px solid rgba(0,0,0,0.07)',
    borderLeft: `3px solid ${color}`,
    borderRadius: '12px', padding: '12px 14px',
});

const actionBtnStyle = (color) => ({
    width: '100%', padding: '13px', borderRadius: '12px',
    background: color, border: 'none',
    color: '#fff', fontFamily: 'var(--font-main)', fontWeight: 700,
    fontSize: '0.9rem', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    boxShadow: `0 4px 14px ${color}40`,
    marginBottom: '4px',
});

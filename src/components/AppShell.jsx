import React, { useState, useEffect } from 'react';
import { Activity, Bell, User } from 'lucide-react';
import Dashboard from '../pages/Dashboard';
import AlertsPage from '../pages/AlertsPage';
import ProfilePage from '../pages/ProfilePage';

const navItems = [
    { id: 'dashboard', icon: Activity, label: 'Dashboard' },
    { id: 'alerts', icon: Bell, label: 'Alerts' },
    { id: 'profile', icon: User, label: 'Profile' },
];

export default function AppShell({ deviceConnected = true, user = null }) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [alertCount, setAlertCount] = useState(0);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const id = setInterval(() => setTime(new Date()), 30000);
        return () => clearInterval(id);
    }, []);

    const timeStr = time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });

    const renderPage = () => {
        switch (activeTab) {
            case 'dashboard': return <Dashboard onAlertCountChange={setAlertCount} />;
            case 'alerts': return <AlertsPage />;
            case 'profile': return <ProfilePage user={user} />;
            default: return null;
        }
    };

    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#E8EDF5' }}>
            <div style={{
                width: '100%', maxWidth: '430px', height: '100%', maxHeight: '932px',
                background: 'var(--bg-primary)',
                display: 'flex', flexDirection: 'column',
                position: 'relative', overflow: 'hidden',
                boxShadow: '0 0 60px rgba(0,0,0,0.12)',
            }}>
                {/* ── Top Status Bar ── */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 20px 6px',
                    background: 'rgba(244,247,251,0.97)',
                    borderBottom: '1px solid var(--border)',
                    flexShrink: 0, zIndex: 50,
                }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {timeStr}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            background: deviceConnected ? 'rgba(18,163,122,0.08)' : 'rgba(220,38,38,0.08)',
                            border: `1px solid ${deviceConnected ? 'rgba(18,163,122,0.3)' : 'rgba(220,38,38,0.3)'}`,
                            borderRadius: '20px', padding: '3px 8px',
                        }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: deviceConnected ? 'var(--green)' : 'var(--red)', animation: 'pulse-dot 2s infinite' }} />
                            <span style={{ fontSize: '0.65rem', color: deviceConnected ? 'var(--green)' : 'var(--red)', fontWeight: 600, letterSpacing: '0.02em' }}>
                                {deviceConnected ? 'SAVR LINKED' : 'DISCONNECTED'}
                            </span>
                        </div>
                        {/* Battery */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <div style={{ width: '20px', height: '10px', border: '1.5px solid rgba(0,0,0,0.2)', borderRadius: '2px', position: 'relative' }}>
                                <div style={{ position: 'absolute', right: '-4px', top: '2px', width: '2.5px', height: '5px', background: 'rgba(0,0,0,0.2)', borderRadius: '0 1px 1px 0' }} />
                                <div style={{ width: '80%', height: '100%', background: 'var(--green)', borderRadius: '1px' }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Top Navigation Tab Bar ── */}
                <div style={{
                    display: 'flex',
                    background: '#FFFFFF',
                    borderBottom: '1px solid var(--border)',
                    flexShrink: 0,
                    padding: '0 8px',
                }}>
                    {navItems.map(({ id, icon: Icon, label }) => {
                        const isActive = activeTab === id;
                        const showBadge = id === 'alerts' && alertCount > 0;
                        return (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                style={{
                                    flex: 1,
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    justifyContent: 'center', gap: '3px',
                                    padding: '10px 4px 8px',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    position: 'relative',
                                    borderBottom: isActive ? '2.5px solid var(--blue)' : '2.5px solid transparent',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <div style={{ position: 'relative' }}>
                                    <Icon
                                        size={19}
                                        color={isActive ? 'var(--blue)' : 'var(--text-muted)'}
                                        strokeWidth={isActive ? 2.2 : 1.7}
                                    />
                                    {showBadge && (
                                        <div style={{
                                            position: 'absolute', top: '-4px', right: '-5px',
                                            width: '14px', height: '14px', borderRadius: '50%',
                                            background: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <span style={{ fontSize: '0.5rem', color: '#fff', fontWeight: 800 }}>{alertCount}</span>
                                        </div>
                                    )}
                                </div>
                                <span style={{
                                    fontSize: '0.6rem',
                                    fontWeight: isActive ? 700 : 400,
                                    color: isActive ? 'var(--blue)' : 'var(--text-muted)',
                                    letterSpacing: '0.02em',
                                    textTransform: 'uppercase',
                                }}>
                                    {label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* ── Page content ── */}
                <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                    {renderPage()}
                </div>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { Activity, BarChart2, Bell, User } from 'lucide-react';
import Dashboard from '../pages/Dashboard';
import AlertsPage from '../pages/AlertsPage';
import ProfilePage from '../pages/ProfilePage';

const navItems = [
    { id: 'dashboard', icon: Activity, label: 'Dashboard' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics' },
    { id: 'alerts', icon: Bell, label: 'Alerts' },
    { id: 'profile', icon: User, label: 'Profile' },
];

export default function AppShell({ deviceConnected = true, user = null }) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [alertCount, setAlertCount] = useState(0);
    const [time, setTime] = useState(new Date());

    // Tick clock every 30 s
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
            default: return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                    Coming soon
                </div>
            );
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
                {/* Status Bar */}
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

                {/* Page content */}
                <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                    {renderPage()}
                </div>

                {/* Bottom Nav */}
                <div style={{
                    display: 'flex', justifyContent: 'space-around', alignItems: 'center',
                    padding: '10px 8px 16px',
                    background: '#FFFFFF',
                    borderTop: '1px solid var(--border)',
                    flexShrink: 0,
                }}>
                    {navItems.map(({ id, icon: Icon, label }) => {
                        const isActive = activeTab === id;
                        const showBadge = id === 'alerts' && alertCount > 0;
                        return (
                            <button key={id} onClick={() => setActiveTab(id)} style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                                background: isActive ? 'rgba(37,99,235,0.07)' : 'none',
                                border: 'none', cursor: 'pointer',
                                padding: '6px 18px', borderRadius: '12px',
                                transition: 'all 0.2s ease', position: 'relative',
                            }}>
                                {isActive && (
                                    <div style={{
                                        position: 'absolute', top: '-10px', left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '28px', height: '2.5px',
                                        background: 'var(--blue)', borderRadius: '0 0 3px 3px',
                                    }} />
                                )}
                                <div style={{ position: 'relative' }}>
                                    <Icon size={20} color={isActive ? 'var(--blue)' : 'var(--text-muted)'} strokeWidth={isActive ? 2.2 : 1.7} />
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
                                <span style={{ fontSize: '0.6rem', fontWeight: isActive ? 700 : 400, color: isActive ? 'var(--blue)' : 'var(--text-muted)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                                    {label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Heart, Activity } from 'lucide-react';

export default function Auth({ onAuthenticated }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onAuthenticated({ name: isLogin ? email.split('@')[0] : name, email });
    }, 1400);
  };

  const inputStyle = {
    width: '100%',
    padding: '11px 12px 11px 40px',
    borderRadius: '10px',
    border: '1px solid rgba(0,0,0,0.1)',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-main)',
    color: 'var(--text-primary)',
    background: '#FAFBFD',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  const labelStyle = {
    fontSize: '0.68rem',
    fontWeight: 700,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    display: 'block',
    marginBottom: '6px',
  };

  return (
    /* Full-page wrapper — same outer shell as AppShell */
    <div style={{
      width: '100vw', height: '100vh',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      background: '#E8EDF5',
    }}>
      {/* Phone-frame card — same max-width & style as AppShell */}
      <div style={{
        width: '100%', maxWidth: '430px', height: '100%', maxHeight: '932px',
        background: 'var(--bg-primary)',
        display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 0 60px rgba(0,0,0,0.12)',
      }}>

        {/* ── Status-bar replica ───────────────────────── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 20px 6px',
          background: 'rgba(244,247,251,0.97)',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0, zIndex: 50,
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(18,163,122,0.08)', border: '1px solid rgba(18,163,122,0.3)', borderRadius: '20px', padding: '3px 8px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green)', animation: 'pulse-dot 2s infinite' }} />
            <span style={{ fontSize: '0.65rem', color: 'var(--green)', fontWeight: 600, letterSpacing: '0.02em' }}>SAVR</span>
          </div>
        </div>

        {/* ── Scrollable content ────────────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

          {/* ── Header — mirrors Dashboard header style ── */}
          <div style={{ padding: '20px 20px 18px', background: '#FFFFFF', borderBottom: '1px solid var(--border)', marginBottom: '14px', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
              <div>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                  SAVR Health
                </p>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginTop: '1px' }}>
                  {isLogin ? 'Welcome back' : 'Create Account'}
                </h1>
              </div>
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%',
                background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Heart size={20} color="var(--blue)" strokeWidth={2} />
              </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              {isLogin
                ? 'Sign in to monitor your health in real-time.'
                : 'Join SAVR to start tracking your vitals.'}
            </p>
          </div>

          {/* ── Form card — same card style as SectionCard ── */}
          <div style={{ padding: '0 14px', flex: 1 }}>
            <div style={{
              background: '#FFF',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '20px 18px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              marginBottom: '12px',
            }}>

              {/* Toggle — styled like the nav tabs */}
              <div style={{
                display: 'flex',
                background: 'rgba(37,99,235,0.05)',
                border: '1px solid rgba(37,99,235,0.1)',
                borderRadius: '10px',
                padding: '3px',
                marginBottom: '20px',
                gap: '3px',
              }}>
                {['Sign In', 'Sign Up'].map((label, i) => {
                  const active = isLogin ? i === 0 : i === 1;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setIsLogin(i === 0)}
                      style={{
                        flex: 1,
                        padding: '8px 0',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: active ? 700 : 500,
                        fontFamily: 'var(--font-main)',
                        color: active ? 'var(--blue)' : 'var(--text-muted)',
                        background: active ? '#FFFFFF' : 'transparent',
                        boxShadow: active ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                        transition: 'all 0.22s ease',
                        letterSpacing: '0.01em',
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handleSubmit}>

                {/* Name field — slides in for Sign Up */}
                <div style={{
                  overflow: 'hidden',
                  maxHeight: isLogin ? '0' : '80px',
                  opacity: isLogin ? 0 : 1,
                  marginBottom: isLogin ? '0' : '14px',
                  transition: 'max-height 0.35s ease, opacity 0.28s ease, margin-bottom 0.35s ease',
                }}>
                  <label style={labelStyle}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      placeholder="e.g. Arjun Sharma"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required={!isLogin}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Email */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={labelStyle}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Password */}
                <div style={{ marginBottom: '8px' }}>
                  <label style={labelStyle}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Forgot password */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginBottom: '20px',
                  overflow: 'hidden',
                  maxHeight: isLogin ? '20px' : '0',
                  opacity: isLogin ? 1 : 0,
                  transition: 'max-height 0.3s ease, opacity 0.25s ease',
                }}>
                  <a href="#" style={{ fontSize: '0.72rem', color: 'var(--blue)', fontWeight: 600, textDecoration: 'none' }}>
                    Forgot password?
                  </a>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '13px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    background: isSubmitting ? 'rgba(37,99,235,0.6)' : 'var(--blue)',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-main)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.22s ease',
                    letterSpacing: '0.01em',
                  }}
                >
                  {isSubmitting ? (
                    <div style={{ width: '18px', height: '18px', border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Divider + Social */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0 12px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              {/* Google */}
              <button type="button" style={{
                flex: 1, padding: '11px', borderRadius: '10px',
                background: '#FFF', border: '1px solid var(--border)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                fontFamily: 'var(--font-main)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}>
                <svg width="17" height="17" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              {/* Apple */}
              <button type="button" style={{
                flex: 1, padding: '11px', borderRadius: '10px',
                background: '#FFF', border: '1px solid var(--border)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                fontFamily: 'var(--font-main)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}>
                <svg width="17" height="17" fill="var(--text-primary)" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.82 3.59-.82 1.5.02 2.91.83 3.73 2.15-3.11 1.77-2.64 5.92.37 7.15-.75 1.68-1.55 3.14-2.77 3.69zM12.04 7.02c-.1-3.14 2.58-5.83 5.46-5.88.22 3.12-2.82 5.99-5.46 5.88z" />
                </svg>
                Apple
              </button>
            </div>

            {/* Footer wellness banner */}
            <div style={{
              background: 'rgba(37,99,235,0.04)',
              border: '1px solid rgba(37,99,235,0.12)',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '14px',
            }}>
              <Activity size={18} color="var(--blue)" strokeWidth={2} style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                <strong style={{ color: 'var(--text-primary)' }}>Real-time health monitoring</strong> — ECG, SpO₂, stress analysis and more, all from your SAVR patch.
              </p>
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-muted)', paddingBottom: '16px', lineHeight: 1.6 }}>
              By continuing you agree to SAVR's{' '}
              <a href="#" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Terms</a> &amp;{' '}
              <a href="#" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

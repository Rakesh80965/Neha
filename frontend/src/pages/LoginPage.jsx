import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = ({ onSwitchToRegister }) => {
  const { login, loginAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: 'var(--cream)',
      }}
    >
      {/* Left — editorial hero */}
      <div
        style={{
          background: 'var(--charcoal)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '3rem',
          minHeight: '100vh',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'var(--white)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 900, color: 'var(--charcoal)',
              letterSpacing: '-0.03em',
            }}
          >
            FS
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.03em' }}>
            FabricSample
          </span>
        </div>

        {/* Big display text */}
        <div>
          <div
            style={{
              fontSize: 'clamp(52px, 7vw, 90px)',
              fontWeight: 900,
              letterSpacing: '-0.05em',
              lineHeight: 0.95,
              color: 'var(--white)',
              marginBottom: '1.5rem',
            }}
          >
            Intelligent<br />
            <span style={{ color: 'var(--red)' }}>Fabric</span><br />
            Search.
          </div>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', fontWeight: 400, maxWidth: '340px', lineHeight: 1.6 }}>
            Recommendation engine for accurate and faster fabric sample library selection.
          </p>
        </div>

        {/* Footer stats */}
        <div style={{ display: 'flex', gap: '2.5rem' }}>
          {[['100+', 'Fabric Samples'], ['AI', 'Priority Engine'], ['Fast', 'Smart Search']].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--white)', letterSpacing: '-0.04em' }}>{num}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500, letterSpacing: '0.04em' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — login form */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem',
        }}
      >
        <div style={{ maxWidth: '380px', width: '100%' }}>
          {/* Heading */}
          <div style={{ marginBottom: '2.2rem' }}>
            <h1
              style={{
                fontSize: '2.2rem',
                fontWeight: 900,
                letterSpacing: '-0.045em',
                color: 'var(--charcoal)',
                lineHeight: 1,
                marginBottom: '0.5rem',
              }}
            >
              Sign In
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400 }}>
              Access your smart fabric workspace.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                marginBottom: '1.25rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(232,51,26,0.08)',
                border: '1.5px solid rgba(232,51,26,0.25)',
                color: 'var(--red)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: '0.45rem' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field"
                  style={{ paddingLeft: '2.6rem' }}
                />
                <Mail size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: '0.45rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                  style={{ paddingLeft: '2.6rem' }}
                />
                <Lock size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{ marginTop: '0.5rem', padding: '0.9rem', width: '100%', fontSize: '0.95rem', borderRadius: 'var(--radius-md)' }}
            >
              <span>{submitting ? 'Signing In…' : 'Sign In'}</span>
              <ArrowRight size={17} />
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.25rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 500 }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            <button
              type="button"
              onClick={loginAsGuest}
              className="btn-secondary"
              style={{ padding: '0.8rem', width: '100%', fontSize: '0.88rem', borderRadius: 'var(--radius-md)' }}
            >
              ⚡ Explore Demo Workspace
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            No account?{' '}
            <button
              onClick={onSwitchToRegister}
              style={{
                background: 'none', border: 'none',
                color: 'var(--charcoal)', fontWeight: 700, cursor: 'pointer',
                fontFamily: 'var(--font-sans)', fontSize: '0.88rem',
                textDecoration: 'underline', textUnderlineOffset: '3px',
              }}
            >
              Create one →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setSubmitting(true);
    try {
      await register(email, password, confirm);
    } catch (err) {
      setError(err.message || 'Registration failed');
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
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'var(--white)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 900, color: 'var(--charcoal)',
            }}
          >
            FS
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.03em' }}>
            FabricSample
          </span>
        </div>

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
            Join<br />
            <span style={{ color: 'var(--red)' }}>FabricSample</span><br />
            Today.
          </div>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '340px' }}>
            Start finding the perfect fabric samples matched to your buyer requirements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2.5rem' }}>
          {[['100+', 'Fabric Samples'], ['Smart', 'AI Matching'], ['Fast', 'Quick Setup']].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--white)', letterSpacing: '-0.04em' }}>{num}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500, letterSpacing: '0.04em' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — register form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
        <div style={{ maxWidth: '380px', width: '100%' }}>
          <div style={{ marginBottom: '2.2rem' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.045em', color: 'var(--charcoal)', lineHeight: 1, marginBottom: '0.5rem' }}>
              Create Account
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Get started with your fabric workspace.
            </p>
          </div>

          {error && (
            <div
              style={{
                marginBottom: '1.25rem', padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(232,51,26,0.08)', border: '1.5px solid rgba(232,51,26,0.25)',
                color: 'var(--red)', fontSize: '0.85rem',
                display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'Email', type: 'email', val: email, setter: setEmail, placeholder: 'you@example.com', icon: Mail },
              { label: 'Password', type: 'password', val: password, setter: setPassword, placeholder: 'At least 6 characters', icon: Lock },
              { label: 'Confirm Password', type: 'password', val: confirm, setter: setConfirm, placeholder: 'Confirm your password', icon: CheckCircle },
            ].map(({ label, type, val, setter, placeholder, icon: Icon }) => (
              <div key={label}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: '0.45rem' }}>
                  {label}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={type}
                    required
                    value={val}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    className="input-field"
                    style={{ paddingLeft: '2.6rem' }}
                  />
                  <Icon size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{ marginTop: '0.5rem', padding: '0.9rem', width: '100%', fontSize: '0.95rem', borderRadius: 'var(--radius-md)' }}
            >
              <span>{submitting ? 'Creating Account…' : 'Create Account'}</span>
              <ArrowRight size={17} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              style={{
                background: 'none', border: 'none',
                color: 'var(--charcoal)', fontWeight: 700, cursor: 'pointer',
                fontFamily: 'var(--font-sans)', fontSize: '0.88rem',
                textDecoration: 'underline', textUnderlineOffset: '3px',
              }}
            >
              Sign in →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Layers, LogOut, User, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const emailChar = user?.email ? user.email[0].toUpperCase() : 'U';

  return (
    <header
      style={{
        height: '70px',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
          }}
        >
          <Layers size={22} />
        </div>
        <div>
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            FabricSample <span style={{ color: 'var(--gold-400)', WebkitTextFillColor: 'initial', fontSize: '0.75rem', fontWeight: 600, padding: '0.1rem 0.5rem', background: 'rgba(245,158,11,0.15)', borderRadius: '6px', border: '1px solid rgba(245,158,11,0.3)', marginLeft: '0.4rem' }}>PRO</span>
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
            Intelligent Buyer Requirement Matcher
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        {user && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.45rem 1rem',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '30px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #D97706 0%, #991B1B 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: '#FFFFFF',
              }}
            >
              {emailChar}
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-main)' }}>
              {user.email}
            </span>
          </div>
        )}

        <button
          onClick={logout}
          className="btn-secondary"
          style={{
            padding: '0.55rem 1.1rem',
            fontSize: '0.85rem',
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
          title="Sign Out"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};

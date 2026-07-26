import React from 'react';
import { LogOut, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const emailChar = user?.email ? user.email[0].toUpperCase() : 'U';

  return (
    <header
      style={{
        height: '60px',
        background: 'var(--cream)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'var(--charcoal)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--white)',
            fontSize: '13px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            flexShrink: 0,
          }}
        >
          FS
        </div>
        <div>
          <div
            style={{
              fontSize: '1.1rem',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: 'var(--charcoal)',
              lineHeight: 1.1,
            }}
          >
            FabricSample
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', letterSpacing: '0.04em', fontWeight: 500 }}>
            Intelligent Buyer Requirement Matcher
          </div>
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {user && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.9rem 0.35rem 0.4rem',
              border: '1.5px solid var(--border-mid)',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.82rem',
              fontWeight: 500,
              color: 'var(--text-muted)',
            }}
          >
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: 'var(--charcoal)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--white)',
              }}
            >
              {emailChar}
            </div>
            <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </span>
          </div>
        )}

        <button
          onClick={logout}
          className="btn-secondary"
          style={{ padding: '0.48rem 1rem', fontSize: '0.82rem', gap: '0.4rem' }}
          title="Sign Out"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};

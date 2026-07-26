import React from 'react';
import { Search, Heart, Grid, UploadCloud } from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, wishlistBadgeCount = 0 }) => {
  const navItems = [
    { id: 'search',   label: 'Smart Search',  icon: Search },
    { id: 'wishlist', label: 'Wishlists',      icon: Heart,       badge: wishlistBadgeCount },
    { id: 'data',     label: 'All Samples',    icon: Grid },
    { id: 'upload',   label: 'Upload Sheet',   icon: UploadCloud },
  ];

  return (
    <aside
      style={{
        width: '220px',
        background: 'var(--cream)',
        borderRight: '1px solid var(--border)',
        padding: '2rem 1rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Section label */}
      <div
        style={{
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: 'var(--text-dim)',
          padding: '0 0.6rem 1rem',
        }}
      >
        Navigation
      </div>

      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.7rem',
                padding: '0.72rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--charcoal)' : 'transparent',
                color: isActive ? 'var(--white)' : 'var(--text-muted)',
                border: 'none',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.88rem',
                fontFamily: 'var(--font-sans)',
                letterSpacing: isActive ? '-0.02em' : 'normal',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(14,14,14,0.06)';
                  e.currentTarget.style.color = 'var(--charcoal)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }
              }}
            >
              <Icon size={17} />
              <span style={{ flex: 1 }}>{item.label}</span>

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  style={{
                    background: isActive ? 'var(--red)' : 'var(--charcoal)',
                    color: 'var(--white)',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '1px 7px',
                    borderRadius: 'var(--radius-pill)',
                    minWidth: '20px',
                    textAlign: 'center',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer status */}
      <div
        style={{
          marginTop: 'auto',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '1.5px solid var(--border)',
          background: 'var(--bg-surface)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22C55E' }} />
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Engine Active
          </div>
        </div>
        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          Priority-score matching loaded.
        </div>
      </div>
    </aside>
  );
};

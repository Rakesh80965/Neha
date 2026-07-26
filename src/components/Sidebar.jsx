import React from 'react';
import { Search, Heart, Grid, UploadCloud, ChevronRight } from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, wishlistBadgeCount = 0 }) => {
  const navItems = [
    { id: 'search', label: 'Smart Search', icon: Search },
    { id: 'wishlist', label: 'Wishlists', icon: Heart, badge: wishlistBadgeCount },
    { id: 'data', label: 'All Samples', icon: Grid },
    { id: 'upload', label: 'Upload Sheet', icon: UploadCloud },
  ];

  return (
    <aside
      style={{
        width: '240px',
        background: 'rgba(13, 18, 29, 0.7)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--border-subtle)',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          fontSize: '0.68rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: 'var(--text-dim)',
          padding: '0 0.8rem 1rem',
          fontFamily: 'var(--font-heading)',
        }}
      >
        Navigation
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
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
                gap: '0.85rem',
                padding: '0.85rem 1.05rem',
                borderRadius: 'var(--radius-md)',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(244, 162, 97, 0.2) 0%, rgba(224, 122, 95, 0.1) 100%)'
                  : 'transparent',
                color: isActive ? 'var(--sand-500)' : 'var(--text-muted)',
                border: isActive ? '1px solid rgba(244, 162, 97, 0.4)' : '1px solid transparent',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.92rem',
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
              }}
            >
              <Icon size={19} color={isActive ? '#F4A261' : '#94A3B8'} />
              <span style={{ flex: 1 }}>{item.label}</span>

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  style={{
                    background: 'linear-gradient(135deg, #A82D38 0%, #D93848 100%)',
                    color: '#FFFFFF',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.55rem',
                    borderRadius: '20px',
                  }}
                >
                  {item.badge}
                </span>
              )}

              {isActive && (
                <ChevronRight size={16} color="var(--sand-500)" style={{ opacity: 0.9 }} />
              )}
            </button>
          );
        })}
      </nav>

      <div
        style={{
          marginTop: 'auto',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(244, 162, 97, 0.06)',
          border: '1px solid rgba(244, 162, 97, 0.2)',
        }}
      >
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--sand-500)', marginBottom: '0.3rem', fontFamily: 'var(--font-heading)' }}>
          Fabric Engine Active
        </div>
        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: '1.45', fontFamily: 'var(--font-sans)' }}>
          Priority-score matching rule set loaded from database.
        </div>
      </div>
    </aside>
  );
};

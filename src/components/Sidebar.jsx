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
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(16px)',
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
          letterSpacing: '0.12em',
          color: 'var(--text-dim)',
          padding: '0 0.8rem 1rem',
        }}
      >
        Navigation
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
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
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(217, 119, 6, 0.08) 100%)'
                  : 'transparent',
                color: isActive ? 'var(--gold-400)' : 'var(--text-muted)',
                border: isActive ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.92rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
              }}
            >
              <Icon size={19} color={isActive ? '#F59E0B' : '#94A3B8'} />
              <span style={{ flex: 1 }}>{item.label}</span>

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  style={{
                    background: 'var(--burgundy-600)',
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
                <ChevronRight size={16} color="var(--gold-400)" style={{ opacity: 0.8 }} />
              )}
            </button>
          );
        })}
      </nav>

      <div
        style={{
          marginTop: 'auto',
          padding: '1.2rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(245, 158, 11, 0.05)',
          border: '1px solid rgba(245, 158, 11, 0.15)',
        }}
      >
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gold-400)', marginBottom: '0.3rem' }}>
          Fabric Engine Active
        </div>
        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          Priority-score matching rule set loaded from database.
        </div>
      </div>
    </aside>
  );
};

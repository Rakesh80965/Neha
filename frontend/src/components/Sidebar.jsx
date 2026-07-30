import React from 'react';
import { Search, Heart, Grid, UploadCloud, PlusCircle, FileText, Layers } from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, wishlistBadgeCount = 0 }) => {
  const navItems = [
    { id: 'enquiry',       label: 'Enquiry Registration', icon: FileText },
    { id: 'all-enquiries', label: 'Sample Order Tracking', icon: Layers },
    { id: 'search',        label: 'Smart Search',         icon: Search },
    { id: 'wishlist',      label: 'Shortlisted Samples',    icon: Heart,       badge: wishlistBadgeCount },
    { id: 'data',          label: 'All Samples',           icon: Grid },
    { id: 'upload',        label: 'Upload Sheet',          icon: UploadCloud },
  ];

  return (
    <aside
      style={{
        width: '230px',
        background: 'var(--cream)',
        borderRight: '1px solid var(--border)',
        padding: '1.5rem 1rem 1.5rem',
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
          padding: '0 0.6rem 0.6rem',
        }}
      >
        Navigation
      </div>

      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
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
                background: isActive ? 'var(--charcoal)' : item.highlight ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                color: isActive ? 'var(--white)' : item.highlight ? '#2563eb' : 'var(--text-muted)',
                border: 'none',
                fontWeight: isActive || item.highlight ? 700 : 500,
                fontSize: '0.88rem',
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
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
    </aside>
  );
};

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => { onClose(); }, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  const isError = type === 'error';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        padding: '0.8rem 1.2rem',
        borderRadius: 'var(--radius-pill)',
        background: isError ? 'var(--charcoal)' : 'var(--charcoal)',
        color: 'var(--white)',
        boxShadow: '0 16px 40px rgba(14,14,14,0.25)',
        border: `1.5px solid ${isError ? 'var(--red)' : 'rgba(34,197,94,0.5)'}`,
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        maxWidth: '380px',
      }}
    >
      {isError
        ? <AlertCircle size={17} color="var(--red)" />
        : <CheckCircle2 size={17} color="#22C55E" />}
      <span style={{ fontWeight: 600, fontSize: '0.88rem', letterSpacing: '-0.01em' }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
          marginLeft: '0.4rem', display: 'flex', alignItems: 'center',
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
      >
        <X size={15} />
      </button>
    </div>
  );
};

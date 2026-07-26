import React, { useState } from 'react';
import { Eye, Heart, Sparkles, ImageOff } from 'lucide-react';
import { getApiUrl } from '../config';

export const SampleCard = ({ sample, onOpenModal, onRemoveFromGroup, rankInfo }) => {
  const [imgError, setImgError] = useState(false);

  const getRankBadgeClass = () => {
    if (!rankInfo) return null;
    if (rankInfo.rank === 1) return { bg: 'linear-gradient(135deg, #059669 0%, #047857 100%)', label: '#1 BEST MATCH' };
    if (rankInfo.rank <= 3) return { bg: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)', label: `TOP PICK #${rankInfo.rank}` };
    return { bg: 'rgba(51, 65, 85, 0.85)', label: `MATCH #${rankInfo.rank}` };
  };

  const badge = getRankBadgeClass();

  return (
    <div
      onClick={() => onOpenModal && onOpenModal(sample)}
      style={{
        background: 'rgba(30, 41, 59, 0.55)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(245, 158, 11, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Top Accent Line */}
      <div
        style={{
          height: '3px',
          background: rankInfo
            ? 'linear-gradient(90deg, #F59E0B, #BE123C)'
            : 'linear-gradient(90deg, #475569, #334155)',
        }}
      />

      {/* Image Preview Container */}
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden', background: '#0B1329' }}>
        {!imgError ? (
          <img
            src={getApiUrl(`/sample-image/${sample.sample_no}`)}
            alt={`Sample ${sample.sample_no}`}
            onError={() => setImgError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
            }}
          />
        ) : (

          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-dim)',
              gap: '0.4rem',
            }}
          >
            <ImageOff size={28} />
            <span style={{ fontSize: '0.78rem' }}>No Image Preview</span>
          </div>
        )}

        {/* Rank Badge Overlay */}
        {badge && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: badge.bg,
              color: '#FFFFFF',
              padding: '0.3rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Sparkles size={12} />
            {badge.label}
          </div>
        )}

        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(8px)',
            padding: '0.3rem 0.6rem',
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontWeight: 600,
            color: 'var(--gold-400)',
          }}
        >
          {sample.gsm} GSM
        </div>
      </div>

      {/* Card Details */}
      <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>
              Sample #{sample.sample_no}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--gold-400)', fontWeight: 600, marginTop: '0.1rem' }}>
              {sample.article || 'Standard Article'}
            </div>
          </div>
        </div>

        {/* Grid Specs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.6rem 1rem',
            background: 'rgba(15, 23, 42, 0.4)',
            padding: '0.8rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            marginBottom: '1rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.05em' }}>Product</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 500, truncate: true }}>{sample.product || '-'}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.05em' }}>Yarn</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 500 }}>{sample.yarn || '-'}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.05em' }}>Blend</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 500 }}>{sample.blend || '-'}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.05em' }}>Weave</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 500 }}>{sample.weave || '-'}</div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div style={{ marginTop: 'auto', display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal && onOpenModal(sample);
            }}
            className="btn-secondary"
            style={{ flex: 1, padding: '0.5rem', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)' }}
          >
            <Eye size={15} />
            <span>View Spec Sheet</span>
          </button>

          {onRemoveFromGroup && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFromGroup(sample.sample_no);
              }}
              className="btn-danger"
              style={{ padding: '0.5rem 0.8rem', borderRadius: 'var(--radius-sm)' }}
              title="Remove from Wishlist"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

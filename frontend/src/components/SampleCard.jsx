import React, { useState } from 'react';
import { Eye, ImageOff, Sparkles, FileText } from 'lucide-react';
import { getApiUrl } from '../config';

const FABRIC_COLORS = [
  ['#1a1a2e','#16213e'],['#2d1b69','#11998e'],['#134e5e','#71b280'],
  ['#0f3460','#533483'],['#16213e','#0f3460'],['#1a1a2e','#e94560'],
  ['#2c3e50','#3498db'],['#1e3c72','#2a5298'],['#373b44','#4286f4'],
  ['#0d0d0d','#434343'],
];
const patternFor = (n) => FABRIC_COLORS[n % FABRIC_COLORS.length];

export const SampleCard = ({ sample, onOpenModal, onRemoveFromGroup, rankInfo }) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const isTop1 = rankInfo?.rank === 1;
  const isTop3 = rankInfo && rankInfo.rank <= 3;
  const [colorA, colorB] = patternFor(sample.sample_no);

  return (
    <div
      onClick={() => onOpenModal && onOpenModal(sample)}
      style={{
        background: 'var(--white)',
        border: '1.5px solid var(--border)',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.28s cubic-bezier(0.16,1,0.3,1), box-shadow 0.28s cubic-bezier(0.16,1,0.3,1), border-color 0.28s ease',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 20px 48px rgba(14,14,14,0.12)';
        e.currentTarget.style.borderColor = 'var(--charcoal)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      {/* Top Accent Line */}
      <div
        style={{
          height: '3px',
          background: isTop1 ? 'var(--red)' : isTop3 ? 'var(--charcoal)' : 'var(--border)',
        }}
      />

      {/* Image Area */}
      <div
        style={{
          position: 'relative',
          height: '200px',
          overflow: 'hidden',
          background: imgError || !imgLoaded
            ? `linear-gradient(135deg, ${colorA} 0%, ${colorB} 100%)`
            : 'var(--bg-surface)',
          flexShrink: 0,
        }}
      >
        {/* Actual Image */}
        <img
          src={getApiUrl(`/sample-image/${sample.sample_no}`)}
          alt={`Sample ${sample.sample_no}`}
          onError={() => { setImgError(true); setImgLoaded(true); }}
          onLoad={() => setImgLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
            display: imgError ? 'none' : 'block',
            opacity: imgLoaded ? 1 : 0,
            transition: 'opacity 0.35s ease, transform 0.5s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        />

        {/* Fallback pattern when no image */}
        {(imgError || !imgLoaded) && (
          <div
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <div style={{ fontSize: '42px', fontWeight: 900, color: 'rgba(255,255,255,0.15)', letterSpacing: '-0.04em', lineHeight: 1 }}>
              #{sample.sample_no}
            </div>
            <ImageOff size={22} color="rgba(255,255,255,0.45)" style={{ margin: '6px auto 0' }} />
          </div>
        )}

        {/* Bottom gradient overlay */}
        <div
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '70px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Rank badge */}
        {rankInfo && (
          <div
            style={{
              position: 'absolute', top: '10px', left: '10px',
              background: isTop1 ? 'var(--red)' : 'rgba(14,14,14,0.82)',
              color: 'var(--white)',
              padding: '3px 10px', borderRadius: '999px',
              fontSize: '10px', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: '4px',
              backdropFilter: 'blur(6px)',
            }}
          >
            {isTop1 && <Sparkles size={10} />}
            {isTop1 ? 'Best Match' : `#${rankInfo.rank}`}
          </div>
        )}

        {/* GSM badge */}
        <div
          style={{
            position: 'absolute', bottom: '10px', right: '10px',
            background: 'rgba(255,255,255,0.92)',
            border: '1px solid rgba(0,0,0,0.08)',
            padding: '2px 9px', borderRadius: '6px',
            fontSize: '11px', fontWeight: 800, color: 'var(--charcoal)',
            letterSpacing: '-0.01em',
          }}
        >
          {sample.gsm} GSM
        </div>
      </div>

      {/* Card Details */}
      <div style={{ padding: '1.1rem 1.15rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--charcoal)', letterSpacing: '-0.04em', lineHeight: 1 }}>
              #{sample.sample_no}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '3px', letterSpacing: '-0.01em' }}>
              {sample.article || 'Standard Article'}
            </div>
          </div>

          {(sample.sample_no === 1026 || sample.documents) && (
            <a
              href="/test_report_1026.html"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.25rem 0.55rem',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                color: '#dc2626',
                fontSize: '0.72rem',
                fontWeight: 700,
                textDecoration: 'none',
                cursor: 'pointer',
              }}
              title="Click to view Test Report"
            >
              <FileText size={12} />
              <span>Test Report.pdf</span>
            </a>
          )}
        </div>

        {/* Spec Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.55rem 0.8rem',
            padding: '0.75rem',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
          }}
        >
          {[
            { label: 'Product', val: sample.product },
            { label: 'Yarn', val: sample.yarn },
            { label: 'Blend', val: sample.blend },
            { label: 'Weave', val: sample.weave },
          ].map(({ label, val }) => (
            <div key={label}>
              <div style={{ fontSize: '9.5px', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.08em' }}>
                {label}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--charcoal)', fontWeight: 600, marginTop: '1px', lineHeight: 1.2 }}>
                {val || '—'}
              </div>
            </div>
          ))}
        </div>

        {/* Card Footer Actions */}
        <div style={{ marginTop: 'auto', paddingTop: '0.65rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.45rem' }}>
          <button
            onClick={(e) => { e.stopPropagation(); onOpenModal && onOpenModal(sample); }}
            style={{
              flex: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
              padding: '0.55rem',
              background: 'var(--charcoal)',
              color: 'var(--white)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.8rem', fontWeight: 700,
              cursor: 'pointer',
              transition: 'background 0.18s ease',
              fontFamily: 'var(--font-sans)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--red)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--charcoal)'; }}
          >
            <Eye size={13} />
            <span>View Specs</span>
          </button>

          {onRemoveFromGroup && (
            <button
              onClick={(e) => { e.stopPropagation(); onRemoveFromGroup(sample.sample_no); }}
              style={{
                padding: '0.55rem 0.8rem',
                background: 'transparent',
                color: 'var(--red)',
                border: '1.5px solid var(--red)',
                borderRadius: '8px',
                fontSize: '0.78rem', fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                fontFamily: 'var(--font-sans)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--red)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--red)'; }}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

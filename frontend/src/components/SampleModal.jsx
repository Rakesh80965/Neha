import React, { useState } from 'react';
import { X, Heart, Check, ImageOff, Layers } from 'lucide-react';
import { getApiUrl } from '../config';

const FABRIC_COLORS = [
  ['#1a1a2e','#16213e'],['#2d1b69','#11998e'],['#134e5e','#71b280'],
  ['#0f3460','#533483'],['#16213e','#0f3460'],['#1a1a2e','#e94560'],
  ['#2c3e50','#3498db'],['#1e3c72','#2a5298'],['#373b44','#4286f4'],
  ['#0d0d0d','#434343'],
];
const patternFor = (n) => FABRIC_COLORS[n % FABRIC_COLORS.length];

export const SampleModal = ({ sample, groups = [], onClose, onAddToWishlist }) => {
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [adding, setAdding] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  if (!sample) return null;

  const [colorA, colorB] = patternFor(sample.sample_no);

  const handleAdd = async () => {
    if (!selectedGroupId) return;
    setAdding(true);
    try {
      await onAddToWishlist(sample.sample_no, selectedGroupId);
      const groupObj = groups.find((g) => String(g.id) === String(selectedGroupId));
      setSuccessMsg(`Added to "${groupObj?.name || 'Wishlist'}" successfully!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e) {
      alert('Could not add to wishlist: ' + e.message);
    } finally {
      setAdding(false);
    }
  };

  const specs = [
    { label: 'Sample No',           val: sample.sample_no },
    { label: 'Article',             val: sample.article },
    { label: 'Product',             val: sample.product },
    { label: 'Yarn Type',           val: sample.yarn },
    { label: 'Count',               val: sample.count },
    { label: 'Construction',        val: sample.construction || '-' },
    { label: 'Composition / Blend', val: sample.blend },
    { label: 'Weave',               val: sample.weave },
    { label: 'Finish',              val: sample.finish },
    { label: 'GSM',                 val: sample.gsm },
    { label: 'Count Avg',           val: sample.count_avg || '-' },
  ];

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(14,14,14,0.75)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--white)',
          borderRadius: '24px',
          maxWidth: '960px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 40px 100px rgba(14,14,14,0.4)',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 420px) 1fr',
          border: '1.5px solid var(--border)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px', zIndex: 30,
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'var(--charcoal)',
            border: 'none', color: 'var(--white)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'background 0.2s ease, transform 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--red)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--charcoal)'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <X size={18} />
        </button>

        {/* ── LEFT COLUMN: FABRIC IMAGE DISPLAY ── */}
        <div
          style={{
            position: 'relative',
            background: `linear-gradient(135deg, ${colorA} 0%, ${colorB} 100%)`,
            borderRight: '1.5px solid var(--border)',
            minHeight: '480px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1.5rem',
            overflow: 'hidden',
          }}
        >
          {/* Weave Dot Pattern Background */}
          <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: '8px', padding: '20px', opacity: 0.12, pointerEvents: 'none' }}>
            {Array.from({length: 64}).map((_,i) => (
              <div key={i} style={{ borderRadius: '50%', background: 'white', aspectRatio: '1' }} />
            ))}
          </div>

          {/* Actual Sample Image */}
          {!imgError && (
            <img
              src={getApiUrl(`/sample-image/${sample.sample_no}`)}
              alt={`Sample ${sample.sample_no}`}
              onError={() => { setImgError(true); setImgLoaded(true); }}
              onLoad={() => setImgLoaded(true)}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 25%',
                opacity: imgLoaded ? 1 : 0,
                transition: 'opacity 0.4s ease',
              }}
            />
          )}

          {/* Fallback Display */}
          {imgError && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
              <div style={{ fontSize: '54px', fontWeight: 900, color: 'rgba(255,255,255,0.18)', letterSpacing: '-0.04em' }}>
                #{sample.sample_no}
              </div>
              <Layers size={38} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                High-Res Photo Unavailable
              </span>
            </div>
          )}

          {/* Gradient Overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />

          {/* Top Tag Badges */}
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(8px)',
              padding: '4px 12px', borderRadius: '999px',
              fontSize: '11px', fontWeight: 800, color: 'var(--charcoal)',
              letterSpacing: '0.02em',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            }}>
              {sample.gsm} GSM
            </div>
            {sample.weave && (
              <div style={{
                background: 'rgba(14,14,14,0.75)',
                backdropFilter: 'blur(8px)',
                padding: '4px 12px', borderRadius: '999px',
                fontSize: '11px', fontWeight: 700, color: 'var(--white)',
                letterSpacing: '0.04em', textTransform: 'uppercase',
                border: '1px solid rgba(255,255,255,0.2)',
              }}>
                {sample.weave}
              </div>
            )}
          </div>

          {/* Bottom Title Badge on Image */}
          <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.65)', marginBottom: '4px' }}>
              Fabric Spec Sheet
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.05em', color: 'var(--white)', lineHeight: 1 }}>
              #{sample.sample_no}
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 500, color: 'rgba(255,255,255,0.85)', marginTop: '4px', letterSpacing: '-0.01em' }}>
              {sample.article}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: SPECIFICATIONS & ACTIONS ── */}
        <div style={{ padding: '2rem 2.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* Header */}
            <div style={{ paddingBottom: '1.25rem', marginBottom: '1.5rem', borderBottom: '1.5px solid var(--border)' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
                Technical Attributes
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--charcoal)', lineHeight: 1.1 }}>
                Sample Specifications
              </h2>
            </div>

            {/* Swiss Grid Tabular Specs */}
            <div
              style={{
                border: '1.5px solid var(--border)',
                borderRadius: '14px',
                overflow: 'hidden',
                marginBottom: '1.75rem',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                {specs.map((item, i) => (
                  <div
                    key={item.label}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRight: i % 2 === 0 ? '1.5px solid var(--border)' : 'none',
                      borderBottom: i < specs.length - (specs.length % 2 === 0 ? 2 : 1) ? '1.5px solid var(--border)' : 'none',
                      background: i % 4 === 0 || i % 4 === 3 ? 'var(--white)' : 'rgba(242,240,235,0.5)',
                    }}
                  >
                    <div style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '3px' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '0.92rem', color: 'var(--charcoal)', fontWeight: 700, letterSpacing: '-0.02em' }}>
                      {item.val || '—'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add to Wishlist Section */}
          <div style={{ borderTop: '1.5px solid var(--border)', paddingTop: '1.5rem' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-dim)', marginBottom: '0.65rem' }}>
              Save to Wishlist Folder
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'stretch' }}>
              <select
                className="input-field"
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                style={{ flex: 1, borderRadius: '10px' }}
              >
                <option value="">— Select Wishlist Group —</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>

              <button
                onClick={handleAdd}
                disabled={!selectedGroupId || adding}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0 1.4rem',
                  background: selectedGroupId ? 'var(--red)' : 'var(--bg-surface)',
                  color: selectedGroupId ? 'var(--white)' : 'var(--text-dim)',
                  border: `1.5px solid ${selectedGroupId ? 'var(--red)' : 'var(--border)'}`,
                  borderRadius: '10px',
                  fontSize: '0.88rem', fontWeight: 700,
                  cursor: selectedGroupId ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <Heart size={15} />
                <span>{adding ? 'Adding…' : 'Add to Wishlist'}</span>
              </button>
            </div>

            {successMsg && (
              <div
                style={{
                  marginTop: '0.75rem',
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  background: 'rgba(34,197,94,0.08)',
                  border: '1.5px solid rgba(34,197,94,0.25)',
                  color: '#16A34A',
                  fontSize: '0.85rem', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}
              >
                <Check size={15} />
                <span>{successMsg}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

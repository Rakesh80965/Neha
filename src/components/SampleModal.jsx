import React, { useState } from 'react';
import { X, Heart, Plus, Check, ImageOff } from 'lucide-react';
import { getApiUrl } from '../config';

export const SampleModal = ({ sample, groups = [], onClose, onAddToWishlist, onCreateGroup }) => {
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [adding, setAdding] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [imgError, setImgError] = useState(false);

  if (!sample) return null;

  const handleAdd = async () => {
    if (!selectedGroupId) return;
    setAdding(true);
    try {
      await onAddToWishlist(sample.sample_no, selectedGroupId);
      const groupObj = groups.find((g) => String(g.id) === String(selectedGroupId));
      const gName = groupObj ? groupObj.name : 'Wishlist';
      setSuccessMsg(`Added to "${gName}" successfully!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e) {
      alert('Could not add to wishlist: ' + e.message);
    } finally {
      setAdding(false);
    }
  };

  const specs = [
    { label: 'Sample No', val: sample.sample_no },
    { label: 'Article', val: sample.article },
    { label: 'Product', val: sample.product },
    { label: 'Yarn Type', val: sample.yarn },
    { label: 'Count', val: sample.count },
    { label: 'Construction', val: sample.construction || '-' },
    { label: 'Composition / Blend', val: sample.blend },
    { label: 'Weave', val: sample.weave },
    { label: 'Finish', val: sample.finish },
    { label: 'GSM', val: sample.gsm },
    { label: 'Count Avg', val: sample.count_avg || '-' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        background: 'rgba(11, 19, 41, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.25s ease',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '780px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.7)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#FFFFFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'all 0.2s ease',
          }}
        >
          <X size={20} />
        </button>

        {/* Top Image Banner */}
        <div style={{ height: '320px', background: '#0B1329', position: 'relative' }}>
          {!imgError ? (
            <img
              src={getApiUrl(`/sample-image/${sample.sample_no}`)}
              alt={`Sample ${sample.sample_no}`}
              onError={() => setImgError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (

            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-dim)',
                gap: '0.6rem',
              }}
            >
              <ImageOff size={42} />
              <span>Full resolution photo unavailable</span>
            </div>
          )}
        </div>

        {/* Modal Content */}
        <div style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--gold-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Fabric Specification Sheet
            </div>
            <h2 style={{ fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 800, marginTop: '0.2rem' }}>
              Sample #{sample.sample_no} &mdash; <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>{sample.article}</span>
            </h2>
          </div>

          {/* Specs Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '1.2rem',
              marginBottom: '2rem',
              background: 'rgba(255, 255, 255, 0.02)',
              padding: '1.4rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {specs.map((item) => (
              <div key={item.label}>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.05em' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '0.98rem', color: '#FFFFFF', fontWeight: 600, marginTop: '0.2rem' }}>
                  {item.val || '-'}
                </div>
              </div>
            ))}
          </div>

          {/* Add to Wishlist Bar */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              background: 'rgba(245, 158, 11, 0.08)',
              padding: '1.2rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
            }}
          >
            <div style={{ flex: 1, display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <select
                className="input-field"
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                style={{ flex: 1 }}
              >
                <option value="">-- Select Wishlist Group --</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id} style={{ background: '#0F172A', color: '#FFF' }}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAdd}
              disabled={!selectedGroupId || adding}
              className="btn-primary"
              style={{
                opacity: selectedGroupId ? 1 : 0.5,
                cursor: selectedGroupId ? 'pointer' : 'not-allowed',
                whiteSpace: 'nowrap',
              }}
            >
              <Heart size={18} />
              <span>{adding ? 'Adding...' : 'Add to Wishlist'}</span>
            </button>
          </div>

          {successMsg && (
            <div
              style={{
                marginTop: '1rem',
                padding: '0.8rem 1.2rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34D399',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Check size={18} />
              <span>{successMsg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

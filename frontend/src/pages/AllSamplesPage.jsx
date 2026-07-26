import React, { useState, useEffect } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { SampleCard } from '../components/SampleCard';
import { getApiUrl } from '../config';
import { FALLBACK_SAMPLES } from '../data/samplesData';

export const AllSamplesPage = ({ onOpenModal }) => {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const fetchSamples = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(getApiUrl('/api/samples'), { credentials: 'include' });
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || contentType.includes('text/html') || res.redirected) {
        setSamples(FALLBACK_SAMPLES);
        return;
      }
      const data = await res.json();
      if (data && Array.isArray(data.samples) && data.samples.length > 0) {
        setSamples(data.samples);
      } else {
        setSamples(FALLBACK_SAMPLES);
      }
    } catch (err) {
      setSamples(FALLBACK_SAMPLES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSamples(); }, []);

  const filteredSamples = samples.filter((s) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      String(s.sample_no).includes(term) ||
      (s.article && s.article.toLowerCase().includes(term)) ||
      (s.blend && s.blend.toLowerCase().includes(term)) ||
      (s.product && s.product.toLowerCase().includes(term)) ||
      (s.weave && s.weave.toLowerCase().includes(term)) ||
      (s.yarn && s.yarn.toLowerCase().includes(term))
    );
  });

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Editorial page header */}
      <div
        style={{
          paddingBottom: '2rem',
          marginBottom: '2rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
            Catalog Database
          </div>
          <h2
            style={{
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 900,
              letterSpacing: '-0.045em',
              lineHeight: 0.95,
              color: 'var(--charcoal)',
            }}
          >
            All Fabric<br />Samples
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-pill)',
              padding: '0.4rem 1rem',
              letterSpacing: '-0.01em',
            }}
          >
            {filteredSamples.length} / {samples.length} samples
          </span>
          <button onClick={fetchSamples} className="btn-secondary" style={{ gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div style={{ marginBottom: '2rem', position: 'relative', maxWidth: '480px' }}>
        <input
          type="text"
          className="input-field"
          placeholder="Search by sample #, article, blend, yarn…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ paddingLeft: '2.7rem' }}
        />
        <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      </div>

      {/* Loading */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <div
            style={{
              display: 'inline-block',
              width: '32px', height: '32px',
              border: '2.5px solid rgba(14,14,14,0.1)',
              borderTopColor: 'var(--charcoal)',
              borderRadius: '50%',
              animation: 'spin 0.75s linear infinite',
            }}
          />
          <p style={{ marginTop: '1rem', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Loading sample catalog…
          </p>
        </div>
      ) : error ? (
        <div
          style={{
            padding: '1rem 1.25rem',
            background: 'rgba(232,51,26,0.07)',
            border: '1.5px solid rgba(232,51,26,0.2)',
            color: 'var(--red)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      ) : (
        <div
          className="animate-fade-in"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(265px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {filteredSamples.map((sample) => (
            <SampleCard key={sample.sample_no} sample={sample} onOpenModal={onOpenModal} />
          ))}
        </div>
      )}
    </div>
  );
};

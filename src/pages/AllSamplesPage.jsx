import React, { useState, useEffect } from 'react';
import { Search, Grid, RefreshCw } from 'lucide-react';
import { SampleCard } from '../components/SampleCard';
import { getApiUrl } from '../config';

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
      if (!res.ok) throw new Error('Failed to load samples');
      const data = await res.json();
      setSamples(data.samples || []);
    } catch (err) {
      setError('Could not fetch sample catalog.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchSamples();
  }, []);

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
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--gold-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Catalog Database
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.2rem' }}>
            All Fabric Samples
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span
            style={{
              background: 'rgba(245, 158, 11, 0.15)',
              color: 'var(--gold-400)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              padding: '0.5rem 1.1rem',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '0.88rem',
            }}
          >
            {filteredSamples.length} of {samples.length} Samples
          </span>

          <button onClick={fetchSamples} className="btn-secondary" title="Refresh list">
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Quick Filter Search Input */}
      <div style={{ marginBottom: '2rem', position: 'relative', maxWidth: '480px' }}>
        <input
          type="text"
          className="input-field"
          placeholder="Quick search by sample #, article, blend, yarn..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ paddingLeft: '2.8rem' }}
        />
        <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
      </div>

      {/* Loading state */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gold-400)' }}>
          <div style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid rgba(245,158,11,0.2)', borderTopColor: '#F59E0B', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading full sample catalog...</p>
        </div>
      ) : error ? (
        <div style={{ padding: '1rem', background: 'rgba(153,27,27,0.2)', border: '1px solid #EF4444', color: '#F87171', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: '1.6rem',
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

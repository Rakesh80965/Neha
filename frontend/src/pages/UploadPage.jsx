import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, X, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { getApiUrl } from '../config';

export const UploadPage = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [previewData, setPreviewData] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.name.match(/\.(xlsx|xlsm)$/i)) { setError('Please select an Excel (.xlsx or .xlsm) file.'); return; }
    setFile(selectedFile); setError(''); setResultData(null);
    previewSheet(selectedFile);
  };

  const previewSheet = async (fileObj) => {
    setLoading(true); setLoadingText('Parsing Excel workbook & extracting embedded images…'); setError(''); setPreviewData(null);
    const formData = new FormData();
    formData.append('file', fileObj);
    try {
      const res = await fetch(getApiUrl('/api/upload-samples/preview'), { method: 'POST', credentials: 'include', body: formData });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to preview sheet');
      setPreviewData(data);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const handleConfirmUpload = async () => {
    if (!file) return;
    setLoading(true); setLoadingText('Saving records & uploading images to Supabase…'); setError('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(getApiUrl('/api/upload-samples'), { method: 'POST', credentials: 'include', body: formData });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to save samples');
      setResultData(data); setPreviewData(null); setFile(null);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const handleClear = () => { setFile(null); setPreviewData(null); setResultData(null); setError(''); };

  const cols = ['product', 'yarn', 'count', 'construction', 'blend', 'weave', 'finish', 'gsm'];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Editorial header */}
      <div
        style={{
          paddingBottom: '2rem',
          marginBottom: '2rem',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
          Bulk Data Import
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
          Upload<br />Fabric Samples
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.6rem', maxWidth: '520px', lineHeight: 1.5 }}>
          Import Excel sheets with attributes in rows and embedded photos. Preview before committing to database.
        </p>
      </div>

      {/* Drag & Drop */}
      {!previewData && !resultData && (
        <div
          style={{
            background: 'var(--white)',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            marginBottom: '2rem',
          }}
        >
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) handleFileSelect(e.dataTransfer.files[0]); }}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? 'var(--charcoal)' : 'var(--border-mid)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '3.5rem 2rem',
              textAlign: 'center',
              background: dragOver ? 'rgba(14,14,14,0.04)' : 'var(--bg-surface)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx,.xlsm"
              style={{ display: 'none' }}
              onChange={(e) => e.target.files.length && handleFileSelect(e.target.files[0])}
            />

            <div
              style={{
                width: '60px', height: '60px', borderRadius: '50%',
                background: 'var(--charcoal)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--white)', marginBottom: '1rem',
              }}
            >
              <UploadCloud size={28} />
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--charcoal)', marginBottom: '0.35rem' }}>
              {file ? file.name : 'Click to select file, or drag & drop here'}
            </h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: 500 }}>
              Accepts .xlsx or .xlsm files with embedded fabric sample photos
            </p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '2.5px solid rgba(14,14,14,0.1)', borderTopColor: 'var(--charcoal)', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
          <p style={{ marginTop: '1rem', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>{loadingText}</p>
        </div>
      )}

      {error && (
        <div style={{ padding: '0.85rem 1rem', background: 'rgba(232,51,26,0.07)', border: '1.5px solid rgba(232,51,26,0.2)', color: 'var(--red)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.88rem', fontWeight: 600 }}>
          {error}
        </div>
      )}

      {/* Preview Table */}
      {previewData && !loading && (
        <div
          className="animate-fade-in"
          style={{
            background: 'var(--white)',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            marginBottom: '2rem',
          }}
        >
          {/* Preview header */}
          <div
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '1.25rem 1.75rem',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-surface)',
              flexWrap: 'wrap', gap: '1rem',
            }}
          >
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--charcoal)' }}>
                Sheet Preview — Review Before Saving
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>File: {file?.name}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button onClick={handleClear} className="btn-secondary" style={{ gap: '0.4rem' }}>
                <X size={14} /><span>Cancel</span>
              </button>
              <button onClick={handleConfirmUpload} className="btn-primary-red" style={{ gap: '0.4rem' }}>
                <CheckCircle2 size={16} />
                <span>Confirm & Save {previewData.summary.total} Sample(s)</span>
              </button>
            </div>
          </div>

          {/* Summary stats */}
          <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--border)' }}>
            {[
              { label: 'Total', val: previewData.summary.total, color: 'var(--charcoal)' },
              { label: 'New', val: previewData.summary.new, color: '#22C55E' },
              { label: 'Updates', val: previewData.summary.updates, color: '#F59E0B' },
              { label: 'With Images', val: previewData.summary.with_image, color: '#3B82F6' },
              ...(previewData.summary.with_issues > 0 ? [{ label: 'Needs Check', val: previewData.summary.with_issues, color: 'var(--red)' }] : []),
            ].map(({ label, val, color }, i, arr) => (
              <div
                key={label}
                style={{
                  flex: 1, padding: '1.1rem 1.25rem',
                  borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <div style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.04em', color }}>{val}</div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.08em', fontWeight: 700 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
                  {['Photo', 'Sample #', 'Status', 'Article', ...cols].map((h) => (
                    <th key={h} style={{ padding: '0.7rem 1rem', textAlign: 'left', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-dim)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.records.map((r, i) => {
                  const iss = new Set(r.issues || []);
                  const isNew = r.status === 'new';
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 ? 'var(--bg-surface)' : 'var(--white)' }}>
                      <td style={{ padding: '0.5rem 1rem' }}>
                        {r.thumb ? (
                          <img src={r.thumb} alt="" style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }} />
                        ) : (
                          <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', border: '1px solid var(--border)' }}>
                            <ImageIcon size={16} />
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '0.7rem 1rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--charcoal)' }}>{r.sample_no}</td>
                      <td style={{ padding: '0.7rem 1rem' }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-pill)', background: isNew ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)', color: isNew ? '#16A34A' : '#B45309', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                          {isNew ? 'New' : 'Update'}
                        </span>
                      </td>
                      <td style={{ padding: '0.7rem 1rem', color: iss.has('article') ? 'var(--red)' : 'var(--text-main)', fontWeight: 500 }}>{r.article || '—'}</td>
                      {cols.map((c) => (
                        <td key={c} style={{ padding: '0.7rem 1rem', color: iss.has(c) ? 'var(--red)' : 'var(--text-muted)' }}>
                          {r[c] !== null && r[c] !== undefined ? String(r[c]) : '—'}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Success */}
      {resultData && !loading && (
        <div
          className="animate-fade-in"
          style={{
            background: 'var(--white)',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
          }}
        >
          <div style={{ background: 'var(--charcoal)', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CheckCircle2 size={28} color="#22C55E" />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--white)' }}>
                Import Completed!
              </h3>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 0 }}>
            {[
              { label: 'Samples Processed', val: resultData.samples_added },
              { label: 'Sample Range', val: resultData.sample_range ? `${resultData.sample_range[0]}–${resultData.sample_range[1]}` : '—' },
              { label: 'Photos Uploaded', val: resultData.images_uploaded },
            ].map(({ label, val }, i, arr) => (
              <div key={label} style={{ padding: '1.5rem', borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.05em', color: 'var(--charcoal)' }}>{val}</div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', fontWeight: 700, marginTop: '4px' }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
            <button onClick={handleClear} className="btn-primary" style={{ gap: '0.4rem' }}>
              <span>Upload Another Sheet</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

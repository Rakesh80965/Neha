import React, { useState, useRef } from 'react';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertTriangle, X, ArrowRight, Image as ImageIcon } from 'lucide-react';
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
    if (!selectedFile.name.match(/\.(xlsx|xlsm)$/i)) {
      setError('Please select an Excel (.xlsx or .xlsm) file.');
      return;
    }
    setFile(selectedFile);
    setError('');
    setResultData(null);
    previewSheet(selectedFile);
  };

  const previewSheet = async (fileObj) => {
    setLoading(true);
    setLoadingText('Parsing Excel workbook & extracting embedded images...');
    setError('');
    setPreviewData(null);

    const formData = new FormData();
    formData.append('file', fileObj);

    try {
      const res = await fetch(getApiUrl('/api/upload-samples/preview'), {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to preview sheet');

      setPreviewData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmUpload = async () => {
    if (!file) return;
    setLoading(true);
    setLoadingText('Saving database records & uploading high-res images to Supabase...');
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(getApiUrl('/api/upload-samples'), {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to save samples');

      setResultData(data);
      setPreviewData(null);
      setFile(null);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreviewData(null);
    setResultData(null);
    setError('');
  };

  const cols = ['product', 'yarn', 'count', 'construction', 'blend', 'weave', 'finish', 'gsm'];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--emerald-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Bulk Data Import
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.2rem' }}>
          Upload Fabric Samples
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.3rem' }}>
          Import standard Excel sheets with attributes in rows and embedded photos in the IMAGE row. Review full preview table before committing.
        </p>
      </div>

      {/* Drag & Drop Card */}
      {!previewData && !resultData && (
        <div
          className="glass-panel"
          style={{
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            marginBottom: '2rem',
            borderTop: '3px solid var(--emerald-500)',
          }}
        >
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files.length) handleFileSelect(e.dataTransfer.files[0]);
            }}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            style={{
              border: `2px dashed ${dragOver ? '#10B981' : 'rgba(255, 255, 255, 0.15)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '3rem 2rem',
              textAlign: 'center',
              background: dragOver ? 'rgba(16, 185, 129, 0.1)' : 'rgba(15, 23, 42, 0.4)',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
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
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                marginBottom: '1rem',
              }}
            >
              <UploadCloud size={32} />
            </div>

            <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 700 }}>
              {file ? file.name : 'Click to select an Excel file, or drag & drop here'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.4rem' }}>
              Accepts .xlsx or .xlsm files with embedded fabric sample photos
            </p>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--emerald-500)' }}>
          <div style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid rgba(16,185,129,0.2)', borderTopColor: '#10B981', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ marginTop: '1rem', color: 'var(--text-main)', fontWeight: 600 }}>{loadingText}</p>
        </div>
      )}

      {error && (
        <div style={{ padding: '1.2rem', background: 'rgba(153,27,27,0.25)', border: '1px solid #EF4444', color: '#F87171', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {/* Preview Table */}
      {previewData && !loading && (
        <div className="glass-panel animate-fade-in" style={{ borderRadius: 'var(--radius-xl)', padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 700 }}>
                Sheet Preview &mdash; Review Before Saving
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                File: {file?.name}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button onClick={handleClear} className="btn-secondary">
                <X size={16} />
                <span>Cancel</span>
              </button>

              <button onClick={handleConfirmUpload} className="btn-primary" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
                <CheckCircle2 size={18} />
                <span>Confirm &amp; Save {previewData.summary.total} Sample(s)</span>
              </button>
            </div>
          </div>

          {/* Summary Chips */}
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>{previewData.summary.total}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Total</span>
            </div>
            <div style={{ background: 'rgba(16,185,129,0.1)', padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.3)' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34D399' }}>{previewData.summary.new}</span>
              <span style={{ fontSize: '0.72rem', color: '#34D399', display: 'block', textTransform: 'uppercase' }}>New</span>
            </div>
            <div style={{ background: 'rgba(245,158,11,0.1)', padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid rgba(245,158,11,0.3)' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FBBF24' }}>{previewData.summary.updates}</span>
              <span style={{ fontSize: '0.72rem', color: '#FBBF24', display: 'block', textTransform: 'uppercase' }}>Updates</span>
            </div>
            <div style={{ background: 'rgba(59,130,246,0.1)', padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid rgba(59,130,246,0.3)' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#60A5FA' }}>{previewData.summary.with_image}</span>
              <span style={{ fontSize: '0.72rem', color: '#60A5FA', display: 'block', textTransform: 'uppercase' }}>Images</span>
            </div>
            {previewData.summary.with_issues > 0 && (
              <div style={{ background: 'rgba(239,68,68,0.1)', padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.3)' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F87171' }}>{previewData.summary.with_issues}</span>
                <span style={{ fontSize: '0.72rem', color: '#F87171', display: 'block', textTransform: 'uppercase' }}>Needs Check</span>
              </div>
            )}
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ background: 'rgba(15, 23, 42, 0.9)', color: 'var(--gold-400)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Photo</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Sample #</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Article</th>
                  {cols.map((c) => (
                    <th key={c} style={{ padding: '0.75rem 1rem', textAlign: 'left', textTransform: 'capitalize' }}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.records.map((r, i) => {
                  const iss = new Set(r.issues || []);
                  const isNew = r.status === 'new';

                  return (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)', background: i % 2 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                      <td style={{ padding: '0.5rem 1rem' }}>
                        {r.thumb ? (
                          <img src={r.thumb} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                        ) : (
                          <div style={{ width: '40px', height: '40px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
                            <ImageIcon size={18} />
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#FFF' }}>{r.sample_no}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '12px', background: isNew ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)', color: isNew ? '#34D399' : '#FBBF24' }}>
                          {isNew ? 'NEW' : 'UPDATE'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: iss.has('article') ? '#F87171' : 'var(--text-main)' }}>{r.article || '-'}</td>
                      {cols.map((c) => (
                        <td key={c} style={{ padding: '0.75rem 1rem', color: iss.has(c) ? '#F87171' : 'var(--text-muted)' }}>
                          {r[c] !== null && r[c] !== undefined ? String(r[c]) : '-'}
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

      {/* Confirmation Success Result Card */}
      {resultData && !loading && (
        <div className="glass-panel animate-fade-in" style={{ borderRadius: 'var(--radius-xl)', padding: '2.5rem', borderTop: '4px solid #10B981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#34D399', marginBottom: '1.2rem' }}>
            <CheckCircle2 size={32} />
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>
              Import Completed Successfully!
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Samples Processed</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFF', marginTop: '0.2rem' }}>{resultData.samples_added}</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Sample Range</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFF', marginTop: '0.2rem' }}>{resultData.sample_range ? `${resultData.sample_range[0]} – ${resultData.sample_range[1]}` : '-'}</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Photos Uploaded</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#34D399', marginTop: '0.2rem' }}>{resultData.images_uploaded}</div>
            </div>
          </div>

          <button onClick={handleClear} className="btn-primary" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
            <span>Upload Another Sheet</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

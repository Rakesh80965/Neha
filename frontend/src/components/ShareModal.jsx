import React, { useState } from 'react';
import { X, FileDown, Check, Copy, Printer } from 'lucide-react';
import { generateFDSPDF } from '../utils/pdfGenerator';

export const ShareModal = ({ isOpen, onClose, fdsNo, buyerName, enquiryId, samples = [], printableId = 'fds-report-printable-area' }) => {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const targetId = document.getElementById(printableId) ? printableId : 'share-modal-pdf-template';
  const displayId = fdsNo || enquiryId || 'Order';
  const title = `NSL Feasibility Report (${displayId})`;
  const shareText = `NSL Feasibility & Buyer Order\nBuyer: ${buyerName || 'Client'}\nFDS No / ID: ${displayId}\nSamples: ${samples.map((s) => `#${s.sample_no}`).join(', ') || 'Standard'}\nStatus: Completed 🎉`;

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      await generateFDSPDF(
        targetId,
        `NSL_FDS_${displayId}.pdf`,
        title,
        shareText
      );
    } catch (e) {
      alert('Could not download PDF: ' + e.message);
    } finally {
      setDownloading(false);
    }
  };

  const handleWhatsApp = () => {
    handleDownloadPDF();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleEmail = () => {
    handleDownloadPDF();
    const url = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1200,
        background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff', border: '1.5px solid #cbd5e1',
          borderRadius: '20px', maxWidth: '440px', width: '100%',
          padding: '1.75rem', boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
          position: 'relative', fontFamily: 'var(--font-sans)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            width: '32px', height: '32px', borderRadius: '50%',
            background: '#1e293b', border: 'none', color: '#fff',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <X size={16} />
        </button>

        <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#dc2626', marginBottom: '4px' }}>
          Share & Export Options
        </div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '1.25rem' }}>
          Share {displayId}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {/* Download PDF Option */}
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.85rem 1.1rem', background: '#fef2f2', border: '1.5px solid #fecaca',
              borderRadius: '12px', color: '#dc2626', fontWeight: 800, fontSize: '0.9rem',
              cursor: downloading ? 'wait' : 'pointer', transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <FileDown size={18} />
              <span>{downloading ? 'Generating PDF...' : 'Download FDS Report PDF'}</span>
            </div>
            <span style={{ fontSize: '0.72rem', background: '#dc2626', color: '#fff', padding: '2px 8px', borderRadius: '6px' }}>PDF</span>
          </button>

          {/* WhatsApp Option */}
          <button
            onClick={handleWhatsApp}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.85rem 1.1rem', background: '#f0fdf4', border: '1.5px solid #bbf7d0',
              borderRadius: '12px', color: '#16a34a', fontWeight: 800, fontSize: '0.9rem',
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '1.2rem' }}>💬</span>
              <span>Share via WhatsApp</span>
            </div>
          </button>

          {/* Email Option */}
          <button
            onClick={handleEmail}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.85rem 1.1rem', background: '#eff6ff', border: '1.5px solid #bfdbfe',
              borderRadius: '12px', color: '#2563eb', fontWeight: 800, fontSize: '0.9rem',
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '1.2rem' }}>✉️</span>
              <span>Share via Email</span>
            </div>
          </button>

          {/* Copy Option */}
          <button
            onClick={handleCopy}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.85rem 1.1rem', background: '#f8fafc', border: '1.5px solid #cbd5e1',
              borderRadius: '12px', color: '#0f172a', fontWeight: 800, fontSize: '0.9rem',
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {copied ? <Check size={18} color="#16a34a" /> : <Copy size={18} />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary & Details'}</span>
            </div>
          </button>

          {/* Print Fallback */}
          <button
            onClick={() => window.print()}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.85rem 1.1rem', background: '#ffffff', border: '1.5px solid #e2e8f0',
              borderRadius: '12px', color: '#64748b', fontWeight: 700, fontSize: '0.88rem',
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Printer size={18} />
              <span>Print / Save as PDF via Browser</span>
            </div>
          </button>
        </div>

        <button onClick={onClose} className="btn-secondary" style={{ width: '100%' }}>
          Done
        </button>

        {/* HIDDEN COMPLETE FDS PDF TEMPLATE CONTAINER (Guarantees PDF element is ALWAYS found) */}
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '800px', pointerEvents: 'none' }}>
          <div id="share-modal-pdf-template" style={{ padding: '20px', background: '#ffffff', color: '#0f172a', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '900', color: '#dc2626' }}>NSL TEXTILES LTD</div>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase' }}>Cotton to Clothing — Official Feasibility & Buyer Report</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold' }}>FDS NO: <span style={{ color: '#dc2626' }}>{displayId}</span></div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>DATE: {new Date().toLocaleDateString('en-GB')}</div>
              </div>
            </div>

            <div style={{ marginBottom: '15px', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px', color: '#1e293b' }}>1. Buyer Order Specifications</div>
              <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '4px', fontWeight: 'bold', color: '#475569' }}>End Buyer:</td>
                    <td style={{ padding: '4px', fontWeight: 'bold', color: '#0f172a' }}>{buyerName || 'Client'}</td>
                    <td style={{ padding: '4px', fontWeight: 'bold', color: '#475569' }}>Order / FDS ID:</td>
                    <td style={{ padding: '4px', fontWeight: 'bold', color: '#0f172a' }}>{displayId}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px', fontWeight: 'bold', color: '#475569' }}>Status:</td>
                    <td style={{ padding: '4px', fontWeight: 'bold', color: '#16a34a' }}>Completed & Finalized</td>
                    <td style={{ padding: '4px', fontWeight: 'bold', color: '#475569' }}>Selected Samples:</td>
                    <td style={{ padding: '4px', fontWeight: 'bold', color: '#0f172a' }}>{samples.map(s => `#${s.sample_no}`).join(', ') || 'Standard'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {samples && samples.length > 0 && (
              <div style={{ marginBottom: '15px', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>2. Selected Fabric Samples ({samples.length})</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {samples.map((s) => (
                    <div key={s.sample_no} style={{ border: '1px solid #cbd5e1', padding: '6px 10px', borderRadius: '4px', background: '#fafafa', fontSize: '10px' }}>
                      <strong>#{s.sample_no}</strong> — {s.article || 'Standard'} | {s.gsm || 140} GSM | {s.weave || 'TWILL'} | {s.blend || 'COTTON'}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ border: '1px solid #0f172a', padding: '8px', borderRadius: '4px' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>3. NSL Feasibility Technical Attributes & Test Commitments</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9' }}>
                    <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'left' }}>Test Parameter</th>
                    <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'left' }}>Customer Requirement</th>
                    <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'left' }}>NSL Commitment</th>
                    <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'left' }}>Test Method</th>
                    <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'left' }}>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'FABRIC WEIGHT', req: '+/-5%', commit: '+/-5%', method: 'ISO 3801', rem: '' },
                    { name: 'YARN COUNT', req: '+/-5%', commit: '+/-5%', method: 'ISO 7221-5', rem: '' },
                    { name: 'CONSTRUCTION', req: '+/-5%', commit: '+/-5%', method: 'EN 1049-2', rem: '' },
                    { name: 'FABRIC WIDTH', req: '-', commit: '+/-1"', method: 'IHM', rem: '' },
                    { name: 'FIBER CONTENT', req: '-', commit: '100% COTTON', method: 'AATCC20/20A:2018', rem: '' },
                    { name: 'DIMENSIONAL STABILITY', req: '+1 TO -3%', commit: '+1 TO -5%', method: 'ISO 6330', rem: 'MILL RESPONSIBLE FOR HOME LAUNDRY ONLY' },
                    { name: 'TEAR STRENGTH', req: '1.0 KGF', commit: '1.0 KGF', method: 'ISO 13937-1', rem: '' },
                    { name: 'TENSILE STRENGTH', req: '16 KGF', commit: 'WARP:16 KGF, WEFT: 9 KGF', method: 'ISO 13934-2', rem: '' },
                    { name: 'SEAM SLIPPAGE', req: '6MM @ 10 KGF', commit: '6MM @ 8 KGF', method: 'ISO 13936-1', rem: '' },
                    { name: 'SEAM STRENGTH', req: '6MM @ 14 KGF', commit: '6MM @ 12 KGF', method: 'ISO 13935-2', rem: '' },
                    { name: 'BOW', req: '-', commit: '3.0%', method: 'ASTM D 3882', rem: '' },
                    { name: 'SKEW', req: '-', commit: '4.0%', method: 'ASTM D 3882', rem: 'AFTERWASH SKEW 5%-6%' },
                    { name: 'PH VALUE', req: '4.0 - 7.5', commit: '4.0 - 7.5', method: 'ISO 3071', rem: '' },
                    { name: 'CF TO WASHING', req: 'CC:4,CS:4,SS:4-5', commit: 'CC:4,CS:4, DK COLORS 3-4,SS:4-5', method: 'ISO 105 C06', rem: '' },
                    { name: 'CF TO RUBBING-DRY', req: '4-5,DARK COLORS:4', commit: '4, DARK SHADES:3-4', method: 'ISO 105 X12', rem: '' },
                    { name: 'CF TO RUBBING-WET', req: '4,DARK COLORS:3-4', commit: '3, DARK SHADES:2-3', method: 'ISO 105 X12', rem: '' },
                    { name: 'CF TO PERSPIRATION', req: 'CC:4,CS:4,SS:4-5', commit: 'CC:4,CS:4, DK COLORS 3-4,SS:4-5', method: 'ISO 105 E04', rem: 'FOR ALL OVER PRINT ONLY' },
                    { name: 'CF TO WATER', req: '-', commit: 'CC:4,CS:4, DK COLORS 3-4,SS:4-5', method: 'ISO 105 E01', rem: '' },
                    { name: 'CF TO LIGHT', req: '4', commit: 'LIGHT SHADES:3 / OTHERS:3-4', method: 'ISO 105 B02', rem: 'SPECIALLY ON FLUOROCENT DYE' },
                  ].map((row, idx) => (
                    <tr key={idx} style={{ background: idx % 2 === 0 ? '#fff' : '#f9fafb' }}>
                      <td style={{ border: '1px solid #000', padding: '3px 5px', fontWeight: 'bold' }}>{row.name}</td>
                      <td style={{ border: '1px solid #000', padding: '3px 5px' }}>{row.req}</td>
                      <td style={{ border: '1px solid #000', padding: '3px 5px', fontWeight: 'bold', color: '#059669' }}>{row.commit}</td>
                      <td style={{ border: '1px solid #000', padding: '3px 5px', color: '#475569' }}>{row.method}</td>
                      <td style={{ border: '1px solid #000', padding: '3px 5px' }}>{row.rem || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

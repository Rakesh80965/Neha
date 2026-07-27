import React, { useState } from 'react';
import { X, FileDown, Check, Copy, Printer } from 'lucide-react';
import { generateFDSPDF } from '../utils/pdfGenerator';

export const ShareModal = ({ isOpen, onClose, fdsNo, buyerName, enquiryId, samples = [], printableId = 'fds-report-printable-area' }) => {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const title = `NSL Feasibility Report (${fdsNo || enquiryId || 'Order'})`;
  const shareText = `NSL Feasibility & Buyer Order\nBuyer: ${buyerName || 'Client'}\nFDS No / ID: ${fdsNo || enquiryId}\nSamples: ${samples.map((s) => `#${s.sample_no}`).join(', ') || 'Standard'}\nStatus: Completed 🎉`;

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      await generateFDSPDF(
        printableId,
        `NSL_FDS_${fdsNo || enquiryId || 'Report'}.pdf`,
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
          Share {fdsNo || enquiryId || 'Order Report'}
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
      </div>
    </div>
  );
};

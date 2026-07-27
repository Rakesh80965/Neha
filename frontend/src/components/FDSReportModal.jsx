import React, { useState } from 'react';
import { X, CheckCircle, Share2, Printer, Send, Layers, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

const DEFAULT_PARAMETERS = [
  { name: 'FABRIC WEIGHT', method: 'ISO 3801', custReq: '+/-5%', nslCommit: '+/-5%', remarks: '' },
  { name: 'YARN COUNT', method: 'ISO 7221-5', custReq: '+/-5%', nslCommit: '+/-5%', remarks: '' },
  { name: 'CONSTRUCTION', method: 'EN 1049-2', custReq: '+/-5%', nslCommit: '+/-5%', remarks: '' },
  { name: 'FABRIC WIDTH', method: 'IHM', custReq: '-', nslCommit: '+/-1"', remarks: '' },
  { name: 'FIBER CONTENT', method: 'AATCC20/20A:2018', custReq: '-', nslCommit: '100% COTTON', remarks: '' },
  { name: 'DIMENSIONAL STABILITY', method: 'ISO 6330', custReq: '+1 TO -3%', nslCommit: '+1 TO -5%', remarks: 'MILL WILL BE RESPONSIBLE FOR HOME LAUNDRY ONLY' },
  { name: 'TEAR STRENGTH', method: 'ISO 13937-1', custReq: '1.0 KGF', nslCommit: '1.0 KGF', remarks: '' },
  { name: 'TENSILE STRENGTH', method: 'ISO 13934-2', custReq: '16 KGF', nslCommit: 'WARP:16 KGF , WEFT: 9 KGF', remarks: '' },
  { name: 'SEAM SLIPPAGE', method: 'ISO 13936-1', custReq: '6MM @ 10 KGF', nslCommit: '6MM @ 8 KGF', remarks: '' },
  { name: 'SEAM STRENGTH', method: 'ISO 13935-2', custReq: '6MM @ 14 KGF', nslCommit: '6MM @ 12 KGF', remarks: '' },
  { name: 'BOW', method: 'ASTM D 3882', custReq: '-', nslCommit: '3.0%', remarks: '' },
  { name: 'SKEW', method: 'ASTM D 3882', custReq: '-', nslCommit: '4.0%', remarks: 'AFTERWASH SKEWMOVEMENT WILL BE 5%-6%(AATCC 179)' },
  { name: 'PH VALUE', method: 'ISO 3071', custReq: '4.0 - 7.5', nslCommit: '4.0 - 7.5', remarks: '' },
  { name: 'CF TO WASHING', method: 'ISO 105 C06', custReq: 'CC:4,CS:4,SS:4-5', nslCommit: 'CC:4,CS:4, DK COLORS 3-4,SS:4-5', remarks: '' },
  { name: 'CF TO RUBBING-DRY', method: 'ISO 105 X12', custReq: '4-5,DARK COLORS:4', nslCommit: '4, DARK SHADES :3-4', remarks: '' },
  { name: 'CF TO RUBBING-WET', method: 'ISO 105 X12', custReq: '4,DARK COLORS:3-4', nslCommit: '3, DARK SHADES:2-3', remarks: '' },
  { name: 'CF TO PERSPIRATION', method: 'ISO 105 E04', custReq: 'CC:4,CS:4,SS:4-5', nslCommit: 'CC:4,CS:4, DK COLORS 3-4,SS:4-5', remarks: 'FOR ALL OVER PRINT ONLY' },
  { name: 'CF TO WATER', method: 'ISO 105 E01', custReq: '-', nslCommit: 'CC:4,CS:4, DK COLORS 3-4,SS:4-5', remarks: '' },
  { name: 'CF TO LIGHT', method: 'ISO 105 B02', custReq: '4', nslCommit: 'LIGHT SHADES:3 / OTHERS:3-4', remarks: '(SPECIALLY ON FLUOROCENT DYE - IF REQUIRED)' },
];

export const FDSReportModal = ({ group, samples = [], onClose, onFinalizeSuccess }) => {
  const primarySample = samples[0] || {};

  const [fdsNo, setFdsNo] = useState(`NSL-FDS-0000${Math.floor(1000 + Math.random() * 9000)}`);
  const [dateStr, setDateStr] = useState(new Date().toISOString().slice(0, 10).split('-').reverse().join('.'));
  const [endBuyer, setEndBuyer] = useState(group?.group_name || 'BENETTON INDIA');
  const [quality, setQuality] = useState(
    primarySample.construction
      ? `${primarySample.count || '20CMP*2'}/${primarySample.construction}/${primarySample.weave || 'TWILL'}`
      : '20CMP*2/40CMPTFO/68*58/58"/TWILL-2/2/YD'
  );
  const [finishType, setFinishType] = useState(primarySample.finish || 'BRUSHED FACE SIDE');
  const [printStyle, setPrintStyle] = useState(primarySample.article || 'YY025K0828 & 829');
  const [fabricWeight, setFabricWeight] = useState(`${primarySample.gsm || 162}+/-5%`);

  const [parameters, setParameters] = useState(DEFAULT_PARAMETERS);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleParamChange = (index, field, value) => {
    setParameters((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const triggerCelebration = () => {
    const count = 250;
    const defaults = { origin: { y: 0.6 } };
    function fire(particleRatio, opts) {
      confetti({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio) });
    }
    fire(0.25, { spread: 35, startVelocity: 60 });
    fire(0.2, { spread: 75 });
    fire(0.35, { spread: 110, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 130, startVelocity: 30, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 140, startVelocity: 50 });
  };

  const handleSaveAndFinalize = () => {
    triggerCelebration();

    const finalizedEnquiry = {
      enquiry_id: `ENQ-FDS-${fdsNo}`,
      buyer_name: endBuyer,
      brand_name: endBuyer,
      date_received: new Date().toISOString().slice(0, 10),
      due_date: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      priority: 'High',
      stage: 'completed', // Live order tracking automatically completed!
      stageTimestamps: {
        received: `${new Date().toISOString().slice(0, 10)} 09:00`,
        approved: `${new Date().toISOString().slice(0, 10)} 11:00`,
        sent: `${new Date().toISOString().slice(0, 10)} 13:00`,
        buyer_approved: `${new Date().toISOString().slice(0, 10)} 15:00`,
        completed: `${new Date().toISOString().slice(0, 10)} 16:30`,
      },
      summary: `Finalized FDS Feasibility Order for ${endBuyer}. Includes ${samples.length} selected fabric samples: ${samples.map((s) => `#${s.sample_no}`).join(', ')}.`,
      selected_samples: samples,
      fds_report: {
        fdsNo,
        dateStr,
        endBuyer,
        quality,
        finishType,
        printStyle,
        fabricWeight,
        parameters,
      },
    };

    setIsSubmitted(true);
    if (onFinalizeSuccess) {
      onFinalizeSuccess(finalizedEnquiry);
    }
  };

  const shareText = `NSL Feasibility Report (${fdsNo})\nBuyer: ${endBuyer}\nSamples: ${samples.map((s) => `#${s.sample_no}`).join(', ')}\nStatus: Order Completed & Finalized 🎉`;

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleShareEmail = () => {
    const url = `mailto:?subject=${encodeURIComponent(`NSL Feasibility Report - ${fdsNo}`)}&body=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          maxWidth: '1000px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
          border: '1px solid #cbd5e1',
          position: 'relative',
          padding: '2rem',
          color: '#0f172a',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px', zIndex: 20,
            width: '34px', height: '34px', borderRadius: '50%',
            background: '#1e293b', border: 'none', color: '#ffffff',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #0f172a', paddingBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#dc2626' }}>
              NSL TEXTILES LTD — Cotton to Clothing
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a', margin: '2px 0 0' }}>
              NSL FEASIBILITY REPORT FORM (FDS)
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => window.print()} className="btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}>
              <Printer size={14} /> Print / PDF
            </button>
          </div>
        </div>

        {/* Success / Finalized Banner */}
        {isSubmitted && (
          <div
            style={{
              background: '#f0fdf4',
              border: '1.5px solid #86efac',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CheckCircle size={24} color="#16a34a" />
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#15803d' }}>
                  🎉 Order Finalized & Added to All Enquiries!
                </div>
                <div style={{ fontSize: '0.82rem', color: '#166534', marginTop: '2px' }}>
                  Live Order Tracking timeline automatically hit <strong>COMPLETED</strong> status.
                </div>
              </div>
            </div>

            {/* Share Options */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={handleShareWhatsApp}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.45rem 0.85rem', background: '#25D366', color: '#fff',
                  borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                }}
              >
                💬 WhatsApp
              </button>
              <button
                onClick={handleShareEmail}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.45rem 0.85rem', background: '#2563eb', color: '#fff',
                  borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                }}
              >
                ✉️ Email
              </button>
              <button
                onClick={handleCopyLink}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.45rem 0.85rem', background: '#0f172a', color: '#fff',
                  borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                }}
              >
                {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedLink ? 'Copied!' : 'Copy Summary'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Selected Fabric Samples Gallery */}
        <div style={{ marginBottom: '1.5rem', background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: '0.65rem' }}>
            Selected Fabric Samples in this Order ({samples.length})
          </div>
          <div style={{ display: 'flex', gap: '0.85rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
            {samples.map((s) => (
              <div
                key={s.sample_no}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.65rem',
                  padding: '0.45rem 0.85rem', background: '#ffffff',
                  borderRadius: '8px', border: '1px solid #cbd5e1', flexShrink: 0
                }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#1e293b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800 }}>
                  #{s.sample_no}
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                    #{s.sample_no} — {s.article || 'Standard'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {s.product} | {s.gsm} GSM
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Word Document Style FDS Sheet */}
        <div style={{ border: '2px solid #0f172a', borderRadius: '4px', background: '#ffffff', padding: '1.25rem' }}>
          {/* Header Metadata Grid */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #0f172a', padding: '6px 10px', fontWeight: 'bold', width: '15%', fontSize: '0.82rem', background: '#f8fafc' }}>FDS No</td>
                <td style={{ border: '1px solid #0f172a', padding: '4px 8px', width: '35%' }}>
                  <input
                    type="text"
                    value={fdsNo}
                    onChange={(e) => setFdsNo(e.target.value)}
                    style={{ width: '100%', border: 'none', outline: 'none', fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}
                  />
                </td>
                <td style={{ border: '1px solid #0f172a', padding: '6px 10px', fontWeight: 'bold', width: '15%', fontSize: '0.82rem', background: '#f8fafc' }}>Date</td>
                <td style={{ border: '1px solid #0f172a', padding: '4px 8px', width: '35%' }}>
                  <input
                    type="text"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    style={{ width: '100%', border: 'none', outline: 'none', fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}
                  />
                </td>
              </tr>

              <tr>
                <td style={{ border: '1px solid #0f172a', padding: '6px 10px', fontWeight: 'bold', fontSize: '0.82rem', background: '#f8fafc' }}>End Buyer</td>
                <td colSpan="3" style={{ border: '1px solid #0f172a', padding: '4px 8px' }}>
                  <input
                    type="text"
                    value={endBuyer}
                    onChange={(e) => setEndBuyer(e.target.value)}
                    style={{ width: '100%', border: 'none', outline: 'none', fontWeight: 800, fontSize: '0.88rem', color: '#dc2626' }}
                  />
                </td>
              </tr>

              <tr>
                <td style={{ border: '1px solid #0f172a', padding: '6px 10px', fontWeight: 'bold', fontSize: '0.82rem', background: '#f8fafc' }}>Quality</td>
                <td colSpan="3" style={{ border: '1px solid #0f172a', padding: '4px 8px' }}>
                  <input
                    type="text"
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    style={{ width: '100%', border: 'none', outline: 'none', fontWeight: 700, fontSize: '0.85rem' }}
                  />
                </td>
              </tr>

              <tr>
                <td style={{ border: '1px solid #0f172a', padding: '6px 10px', fontWeight: 'bold', fontSize: '0.82rem', background: '#f8fafc' }}>Finish Type</td>
                <td style={{ border: '1px solid #0f172a', padding: '4px 8px' }}>
                  <input
                    type="text"
                    value={finishType}
                    onChange={(e) => setFinishType(e.target.value)}
                    style={{ width: '100%', border: 'none', outline: 'none', fontWeight: 600, fontSize: '0.83rem' }}
                  />
                </td>
                <td style={{ border: '1px solid #0f172a', padding: '6px 10px', fontWeight: 'bold', fontSize: '0.82rem', background: '#f8fafc' }}>Fabric Weight</td>
                <td style={{ border: '1px solid #0f172a', padding: '4px 8px' }}>
                  <input
                    type="text"
                    value={fabricWeight}
                    onChange={(e) => setFabricWeight(e.target.value)}
                    style={{ width: '100%', border: 'none', outline: 'none', fontWeight: 700, fontSize: '0.83rem' }}
                  />
                </td>
              </tr>

              <tr>
                <td style={{ border: '1px solid #0f172a', padding: '6px 10px', fontWeight: 'bold', fontSize: '0.82rem', background: '#f8fafc' }}>Print Style</td>
                <td colSpan="3" style={{ border: '1px solid #0f172a', padding: '4px 8px' }}>
                  <input
                    type="text"
                    value={printStyle}
                    onChange={(e) => setPrintStyle(e.target.value)}
                    style={{ width: '100%', border: 'none', outline: 'none', fontWeight: 600, fontSize: '0.83rem' }}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {/* Test Parameters & Commitments Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                <th style={{ border: '1px solid #0f172a', padding: '6px 8px', fontSize: '0.78rem', width: '22%', textTransform: 'uppercase', textAlign: 'left' }}>Test Parameter</th>
                <th style={{ border: '1px solid #0f172a', padding: '6px 8px', fontSize: '0.78rem', width: '22%', textTransform: 'uppercase', textAlign: 'left' }}>Customers Requirement</th>
                <th style={{ border: '1px solid #0f172a', padding: '6px 8px', fontSize: '0.78rem', width: '25%', textTransform: 'uppercase', textAlign: 'left' }}>NSL Commitment</th>
                <th style={{ border: '1px solid #0f172a', padding: '6px 8px', fontSize: '0.78rem', width: '16%', textTransform: 'uppercase', textAlign: 'left' }}>Test Method</th>
                <th style={{ border: '1px solid #0f172a', padding: '6px 8px', fontSize: '0.78rem', width: '15%', textTransform: 'uppercase', textAlign: 'left' }}>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {parameters.map((param, idx) => (
                <tr key={idx} style={{ background: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                  <td style={{ border: '1px solid #0f172a', padding: '5px 8px', fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>
                    {param.name}
                  </td>
                  <td style={{ border: '1px solid #0f172a', padding: '3px 6px' }}>
                    <input
                      type="text"
                      value={param.custReq}
                      onChange={(e) => handleParamChange(idx, 'custReq', e.target.value)}
                      style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.78rem', fontWeight: 600, color: '#1e293b' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #0f172a', padding: '3px 6px' }}>
                    <input
                      type="text"
                      value={param.nslCommit}
                      onChange={(e) => handleParamChange(idx, 'nslCommit', e.target.value)}
                      style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.78rem', fontWeight: 700, color: '#059669' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #0f172a', padding: '5px 8px', fontSize: '0.75rem', fontWeight: 600, color: '#475569', background: '#f8fafc' }}>
                    {param.method}
                  </td>
                  <td style={{ border: '1px solid #0f172a', padding: '3px 6px' }}>
                    <input
                      type="text"
                      placeholder="Add remarks…"
                      value={param.remarks}
                      onChange={(e) => handleParamChange(idx, 'remarks', e.target.value)}
                      style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.75rem', color: '#334155' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Action Footer */}
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>

          {!isSubmitted ? (
            <button
              onClick={handleSaveAndFinalize}
              className="btn-primary-red"
              style={{ padding: '0.7rem 1.8rem', fontSize: '0.95rem', gap: '0.5rem' }}
            >
              <Send size={16} />
              <span>Finalize Order & Generate FDS Report</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="btn-primary"
              style={{ padding: '0.7rem 1.8rem', fontSize: '0.95rem' }}
            >
              Done & View All Enquiries
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

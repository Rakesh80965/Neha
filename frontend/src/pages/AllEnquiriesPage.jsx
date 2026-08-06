import React, { useState, useEffect } from 'react';
import {
  User,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Edit3,
  Save,
  X,
  Layers,
  Search,
  Send,
  ThumbsUp,
  Package,
  File,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Filter,
  Share2,
  FileDown,
  Trash2,
} from 'lucide-react';
import { getApiUrl } from '../config';
import { OrderTracking } from '../components/ui/order-tracking';
import { generateFDSPDF } from '../utils/pdfGenerator';
import { ShareModal } from '../components/ShareModal';
import { TestReport1026Component } from '../components/TestReport1026Component';

const triggerCelebration = () => {
  const count = 200;
  const defaults = { origin: { y: 0.6 } };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, { spread: 30, startVelocity: 60 });
  fire(0.2, { spread: 70 });
  fire(0.35, { spread: 110, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 130, startVelocity: 30, decay: 0.92, scalar: 1.25 });
  fire(0.1, { spread: 140, startVelocity: 50 });
};

const WORKFLOW_STAGES = [
  { id: 'received', label: 'Request Received', icon: Clock, color: '#3b82f6' },
  { id: 'approved', label: 'Request Approved', icon: CheckSquare, color: '#8b5cf6' },
  { id: 'sent', label: 'Samples Sent', icon: Send, color: '#f59e0b' },
  { id: 'buyer_approved', label: 'Samples Approved', icon: ThumbsUp, color: '#10b981' },
  { id: 'completed', label: 'Completed', icon: Package, color: '#059669' },
];

const getCurrentFormattedTime = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
};

const getStepsForEnquiry = (enq) => {
  const stageOrder = ['received', 'approved', 'sent', 'buyer_approved', 'completed'];
  const currentIdx = stageOrder.indexOf(enq?.stage || 'received');
  const tsMap = enq?.stageTimestamps || {};

  return [
    {
      name: "Request Received",
      timestamp: tsMap['received'] || (enq?.date_received ? `${enq.date_received} 09:00` : "2025-07-22 09:00"),
      isCompleted: currentIdx >= 0,
    },
    {
      name: "Request Approved",
      timestamp: currentIdx >= 1 ? (tsMap['approved'] || "2025-07-23 11:30") : "Pending",
      isCompleted: currentIdx >= 1,
    },
    {
      name: "Samples Sent",
      timestamp: currentIdx >= 2 ? (tsMap['sent'] || "2025-07-24 14:15") : "Pending",
      isCompleted: currentIdx >= 2,
    },
    {
      name: "Samples Approved",
      timestamp: currentIdx >= 3 ? (tsMap['buyer_approved'] || "2025-07-25 16:45") : "Pending",
      isCompleted: currentIdx >= 3,
    },
    {
      name: "Completed",
      timestamp: currentIdx >= 4 ? (tsMap['completed'] || "2025-07-26 10:00") : "Pending",
      isCompleted: currentIdx >= 4,
    },
  ];
};

const INITIAL_DEMO_ENQUIRIES = [];

export const AllEnquiriesPage = ({ onOpenRegistration, createdEnquiries = [], onDeleteEnquiry }) => {
  const [enquiries, setEnquiries] = useState(INITIAL_DEMO_ENQUIRIES);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState('ALL');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [activeShareEnquiry, setActiveShareEnquiry] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const handleDeleteEnquiry = async (enquiryId) => {
    if (!window.confirm('Are you sure you want to delete this enquiry? This action cannot be undone.')) {
      return;
    }
    setEnquiries((prev) => prev.filter((enq) => enq.enquiry_id !== enquiryId));
    if (onDeleteEnquiry) {
      onDeleteEnquiry(enquiryId);
    }
    setSelectedEnquiry(null);

    try {
      await fetch(getApiUrl('/api/enquiries/delete'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ enquiry_id: enquiryId }),
      });
    } catch (err) {
      // Ignore API failure gracefully
    }
  };

  const fetchEnquiries = async () => {
    try {
      const res = await fetch(getApiUrl('/api/enquiries'), { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.enquiries && data.enquiries.length > 0) {
          const existingIds = new Set(INITIAL_DEMO_ENQUIRIES.map((e) => e.enquiry_id));
          const newApiEnquiries = data.enquiries.filter((e) => !existingIds.has(e.enquiry_id));
          setEnquiries([...createdEnquiries, ...newApiEnquiries, ...INITIAL_DEMO_ENQUIRIES]);
          return;
        }
      }
    } catch (e) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (createdEnquiries && createdEnquiries.length > 0) {
      const createdIds = new Set(createdEnquiries.map((c) => c.enquiry_id));
      const filteredExisting = INITIAL_DEMO_ENQUIRIES.filter((e) => !createdIds.has(e.enquiry_id));
      setEnquiries([...createdEnquiries, ...filteredExisting]);
      setLoading(false);
    } else {
      fetchEnquiries();
    }
  }, [createdEnquiries]);

  const handleUpdateStage = async (enquiryId, newStage, e) => {
    if (e) e.stopPropagation();
    const nowStamp = getCurrentFormattedTime();

    if (newStage === 'completed') {
      triggerCelebration();
    }

    setEnquiries((prev) =>
      prev.map((enq) => {
        if (enq.enquiry_id === enquiryId) {
          const updatedTimestamps = {
            ...(enq.stageTimestamps || {}),
            [newStage]: nowStamp,
          };
          return { ...enq, stage: newStage, stageTimestamps: updatedTimestamps };
        }
        return enq;
      })
    );

    if (selectedEnquiry && selectedEnquiry.enquiry_id === enquiryId) {
      setSelectedEnquiry((prev) => ({
        ...prev,
        stage: newStage,
        stageTimestamps: {
          ...(prev.stageTimestamps || {}),
          [newStage]: nowStamp,
        },
      }));
    }

    try {
      await fetch(getApiUrl('/api/enquiries/update'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ enquiry_id: enquiryId, stage: newStage, timestamp: nowStamp }),
      });
    } catch (err) {
      // Ignore
    }
  };

  const handleOpenDetail = (enq) => {
    setSelectedEnquiry(enq);
    setEditFormData({ ...enq });
    setIsEditing(false);
    setSaveSuccessMsg('');
  };

  const handleSaveEdit = async () => {
    if (!editFormData) return;
    setEnquiries((prev) =>
      prev.map((e) => (e.enquiry_id === editFormData.enquiry_id ? editFormData : e))
    );
    setSelectedEnquiry(editFormData);
    setIsEditing(false);
    setSaveSuccessMsg('Enquiry details updated successfully!');

    try {
      await fetch(getApiUrl('/api/enquiries/update'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editFormData),
      });
    } catch (err) {
      // Ignore
    }
  };

  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesSearch =
      enq.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.enquiry_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (enq.brand_name && enq.brand_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStage =
      selectedStageFilter === 'ALL' || enq.stage === selectedStageFilter;

    return matchesSearch && matchesStage;
  });

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#0f172a',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              color: '#0f172a',
              lineHeight: 1.1,
            }}
          >
            SAMPLE ORDER TRACKING
          </h1>
        </div>

        {onOpenRegistration && (
          <button
            onClick={onOpenRegistration}
            style={{
              padding: '0.75rem 1.4rem',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
              transition: 'all 0.2s',
            }}
          >
            + Register New Enquiry
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Brand Name or Enquiry ID…"
            style={{
              width: '100%',
              padding: '0.7rem 1rem 0.7rem 2.5rem',
              borderRadius: '10px',
              border: '1.5px solid #cbd5e1',
              fontSize: '0.92rem',
              background: '#ffffff',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
          <Search
            size={18}
            color="#94a3b8"
            style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedStageFilter('ALL')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: selectedStageFilter === 'ALL' ? '1.5px solid #0f172a' : '1px solid #cbd5e1',
              background: selectedStageFilter === 'ALL' ? '#0f172a' : '#ffffff',
              color: selectedStageFilter === 'ALL' ? '#ffffff' : '#475569',
              transition: 'all 0.2s',
            }}
          >
            All Stages ({enquiries.length})
          </button>

          {WORKFLOW_STAGES.map((stg) => {
            const count = enquiries.filter((e) => e.stage === stg.id).length;
            const isSel = selectedStageFilter === stg.id;
            return (
              <button
                key={stg.id}
                onClick={() => setSelectedStageFilter(stg.id)}
                style={{
                  padding: '0.5rem 0.95rem',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isSel ? `1.5px solid ${stg.color}` : '1px solid #cbd5e1',
                  background: isSel ? `${stg.color}15` : '#ffffff',
                  color: isSel ? stg.color : '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s',
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: stg.color,
                  }}
                />
                <span>{stg.label}</span>
                <span
                  style={{
                    fontSize: '11px',
                    background: '#f1f5f9',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    fontWeight: 700,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Enquiries Stack Cards List */}
      {filteredEnquiries.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
          }}
        >
          <Layers size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>
            No Buyer Enquiries Found
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.4rem' }}>
            Try adjusting your search query or register a new buyer enquiry.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredEnquiries.map((enq) => {
            const currentStageObj =
              WORKFLOW_STAGES.find((s) => s.id === (enq.stage || 'received')) || WORKFLOW_STAGES[0];

            return (
              <div
                key={enq.enquiry_id}
                onClick={() => handleOpenDetail(enq)}
                style={{
                  background: '#ffffff',
                  borderRadius: '14px',
                  border: '1.5px solid #e2e8f0',
                  padding: '1.5rem 1.75rem',
                  boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = '#93c5fd';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(15, 23, 42, 0.04)';
                }}
              >
                {/* Top Info Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        padding: '0.4rem 0.85rem',
                        borderRadius: '8px',
                        background: '#1e293b',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {enq.brand_name || enq.buyer_name}
                    </div>

                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
                      ID: <span style={{ color: '#0f172a' }}>{enq.enquiry_id}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {enq.fds_report && (
                      <span
                        style={{
                          padding: '0.25rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: '#fef2f2',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                      >
                        <FileText size={12} />
                        <span>FDS Report ({enq.fds_report.fdsNo})</span>
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveShareEnquiry(enq);
                      }}
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: '#dc2626',
                        color: '#ffffff',
                        border: '1px solid #b91c1c',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        cursor: 'pointer',
                      }}
                      title="View & Share PDF Report"
                    >
                      <FileDown size={12} />
                      <span>Share PDF</span>
                    </button>

                    <span
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: enq.priority === 'High' ? '#fef2f2' : '#fffbe6',
                        color: enq.priority === 'High' ? '#dc2626' : '#d97706',
                        border: enq.priority === 'High' ? '1px solid #fecaca' : '1px solid #fef08a',
                      }}
                    >
                      ● {enq.priority} Priority
                    </span>

                    <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>
                      Due: {enq.due_date ? new Date(enq.due_date).toLocaleDateString('en-GB') : '—'}
                    </span>
                  </div>
                </div>

                {/* Selected Fabric Samples Row */}
                {enq.selected_samples && enq.selected_samples.length > 0 && (
                  <div style={{ marginBottom: '0.85rem', padding: '0.55rem 0.85rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>
                      Selected Samples ({enq.selected_samples.length}):
                    </span>
                    <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                      {enq.selected_samples.map((s) => (
                        <span
                          key={s.sample_no}
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            padding: '2px 8px',
                            color: '#0f172a',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          <Layers size={11} color="#dc2626" />
                          <span>#{s.sample_no} {s.article ? `(${s.article})` : ''}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Requirement Summary Excerpt */}
                {enq.summary && (
                  <p
                    style={{
                      fontSize: '0.88rem',
                      color: '#475569',
                      lineHeight: 1.5,
                      marginBottom: '1.25rem',
                      maxWidth: '90%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {enq.summary}
                  </p>
                )}

                {/* Live Order Tracking Timeline */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: '#f8fafc',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    border: '1px solid #f1f5f9',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b' }}>
                      Live Order Tracking Timeline
                    </div>

                    {/* Prev / Next Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const stageOrder = ['received', 'approved', 'sent', 'buyer_approved', 'completed'];
                          const currentIdx = stageOrder.indexOf(enq.stage || 'received');
                          if (currentIdx > 0) {
                            handleUpdateStage(enq.enquiry_id, stageOrder[currentIdx - 1]);
                          }
                        }}
                        disabled={['received', 'approved', 'sent', 'buyer_approved', 'completed'].indexOf(enq.stage || 'received') <= 0}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          background: ['received', 'approved', 'sent', 'buyer_approved', 'completed'].indexOf(enq.stage || 'received') <= 0 ? '#f1f5f9' : '#ffffff',
                          color: ['received', 'approved', 'sent', 'buyer_approved', 'completed'].indexOf(enq.stage || 'received') <= 0 ? '#94a3b8' : '#1e293b',
                          border: '1px solid #cbd5e1',
                          cursor: ['received', 'approved', 'sent', 'buyer_approved', 'completed'].indexOf(enq.stage || 'received') <= 0 ? 'not-allowed' : 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <ChevronLeft size={13} />
                        <span>Prev</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const stageOrder = ['received', 'approved', 'sent', 'buyer_approved', 'completed'];
                          const currentIdx = stageOrder.indexOf(enq.stage || 'received');
                          if (currentIdx < stageOrder.length - 1) {
                            handleUpdateStage(enq.enquiry_id, stageOrder[currentIdx + 1]);
                          }
                        }}
                        disabled={['received', 'approved', 'sent', 'buyer_approved', 'completed'].indexOf(enq.stage || 'received') >= 4}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          background: ['received', 'approved', 'sent', 'buyer_approved', 'completed'].indexOf(enq.stage || 'received') >= 4 ? '#f1f5f9' : '#1e293b',
                          color: ['received', 'approved', 'sent', 'buyer_approved', 'completed'].indexOf(enq.stage || 'received') >= 4 ? '#94a3b8' : '#ffffff',
                          border: ['received', 'approved', 'sent', 'buyer_approved', 'completed'].indexOf(enq.stage || 'received') >= 4 ? '1px solid #cbd5e1' : '1px solid #1e293b',
                          cursor: ['received', 'approved', 'sent', 'buyer_approved', 'completed'].indexOf(enq.stage || 'received') >= 4 ? 'not-allowed' : 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span>Next</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                  <OrderTracking
                    steps={getStepsForEnquiry(enq)}
                    orientation="horizontal"
                    onStepClick={(index) => handleUpdateStage(enq.enquiry_id, WORKFLOW_STAGES[index].id)}
                    className="w-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL ENQUIRY DETAIL & EDIT MODAL */}
      {selectedEnquiry && editFormData && (
        <div
          onClick={() => setSelectedEnquiry(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem',
          }}
        >
          <div
            id="enquiry-detail-printable-sheet"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              maxWidth: '920px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.3)',
              border: '1px solid #e2e8f0',
              padding: '2.25rem',
              position: 'relative',
            }}
          >
            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedEnquiry(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#f1f5f9',
                border: 'none',
                color: '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div style={{ marginBottom: '1.75rem', paddingRight: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.4rem' }}>
                <span
                  style={{
                    background: '#1e293b',
                    color: '#ffffff',
                    padding: '0.35rem 0.9rem',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '1rem',
                  }}
                >
                  {selectedEnquiry.buyer_name}
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748b' }}>
                  {selectedEnquiry.enquiry_id}
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                Complete Buyer Enquiry Details & Tracking Status
              </p>
            </div>

            {saveSuccessMsg && (
              <div
                style={{
                  marginBottom: '1.25rem',
                  padding: '0.8rem 1rem',
                  borderRadius: '8px',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  color: '#16a34a',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 600,
                }}
              >
                <CheckCircle size={16} />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* Live Order Tracking Timeline */}
            <div
              style={{
                background: '#f8fafc',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                border: '1px solid #e2e8f0',
                marginBottom: '1.25rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                }}
              >
                <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b' }}>
                  Live Order Tracking Timeline
                </div>

                {/* Modal Prev / Next Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentObj = isEditing ? editFormData : selectedEnquiry;
                      const stageOrder = ['received', 'approved', 'sent', 'buyer_approved', 'completed'];
                      const currentIdx = stageOrder.indexOf(currentObj.stage || 'received');
                      if (currentIdx > 0) {
                        const prevStage = stageOrder[currentIdx - 1];
                        if (isEditing) setEditFormData({ ...editFormData, stage: prevStage });
                        else handleUpdateStage(selectedEnquiry.enquiry_id, prevStage);
                      }
                    }}
                    disabled={['received', 'approved', 'sent', 'buyer_approved', 'completed'].indexOf((isEditing ? editFormData : selectedEnquiry).stage || 'received') <= 0}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      background: ['received', 'approved', 'sent', 'buyer_approved', 'completed'].indexOf((isEditing ? editFormData : selectedEnquiry).stage || 'received') <= 0 ? '#f1f5f9' : '#ffffff',
                      color: ['received', 'approved', 'sent', 'buyer_approved', 'completed'].indexOf((isEditing ? editFormData : selectedEnquiry).stage || 'received') <= 0 ? '#94a3b8' : '#1e293b',
                      border: '1px solid #cbd5e1',
                      cursor: ['received', 'approved', 'sent', 'buyer_approved', 'completed'].indexOf((isEditing ? editFormData : selectedEnquiry).stage || 'received') <= 0 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <ChevronLeft size={13} />
                    <span>Prev</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentObj = isEditing ? editFormData : selectedEnquiry;
                      const stageOrder = ['received', 'approved', 'sent', 'buyer_approved', 'completed'];
                      const currentIdx = stageOrder.indexOf(currentObj.stage || 'received');
                      if (currentIdx < stageOrder.length - 1) {
                        const nextStage = stageOrder[currentIdx + 1];
                        if (isEditing) {
                          setEditFormData({ ...editFormData, stage: nextStage });
                          if (nextStage === 'completed') triggerCelebration();
                        } else {
                          handleUpdateStage(selectedEnquiry.enquiry_id, nextStage);
                        }
                      }
                    }}
                    disabled={['received', 'approved', 'sent', 'buyer_approved', 'completed'].indexOf((isEditing ? editFormData : selectedEnquiry).stage || 'received') >= 4}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      background: ['received', 'approved', 'sent', 'buyer_approved', 'completed'].indexOf((isEditing ? editFormData : selectedEnquiry).stage || 'received') >= 4 ? '#f1f5f9' : '#1e293b',
                      color: ['received', 'approved', 'sent', 'buyer_approved', 'completed'].indexOf((isEditing ? editFormData : selectedEnquiry).stage || 'received') >= 4 ? '#94a3b8' : '#ffffff',
                      border: ['received', 'approved', 'sent', 'buyer_approved', 'completed'].indexOf((isEditing ? editFormData : selectedEnquiry).stage || 'received') >= 4 ? '1px solid #cbd5e1' : '1px solid #1e293b',
                      cursor: ['received', 'approved', 'sent', 'buyer_approved', 'completed'].indexOf((isEditing ? editFormData : selectedEnquiry).stage || 'received') >= 4 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>Next</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
              <OrderTracking
                steps={getStepsForEnquiry(isEditing ? editFormData : selectedEnquiry)}
                orientation="horizontal"
                onStepClick={(index) => {
                  const targetStage = WORKFLOW_STAGES[index].id;
                  if (isEditing) {
                    setEditFormData({ ...editFormData, stage: targetStage });
                    if (targetStage === 'completed') triggerCelebration();
                  } else {
                    handleUpdateStage(selectedEnquiry.enquiry_id, targetStage);
                  }
                }}
                className="w-full"
              />
            </div>

            {/* Detail Grid / Edit Form */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem', marginBottom: '2rem' }}>
              {/* Section 1: Buyer Details */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={16} color="#2563eb" /> 1. Buyer Details
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Brand Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData.brand_name || editFormData.buyer_name}
                        onChange={(e) => setEditFormData({ ...editFormData, brand_name: e.target.value, buyer_name: e.target.value })}
                        style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    ) : (
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{selectedEnquiry.brand_name || selectedEnquiry.buyer_name || '—'}</span>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Company</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData.company}
                        onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                        style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    ) : (
                      <span style={{ color: '#334155' }}>{selectedEnquiry.company || '—'}</span>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Country</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData.country}
                        onChange={(e) => setEditFormData({ ...editFormData, country: e.target.value })}
                        style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    ) : (
                      <span style={{ color: '#334155' }}>{selectedEnquiry.country || '—'}</span>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Contact Person</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData.contact_person}
                        onChange={(e) => setEditFormData({ ...editFormData, contact_person: e.target.value })}
                        style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    ) : (
                      <span style={{ color: '#334155' }}>{selectedEnquiry.contact_person || '—'}</span>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editFormData.email}
                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                        style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    ) : (
                      <span style={{ color: '#334155' }}>{selectedEnquiry.email || '—'}</span>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Phone Number</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData.phone_number}
                        onChange={(e) => setEditFormData({ ...editFormData, phone_number: e.target.value })}
                        style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    ) : (
                      <span style={{ color: '#334155' }}>{selectedEnquiry.phone_number || '—'}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Enquiry Details */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} color="#2563eb" /> 2. Enquiry Details
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Priority</label>
                    {isEditing ? (
                      <select
                        value={editFormData.priority}
                        onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
                        style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    ) : (
                      <span style={{ fontWeight: 700, color: selectedEnquiry.priority === 'High' ? '#dc2626' : '#d97706' }}>
                        ● {selectedEnquiry.priority}
                      </span>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Requirement Type</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData.requirement_type}
                        onChange={(e) => setEditFormData({ ...editFormData, requirement_type: e.target.value })}
                        style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    ) : (
                      <span style={{ color: '#334155' }}>{selectedEnquiry.requirement_type || '—'}</span>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Address</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData.address || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                        style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    ) : (
                      <span style={{ color: '#334155' }}>{selectedEnquiry.address || '—'}</span>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Date Received</label>
                    <span style={{ color: '#334155' }}>{selectedEnquiry.date_received || '—'}</span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Due Date</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editFormData.due_date}
                        onChange={(e) => setEditFormData({ ...editFormData, due_date: e.target.value })}
                        style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    ) : (
                      <span style={{ color: '#334155' }}>{selectedEnquiry.due_date || '—'}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Requirement Summary */}
            <div style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
                Requirement Summary / Notes
              </div>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={editFormData.summary}
                  onChange={(e) => setEditFormData({ ...editFormData, summary: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              ) : (
                <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
                  {selectedEnquiry.summary || 'No summary provided.'}
                </p>
              )}
            </div>

            {/* Attached Test Report for Sample #1026 if present */}
            {((selectedEnquiry.selected_samples && selectedEnquiry.selected_samples.some(s => (typeof s === 'object' ? (s.sample_no == 1026 || String(s.sample_no).includes('1026') || (s.article && s.article.includes('A37342PA'))) : String(s).includes('1026')))) || JSON.stringify(selectedEnquiry).includes('1026') || JSON.stringify(selectedEnquiry).includes('A37342PA')) && (
              <TestReport1026Component />
            )}

            {/* Bottom Actions Bar with Edit & Delete Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  style={{
                    padding: '0.65rem 1.35rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => handleDeleteEnquiry(selectedEnquiry.enquiry_id)}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '8px',
                    border: '1px solid #fecaca',
                    background: '#fef2f2',
                    color: '#dc2626',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s',
                  }}
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>

              {isEditing ? (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => setIsEditing(false)}
                    style={{
                      padding: '0.65rem 1.25rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#475569',
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel Edit
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    style={{
                      padding: '0.65rem 1.45rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #16a34a, #15803d)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)',
                    }}
                  >
                    <Save size={16} />
                    <span>Save Changes</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: '0.65rem 1.45rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                  }}
                >
                  <Edit3 size={16} />
                  <span>Edit Enquiry Details</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Share Modal */}
      {activeShareEnquiry && (
        <ShareModal
          isOpen={!!activeShareEnquiry}
          onClose={() => setActiveShareEnquiry(null)}
          fdsNo={activeShareEnquiry.fds_report?.fdsNo || activeShareEnquiry.enquiry_id}
          buyerName={activeShareEnquiry.buyer_name}
          enquiryId={activeShareEnquiry.enquiry_id}
          samples={activeShareEnquiry.selected_samples || []}
          printableId="share-modal-pdf-template"
        />
      )}
    </div>
  );
};

export default AllEnquiriesPage;

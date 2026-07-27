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
  ChevronRight,
  Filter,
} from 'lucide-react';
import { getApiUrl } from '../config';
import { OrderTracking } from '../components/ui/order-tracking';

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

const INITIAL_DEMO_ENQUIRIES = [
  {
    enquiry_id: 'ENQ-2025-00078',
    buyer_name: 'ZARA',
    brand_name: 'ZARA',
    company: 'Inditex',
    country: 'Spain',
    contact_person: 'Mr. David Garcia',
    email: 'david.garcia@zara.com',
    phone_number: '+34 612 345 678',
    buyer_id: 'B-00045',
    date_received: '2025-07-22',
    due_date: '2025-08-05',
    priority: 'High',
    requirement_type: 'Development',
    season: 'AW 25',
    quantity: '5000 Mtrs',
    status: 'In Progress',
    end_use: 'Shirts',
    stage: 'sent', // Request Received -> Request Approved -> Samples Sent
    summary:
      'Buyer requires a lightweight cotton fabric with premium appearance, soft hand feel, yarn dyed stripe, sustainable material, suitable for shirts. Looking for fabrics with good drape and breathability.',
    documents: ['Buyer_Requirement.pdf', 'Tech_Pack_ZARA_AW25.pdf', 'Specifications_Sheet.pdf'],
    reference_images_count: 3,
  },
  {
    enquiry_id: 'ENQ-2025-00084',
    buyer_name: 'H&M',
    brand_name: 'H&M',
    company: 'Hennes & Mauritz',
    country: 'Sweden',
    contact_person: 'Ms. Anna Lind',
    email: 'anna.lind@hm.com',
    phone_number: '+46 8 796 5500',
    buyer_id: 'B-00082',
    date_received: '2025-07-24',
    due_date: '2025-08-10',
    priority: 'Medium',
    requirement_type: 'Bulk Production',
    season: 'SS 26',
    quantity: '12000 Mtrs',
    status: 'New',
    end_use: 'Dresses',
    stage: 'received',
    summary:
      'Seeking high-density viscose twill with smooth silk-like drape for summer dress collection.',
    documents: ['HM_SS26_Spec.pdf'],
    reference_images_count: 2,
  },
];

export const AllEnquiriesPage = ({ onOpenRegistration }) => {
  const [enquiries, setEnquiries] = useState(INITIAL_DEMO_ENQUIRIES);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState('ALL');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const fetchEnquiries = async () => {
    try {
      const res = await fetch(getApiUrl('/api/enquiries'), { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.enquiries && data.enquiries.length > 0) {
          // Merge API enquiries with demo ones if not present
          const existingIds = new Set(INITIAL_DEMO_ENQUIRIES.map((e) => e.enquiry_id));
          const newApiEnquiries = data.enquiries.filter((e) => !existingIds.has(e.enquiry_id));
          setEnquiries([...newApiEnquiries, ...INITIAL_DEMO_ENQUIRIES]);
        }
      }
    } catch (e) {
      // Fallback to local demo list
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleUpdateStage = async (enquiryId, newStage, e) => {
    if (e) e.stopPropagation();
    const nowStamp = getCurrentFormattedTime();

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
          <div
            style={{
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#64748b',
              marginBottom: '0.4rem',
            }}
          >
            Buyer Requirements & Tracking
          </div>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              color: '#0f172a',
              lineHeight: 1.1,
            }}
          >
            All Buyer Enquiries
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
            placeholder="Search by Buyer Name, Brand, or Enquiry ID…"
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
                      {enq.buyer_name}
                    </div>

                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
                      ID: <span style={{ color: '#0f172a' }}>{enq.enquiry_id}</span>
                    </div>

                    {enq.brand_name && (
                      <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>
                        Brand: <strong>{enq.brand_name}</strong>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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

                {/* Step-by-Step Radio Button Tracking Flow */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '1rem 1.25rem',
                    border: '1px solid #f1f5f9',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: '#64748b',
                      marginBottom: '0.85rem',
                    }}
                  >
                    Tracking Workflow Stage (Click Radio Button to Update Status)
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                    }}
                  >
                    {WORKFLOW_STAGES.map((stg, idx) => {
                      const isChecked = enq.stage === stg.id;
                      const StageIcon = stg.icon;

                      return (
                        <React.Fragment key={stg.id}>
                          <label
                            onClick={(e) => handleUpdateStage(enq.enquiry_id, stg.id, e)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              cursor: 'pointer',
                              padding: '0.4rem 0.75rem',
                              borderRadius: '8px',
                              background: isChecked ? `${stg.color}15` : '#ffffff',
                              border: isChecked ? `1.5px solid ${stg.color}` : '1px solid #cbd5e1',
                              transition: 'all 0.2s',
                            }}
                          >
                            <input
                              type="radio"
                              name={`stage-${enq.enquiry_id}`}
                              checked={isChecked}
                              onChange={() => {}}
                              style={{ accentColor: stg.color, cursor: 'pointer' }}
                            />
                            <StageIcon size={15} color={isChecked ? stg.color : '#64748b'} />
                            <span
                              style={{
                                fontSize: '0.82rem',
                                fontWeight: isChecked ? 700 : 500,
                                color: isChecked ? stg.color : '#475569',
                              }}
                            >
                              {stg.label}
                            </span>
                          </label>

                          {idx < WORKFLOW_STAGES.length - 1 && (
                            <ChevronRight size={16} color="#cbd5e1" style={{ flexShrink: 0 }} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* Integrated Shadcn OrderTracking Component */}
                  <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px dashed #cbd5e1' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: '0.5rem' }}>
                      Live Order Tracking Timeline (Click Step to Update)
                    </div>
                    <OrderTracking
                      steps={getStepsForEnquiry(enq)}
                      orientation="horizontal"
                      onStepClick={(index) => handleUpdateStage(enq.enquiry_id, WORKFLOW_STAGES[index].id)}
                      className="w-full"
                    />
                  </div>
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

            {/* Tracking Status Flow Header */}
            <div
              style={{
                background: '#f8fafc',
                borderRadius: '14px',
                padding: '1.25rem 1.5rem',
                border: '1px solid #e2e8f0',
                marginBottom: '2rem',
              }}
            >
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '1rem' }}>
                Tracking Status Flow (Radio Buttons)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                {WORKFLOW_STAGES.map((stg, idx) => {
                  const isChecked = (isEditing ? editFormData.stage : selectedEnquiry.stage) === stg.id;
                  const StageIcon = stg.icon;

                  return (
                    <React.Fragment key={stg.id}>
                      <label
                        onClick={() => {
                          if (isEditing) setEditFormData({ ...editFormData, stage: stg.id });
                          else handleUpdateStage(selectedEnquiry.enquiry_id, stg.id);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          cursor: 'pointer',
                          padding: '0.5rem 0.85rem',
                          borderRadius: '8px',
                          background: isChecked ? `${stg.color}15` : '#ffffff',
                          border: isChecked ? `1.5px solid ${stg.color}` : '1px solid #cbd5e1',
                        }}
                      >
                        <input
                          type="radio"
                          name="modal-stage"
                          checked={isChecked}
                          onChange={() => {}}
                          style={{ accentColor: stg.color, cursor: 'pointer' }}
                        />
                        <StageIcon size={16} color={isChecked ? stg.color : '#64748b'} />
                        <span style={{ fontSize: '0.85rem', fontWeight: isChecked ? 700 : 500, color: isChecked ? stg.color : '#475569' }}>
                          {stg.label}
                        </span>
                      </label>
                      {idx < WORKFLOW_STAGES.length - 1 && <ChevronRight size={16} color="#cbd5e1" />}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Integrated Shadcn OrderTracking Timeline */}
              <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px dashed #cbd5e1' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: '0.5rem' }}>
                  Live Order Tracking Timeline (Click Step to Update)
                </div>
                <OrderTracking
                  steps={getStepsForEnquiry(isEditing ? editFormData : selectedEnquiry)}
                  orientation="horizontal"
                  onStepClick={(index) => {
                    const targetStage = WORKFLOW_STAGES[index].id;
                    if (isEditing) setEditFormData({ ...editFormData, stage: targetStage });
                    else handleUpdateStage(selectedEnquiry.enquiry_id, targetStage);
                  }}
                  className="w-full"
                />
              </div>
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Buyer Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData.buyer_name}
                        onChange={(e) => setEditFormData({ ...editFormData, buyer_name: e.target.value })}
                        style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    ) : (
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{selectedEnquiry.buyer_name || '—'}</span>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Brand Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData.brand_name}
                        onChange={(e) => setEditFormData({ ...editFormData, brand_name: e.target.value })}
                        style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    ) : (
                      <span style={{ fontWeight: 600, color: '#334155' }}>{selectedEnquiry.brand_name || '—'}</span>
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Season</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData.season}
                        onChange={(e) => setEditFormData({ ...editFormData, season: e.target.value })}
                        style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    ) : (
                      <span style={{ color: '#334155' }}>{selectedEnquiry.season || '—'}</span>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Quantity</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData.quantity}
                        onChange={(e) => setEditFormData({ ...editFormData, quantity: e.target.value })}
                        style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    ) : (
                      <span style={{ color: '#334155' }}>{selectedEnquiry.quantity || '—'}</span>
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

            {/* Bottom Actions Bar with Edit Button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
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
    </div>
  );
};

export default AllEnquiriesPage;

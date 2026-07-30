import React, { useState, useEffect } from 'react';
import { Heart, Trash2, FolderPlus, Bookmark, X, FileCheck } from 'lucide-react';
import { SampleCard } from '../components/SampleCard';
import { FDSReportModal } from '../components/FDSReportModal';
import { getApiUrl } from '../config';

export const WishlistPage = ({ onOpenModal, wishlistData, refreshWishlist, onFinalizeOrder }) => {
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [newGroupModal, setNewGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [creating, setCreating] = useState(false);
  const [fdsModalOpen, setFdsModalOpen] = useState(false);

  const groups = wishlistData?.groups || [];

  useEffect(() => {
    if (groups.length > 0 && !activeGroupId) setActiveGroupId(groups[0].group_id);
  }, [groups, activeGroupId]);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(getApiUrl('/api/wishlist/groups/create'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: newGroupName.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to create group');
      setNewGroupName(''); setNewGroupModal(false);
      await refreshWishlist();
      setActiveGroupId(data.group_id);
    } catch (err) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteGroup = async (groupId, groupName, e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${groupName}" and all its saved samples?`)) return;
    try {
      await fetch(getApiUrl('/api/wishlist/groups/delete'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ group_id: groupId }),
      });
      if (activeGroupId === groupId) setActiveGroupId(null);
      await refreshWishlist();
    } catch { alert('Could not delete group'); }
  };

  const handleRemoveSample = async (sampleNo) => {
    if (!activeGroupId) return;
    try {
      await fetch(getApiUrl('/api/wishlist/remove'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ sample_no: sampleNo, group_id: activeGroupId }),
      });
      await refreshWishlist();
    } catch { alert('Could not remove sample'); }
  };

  const activeGroup = groups.find((g) => g.group_id === activeGroupId);
  const activeSamples = activeGroup?.samples || [];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Editorial header */}
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
          <h2
            style={{
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 900,
              letterSpacing: '-0.045em',
              lineHeight: 0.95,
              color: 'var(--charcoal)',
            }}
          >
            Shortlisted Samples
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: '0.45rem',
              fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)',
              border: '1.5px solid var(--border)', borderRadius: 'var(--radius-pill)',
              padding: '0.4rem 1rem',
            }}
          >
            <Heart size={14} fill="var(--text-muted)" color="var(--text-muted)" />
            <span>{wishlistData?.total_count || 0} saved</span>
          </div>
          <button onClick={() => setNewGroupModal(true)} className="btn-primary" style={{ gap: '0.4rem' }}>
            <FolderPlus size={16} />
            <span>New Group</span>
          </button>
        </div>
      </div>

      {/* Group tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {groups.map((group) => {
          const isActive = group.group_id === activeGroupId;
          return (
            <div
              key={group.group_id}
              onClick={() => setActiveGroupId(group.group_id)}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.86rem', fontWeight: 600,
                cursor: 'pointer',
                background: isActive ? 'var(--charcoal)' : 'var(--white)',
                color: isActive ? 'var(--white)' : 'var(--text-muted)',
                border: isActive ? '1.5px solid var(--charcoal)' : '1.5px solid var(--border-mid)',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                transition: 'all 0.2s ease',
              }}
            >
              <Bookmark size={14} />
              <span>{group.group_name}</span>
              <span
                style={{
                  background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--bg-surface)',
                  color: isActive ? 'var(--white)' : 'var(--text-dim)',
                  padding: '1px 7px', borderRadius: 'var(--radius-pill)', fontSize: '11px', fontWeight: 700,
                }}
              >
                {group.count}
              </span>
              <button
                onClick={(e) => handleDeleteGroup(group.group_id, group.group_name, e)}
                style={{
                  background: 'none', border: 'none',
                  color: isActive ? 'rgba(255,255,255,0.5)' : 'var(--text-dim)',
                  cursor: 'pointer', padding: '1px', display: 'flex',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = isActive ? 'var(--white)' : 'var(--red)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = isActive ? 'rgba(255,255,255,0.5)' : 'var(--text-dim)'; }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Content */}
      {!activeGroup || activeSamples.length === 0 ? (
        <div
          style={{
            textAlign: 'center', padding: '5rem 2rem',
            background: 'var(--white)',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>❤️</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--charcoal)', letterSpacing: '-0.03em' }}>
            {groups.length === 0 ? 'No Wishlist Groups Yet' : 'This Group is Empty'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.4rem', maxWidth: '360px', margin: '0.5rem auto 0' }}>
            {groups.length === 0
              ? 'Click "New Group" to create a wishlist folder for your buyers or clients.'
              : 'Search fabric samples and add them to this group via any sample card.'}
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(265px, 1fr))', gap: '1.25rem' }}>
            {activeSamples.map((sample) => (
              <SampleCard
                key={sample.sample_no}
                sample={sample}
                onOpenModal={onOpenModal}
                onRemoveFromGroup={handleRemoveSample}
              />
            ))}
          </div>

          {/* Finalize Order & FDS Report Banner */}
          <div
            style={{
              marginTop: '2rem',
              padding: '1.5rem 2rem',
              background: 'var(--white)',
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            }}
          >
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--charcoal)', letterSpacing: '-0.03em' }}>
                Finalize Collection for {activeGroup?.group_name || 'Buyer'}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Generate FDS Feasibility Report for all {activeSamples.length} selected fabric samples & submit to Sample Order Tracking.
              </div>
            </div>

            <button
              onClick={() => setFdsModalOpen(true)}
              className="btn-primary-red"
              style={{ padding: '0.75rem 1.8rem', fontSize: '0.92rem', gap: '0.5rem' }}
            >
              <FileCheck size={18} />
              <span>Finalize Order & FDS Report</span>
            </button>
          </div>
        </>
      )}

      {/* FDS Feasibility Report Modal */}
      {fdsModalOpen && activeGroup && (
        <FDSReportModal
          group={activeGroup}
          samples={activeSamples}
          onClose={() => setFdsModalOpen(false)}
          onFinalizeSuccess={(newEnquiry) => {
            if (onFinalizeOrder) {
              onFinalizeOrder(newEnquiry);
            }
          }}
        />
      )}

      {/* New Group Modal */}
      {newGroupModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 600,
            background: 'rgba(14,14,14,0.6)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
          }}
          onClick={() => setNewGroupModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--white)',
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '420px', width: '100%',
              padding: '2rem',
              boxShadow: '0 24px 60px rgba(14,14,14,0.2)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setNewGroupModal(false)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                width: '30px', height: '30px', borderRadius: '50%',
                background: 'var(--charcoal)', border: 'none',
                color: 'var(--white)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={16} />
            </button>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--charcoal)', marginBottom: '1.5rem' }}>
              New Wishlist Group
            </h3>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: '0.45rem' }}>
              Buyer / Client Name
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., Arvind, Zara, H&M…"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              autoFocus
              style={{ marginBottom: '1.5rem' }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreateGroup(); }}
            />
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setNewGroupModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleCreateGroup} disabled={creating} className="btn-primary">
                {creating ? 'Creating…' : 'Create Group'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

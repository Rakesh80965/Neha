import React, { useState, useEffect } from 'react';
import { Heart, Plus, Trash2, FolderPlus, Bookmark } from 'lucide-react';
import { SampleCard } from '../components/SampleCard';
import { getApiUrl } from '../config';

export const WishlistPage = ({ onOpenModal, wishlistData, refreshWishlist }) => {
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [newGroupModal, setNewGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [creating, setCreating] = useState(false);

  const groups = wishlistData?.groups || [];

  useEffect(() => {
    if (groups.length > 0 && !activeGroupId) {
      setActiveGroupId(groups[0].group_id);
    }
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

      setNewGroupName('');
      setNewGroupModal(false);
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
    if (!window.confirm(`Are you sure you want to delete "${groupName}" and all its saved samples?`)) return;

    try {
      await fetch(getApiUrl('/api/wishlist/groups/delete'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ group_id: groupId }),
      });
      if (activeGroupId === groupId) setActiveGroupId(null);
      await refreshWishlist();
    } catch (err) {
      alert('Could not delete group');
    }
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
    } catch (err) {
      alert('Could not remove sample from group');
    }
  };


  const activeGroup = groups.find((g) => g.group_id === activeGroupId);
  const activeSamples = activeGroup?.samples || [];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--burgundy-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Saved Collections
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.2rem' }}>
            Buyer Wishlist Groups
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(153, 27, 27, 0.2) 0%, rgba(190, 18, 60, 0.2) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#F87171',
              padding: '0.5rem 1.1rem',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Heart size={16} fill="#F87171" />
            <span>{wishlistData?.total_count || 0} Total Saved Samples</span>
          </div>

          <button onClick={() => setNewGroupModal(true)} className="btn-primary">
            <FolderPlus size={18} />
            <span>+ New Group</span>
          </button>
        </div>
      </div>

      {/* Group Chips Bar */}
      <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {groups.map((group) => {
          const isActive = group.group_id === activeGroupId;

          return (
            <div
              key={group.group_id}
              onClick={() => setActiveGroupId(group.group_id)}
              style={{
                padding: '0.6rem 1.2rem',
                borderRadius: '30px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: isActive
                  ? 'linear-gradient(135deg, #BE123C 0%, #991B1B 100%)'
                  : 'rgba(30, 41, 59, 0.6)',
                color: '#FFFFFF',
                border: isActive ? '1px solid #F87171' : '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: isActive ? '0 4px 16px rgba(190, 18, 60, 0.4)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <Bookmark size={15} />
              <span>{group.group_name}</span>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '0.1rem 0.5rem',
                  borderRadius: '10px',
                  fontSize: '0.72rem',
                }}
              >
                {group.count}
              </span>

              <button
                onClick={(e) => handleDeleteGroup(group.group_id, group.group_name, e)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  marginLeft: '0.2rem',
                  padding: '2px',
                  display: 'flex',
                }}
                title="Delete group"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Wishlist Content */}
      {!activeGroup || activeSamples.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            background: 'rgba(30, 41, 59, 0.4)',
            borderRadius: 'var(--radius-xl)',
            border: '1px border-dashed var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '3rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>❤️</div>
          <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 700 }}>
            {groups.length === 0 ? 'No Wishlist Groups Created Yet' : 'This Wishlist Group is Empty'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
            {groups.length === 0
              ? 'Click "+ New Group" to create a wishlist folder for your clients or buyers.'
              : 'Search fabric samples and click on any sample card to add it to this wishlist group.'}
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: '1.6rem',
          }}
        >
          {activeSamples.map((sample) => (
            <SampleCard
              key={sample.sample_no}
              sample={sample}
              onOpenModal={onOpenModal}
              onRemoveFromGroup={handleRemoveSample}
            />
          ))}
        </div>
      )}

      {/* New Group Modal */}
      {newGroupModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 600,
            background: 'rgba(11, 19, 41, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setNewGroupModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid var(--gold-500)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '420px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
            }}
          >
            <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '1.2rem' }}>
              Create Wishlist Group
            </h3>

            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
              Buyer / Client Name
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., Arvind, Aditya Birla, Zara..."
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              autoFocus
              style={{ marginBottom: '1.5rem' }}
            />

            <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setNewGroupModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button type="button" onClick={handleCreateGroup} disabled={creating} className="btn-primary">
                <span>{creating ? 'Creating...' : 'Create Group'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

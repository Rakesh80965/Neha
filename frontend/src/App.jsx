import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { SampleModal } from './components/SampleModal';
import { Toast } from './components/Toast';

import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { SearchPage } from './pages/SearchPage';
import { WishlistPage } from './pages/WishlistPage';
import { AllSamplesPage } from './pages/AllSamplesPage';
import { UploadPage } from './pages/UploadPage';
import { EnquiryRegistrationPage } from './pages/EnquiryRegistrationPage';
import { AllEnquiriesPage } from './pages/AllEnquiriesPage';
import { getApiUrl } from './config';

const MainApp = () => {
  const { user, loading } = useAuth();

  const [authMode, setAuthMode] = useState('login');
  const [activeTab, setActiveTab] = useState('search');

  const [activeModalSample, setActiveModalSample] = useState(null);
  const [wishlistData, setWishlistData] = useState(null);
  const [createdEnquiries, setCreatedEnquiries] = useState([]);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const handleFinalizeOrder = (newEnquiry) => {
    setCreatedEnquiries((prev) => [newEnquiry, ...prev]);
    setActiveTab('all-enquiries');
    setToast({ message: `Order finalized & FDS Report generated for ${newEnquiry.buyer_name}!`, type: 'success' });
  };

  const fetchWishlist = async () => {
    try {
      const res = await fetch(getApiUrl('/api/wishlist'), { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setWishlistData(data);
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const handleAddToWishlist = async (sampleNo, groupId) => {
    const res = await fetch(getApiUrl('/api/wishlist/add'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ sample_no: parseInt(sampleNo), group_id: parseInt(groupId) }),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error || 'Failed to add item to wishlist');
    }
    await fetchWishlist();
    setToast({ message: 'Sample added to wishlist successfully!', type: 'success' });
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-block', width: '36px', height: '36px', border: '2.5px solid rgba(14,14,14,0.1)', borderTopColor: 'var(--charcoal)', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
          <p style={{ marginTop: '1rem', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>Initializing workspace…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return authMode === 'login' ? (
      <LoginPage onSwitchToRegister={() => setAuthMode('register')} />
    ) : (
      <RegisterPage onSwitchToLogin={() => setAuthMode('login')} />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--cream)' }}>
      <Navbar />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          wishlistBadgeCount={wishlistData?.total_count || 0}
        />

        <main style={{ flex: 1, padding: activeTab === 'enquiry' || activeTab === 'all-enquiries' ? '0' : '2.2rem 2.5rem', overflowY: 'auto', background: activeTab === 'enquiry' || activeTab === 'all-enquiries' ? '#f8fafc' : 'var(--cream)' }}>
          {activeTab === 'enquiry' && (
            <EnquiryRegistrationPage
              onCancel={() => setActiveTab('all-enquiries')}
              onSavedSuccess={(newEnquiry) => {
                if (newEnquiry) {
                  setCreatedEnquiries((prev) => [newEnquiry, ...prev]);
                }
                fetchWishlist();
                setToast({ message: 'Buyer enquiry created & Wishlist Group initialized!', type: 'success' });
                setActiveTab('all-enquiries');
              }}
            />
          )}

          {activeTab === 'all-enquiries' && (
            <div style={{ padding: '2rem' }}>
              <AllEnquiriesPage
                onOpenRegistration={() => setActiveTab('enquiry')}
                createdEnquiries={createdEnquiries}
                onDeleteEnquiry={(id) => setCreatedEnquiries((prev) => prev.filter((e) => e.enquiry_id !== id))}
                onNewEnquiryCreated={(newEnq) => setCreatedEnquiries((prev) => [newEnq, ...prev])}
              />
            </div>
          )}

          {activeTab === 'search' && (
            <SearchPage onOpenModal={(sample) => setActiveModalSample(sample)} />
          )}

          {activeTab === 'wishlist' && (
            <WishlistPage
              onOpenModal={(sample) => setActiveModalSample(sample)}
              wishlistData={wishlistData}
              refreshWishlist={fetchWishlist}
              onFinalizeOrder={handleFinalizeOrder}
            />
          )}

          {activeTab === 'data' && (
            <AllSamplesPage onOpenModal={(sample) => setActiveModalSample(sample)} />
          )}

          {activeTab === 'upload' && (
            <UploadPage onUploadSuccess={() => fetchWishlist()} />
          )}
        </main>
      </div>

      {/* Sample Detail Modal */}
      {activeModalSample && (
        <SampleModal
          sample={activeModalSample}
          groups={wishlistData?.groups ? wishlistData.groups.map((g) => ({ id: g.group_id, name: g.group_name })) : []}
          onClose={() => setActiveModalSample(null)}
          onAddToWishlist={handleAddToWishlist}
        />
      )}

      {/* Toast Notification */}
      {toast.message && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      )}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;

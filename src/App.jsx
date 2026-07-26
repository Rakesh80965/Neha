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
import { getApiUrl } from './config';

const MainApp = () => {
  const { user, loading } = useAuth();

  const [authMode, setAuthMode] = useState('login');
  const [activeTab, setActiveTab] = useState('search');

  const [activeModalSample, setActiveModalSample] = useState(null);
  const [wishlistData, setWishlistData] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-400)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid rgba(245,158,11,0.2)', borderTopColor: '#F59E0B', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ marginTop: '1rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>Initializing Fabric Workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ position: 'relative' }}>
        <div className="bg-ambient" />
        {authMode === 'login' ? (
          <LoginPage onSwitchToRegister={() => setAuthMode('register')} />
        ) : (
          <RegisterPage onSwitchToLogin={() => setAuthMode('login')} />
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div className="bg-ambient" />
      <Navbar />

      <div style={{ display: 'flex', flex: 1, position: 'relative', zIndex: 1 }}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          wishlistBadgeCount={wishlistData?.total_count || 0}
        />

        <main style={{ flex: 1, padding: '2.2rem', overflowY: 'auto' }}>
          {activeTab === 'search' && (
            <SearchPage onOpenModal={(sample) => setActiveModalSample(sample)} />
          )}

          {activeTab === 'wishlist' && (
            <WishlistPage
              onOpenModal={(sample) => setActiveModalSample(sample)}
              wishlistData={wishlistData}
              refreshWishlist={fetchWishlist}
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

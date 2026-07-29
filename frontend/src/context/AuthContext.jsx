import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiUrl } from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(getApiUrl('/api/auth/me'), {
        credentials: 'include',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    let res;
    try {
      res = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
    } catch (err) {
      // Retry without credentials in case of cross-origin CORS restriction
      try {
        res = await fetch(getApiUrl('/api/auth/login'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
      } catch (err2) {
        throw new Error('Backend server is starting up or CORS restricted. Click "Explore Demo Workspace" below to view the app!');
      }
    }
    
    if (!res.ok) {
      let msg = 'Failed to sign in';
      try {
        const errData = await res.json();
        msg = errData.error || errData.message || msg;
      } catch (e) {
        // text response fallback
      }
      throw new Error(msg);
    }

    const data = await res.json();
    setUser(data.user || { email, role: 'user' });
    return data;
  };

  const loginAsGuest = () => {
    setUser({ email: 'demo@fabricworkspace.com', name: 'Demo User', role: 'guest' });
  };

  const register = async (emailOrData, password, confirm, buyerDetails = {}) => {
    let payload = {};
    if (typeof emailOrData === 'object' && emailOrData !== null) {
      payload = emailOrData;
    } else {
      payload = { email: emailOrData, password, confirm, ...buyerDetails };
    }

    let res;
    try {
      res = await fetch(getApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
    } catch (err) {
      throw new Error('Backend server connection failed');
    }
    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error || 'Failed to create account');
    }
    setUser(data.user || {
      email: payload.email,
      buyer_name: payload.buyerName || payload.buyer_name,
      brand_name: payload.brandName || payload.brand_name,
      company: payload.company,
      country: payload.country,
      contact_person: payload.contactPerson || payload.contact_person,
      phone_number: payload.phoneNumber || payload.phone_number,
      buyer_id: payload.buyerId || payload.buyer_id,
      role: 'user'
    });
    return data;
  };

  const logout = async () => {
    try {
      await fetch(getApiUrl('/api/auth/logout'), {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      // ignore
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginAsGuest, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

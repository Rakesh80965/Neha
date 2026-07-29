// Configurable API base URL for Render backend
export const RENDER_BACKEND_URL = 'https://neha123-uwym.onrender.com';

const getCleanBaseUrl = (url) => {
  if (!url) return RENDER_BACKEND_URL;
  let clean = url.trim();
  clean = clean.replace(/\/dashboard\/?$/i, '');
  clean = clean.replace(/\/+$/, '');
  return clean;
};

export const API_BASE_URL = getCleanBaseUrl(
  import.meta.env.VITE_API_BASE_URL || RENDER_BACKEND_URL
);

export const getApiUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // If running on local dev server or if frontend and backend share the same domain
  if (
    (import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL && typeof window !== 'undefined' && window.location.hostname === 'localhost') ||
    (typeof window !== 'undefined' && API_BASE_URL && API_BASE_URL.includes(window.location.host))
  ) {
    return cleanPath;
  }

  return `${API_BASE_URL}${cleanPath}`;
};



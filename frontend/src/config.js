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

  // If in local development and proxying to local Flask server without explicit VITE_API_BASE_URL
  if (
    import.meta.env.DEV &&
    !import.meta.env.VITE_API_BASE_URL &&
    window.location.hostname === 'localhost'
  ) {
    return cleanPath;
  }

  return `${API_BASE_URL}${cleanPath}`;
};

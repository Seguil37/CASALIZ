// src/shared/utils/api.js
import axios from 'axios';

// Backend (Laravel) en subdominio
export const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://127.0.0.1:8000';
export const API_BASE = `${API_ORIGIN}/api/v1`;

// Helpers para URLs públicas (imágenes /storage)
export const toPublicUrl = (path) => {
  if (!path) return '';
  const clean = String(path).replaceAll('\\', '/'); // por si llega con \ de Windows
  if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
  if (clean.startsWith('/')) return `${API_ORIGIN}${clean}`;
  return `${API_ORIGIN}/${clean}`;
};

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const isFormData = (data) => typeof FormData !== 'undefined' && data instanceof FormData;

const postWithData = (url, data) =>
  isFormData(data)
    ? api.post(url, data, { headers: { 'Content-Type': 'multipart/form-data' } })
    : api.post(url, data);

const putWithData = (url, data) => {
  if (isFormData(data)) {
    if (!data.has('_method')) data.append('_method', 'PUT');
    return api.post(url, data, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
  return api.put(url, data);
};

export const projectsApi = {
  list: (params) => api.get('/projects', { params }),
  show: (id) => api.get(`/projects/${id}`),
  featured: () => api.get('/projects/featured'),
  create: (data) => postWithData('/projects', data),
  update: (id, data) => putWithData(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

export const servicesApi = {
  list: (params) => api.get('/services', { params }),
  show: (slug) => api.get(`/services/${slug}`),
  create: (data) => postWithData('/services', data),
  update: (id, data) => putWithData(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const reviewsApi = {
  listByProject: (projectId) => api.get('/reviews', { params: { project_id: projectId } }),
  createOrUpdate: (payload) => api.post('/reviews', payload),
  remove: (id) => api.delete(`/reviews/${id}`),
};

export const favoritesApi = {
  list: () => api.get('/favorites'),
  add: (projectId) => api.post('/favorites', { project_id: projectId }),
  remove: (projectId) => api.delete(`/favorites/${projectId}`),
};

export const adminUsersApi = {
  list: (page = 1) => api.get('/users', { params: { page } }),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const settingsApi = {
  public: () => api.get('/settings/public'),
  list: (group) => api.get('/admin/settings', { params: { group } }),
  update: (key, data) => api.put(`/admin/settings/${key}`, data),
  updateGroup: (group, settings) => api.put(`/admin/settings/group/${group}`, { settings }),
  clearCache: () => api.post('/admin/settings/clear-cache'),
};

export default api;

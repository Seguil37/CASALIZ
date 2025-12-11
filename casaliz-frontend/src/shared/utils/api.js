// src/shared/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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

export const projectsApi = {
  list: (params) => api.get('/projects', { params }),
  show: (id) => api.get(`/projects/${id}`),
  featured: () => api.get('/projects/featured'),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const reviewsApi = {
  listByProject: (projectId) => {
    const params = projectId ? { project_id: projectId } : {};
    return api.get('/reviews', { params });
  },
  createOrUpdate: (payload) => api.post('/reviews', payload),
  remove: (id) => api.delete(`/reviews/${id}`),
};

export const favoritesApi = {
  list: () => api.get('/favorites'),
  add: (projectId) => api.post('/favorites', { project_id: projectId }),
  remove: (projectId) => api.delete(`/favorites/${projectId}`),
};

export const usersApi = {
  list: (params) => api.get('/users', { params }),
  create: (payload) => api.post('/users', payload),
  update: (userId, payload) => api.put(`/users/${userId}`, payload),
};

export const settingsApi = {
  public: () => api.get('/settings/public'),
  list: (group) => api.get('/admin/settings', { params: { group } }),
  update: (key, data) => api.put(`/admin/settings/${key}`, data),
  updateGroup: (group, settings) => api.put(`/admin/settings/group/${group}`, { settings }),
  clearCache: () => api.post('/admin/settings/clear-cache'),
};

export default api;

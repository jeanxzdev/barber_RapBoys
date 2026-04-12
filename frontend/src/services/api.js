import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

// Interceptor para manejar el Token JWT automáticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (credentials) => api.post('/users/login/', credentials),
};

export const productsApi = {
  getAll: (params) => api.get('/products/items/', { params }),
  getOne: (slug) => api.get(`/products/items/${slug}/`),
  getCategories: () => api.get('/products/categories/'),
  create: (formData) => api.post('/products/items/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/products/items/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/products/items/${id}/`),
  createCategory: (data) => api.post('/products/categories/', data),
  deleteCategory: (id) => api.delete(`/products/categories/${id}/`),
};

export const usersApi = {
  getAll: () => api.get('/users/list/'),
  delete: (id) => api.delete(`/users/list/${id}/`),
};

export const ordersApi = {
  getAll: () => api.get('/orders/'),
  getStats: () => api.get('/orders/dashboard-stats/'),
  update: (id, data) => api.patch(`/orders/${id}/`, data),
  delete: (id) => api.delete(`/orders/${id}/`),
  create: (data) => api.post('/orders/', data),
  sendOtp: (data) => api.post('/orders/send-otp/', data),
  sendConfirmation: (data) => api.post('/orders/send-confirmation/', data),
};

export const settingsApi = {
  get: (key) => api.get(`/products/settings/${key}/`),
  update: (key, formData) => api.patch(`/products/settings/${key}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  create: (formData) => api.post('/products/settings/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export default api;
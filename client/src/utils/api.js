import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('bookloop_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('bookloop_token');
      localStorage.removeItem('bookloop_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;

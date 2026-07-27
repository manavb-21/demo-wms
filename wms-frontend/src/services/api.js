import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const storedAuth = localStorage.getItem('wmsAuth');

    if (storedAuth) {
      try {
        const { token } = JSON.parse(storedAuth);

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        localStorage.removeItem('wmsAuth');
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('wmsAuth');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export const userApi = {
  getUsers: () => api.get('/users'),
  createUser: (userData) => api.post('/users', userData),
  updateUserRole: (userId, role) => api.patch(`/users/${userId}/role`, { role }),
  toggleUserStatus: (userId, isActive) => api.patch(`/users/${userId}/status`, { isActive }),
  deleteUser: (userId) => api.delete(`/users/${userId}`)
};

export default api;

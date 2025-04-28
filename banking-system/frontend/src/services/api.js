import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getCustomers = () => api.get('/customers');
export const createCustomer = (data) => api.post('/customers', data);

export const getAccounts = () => api.get('/accounts');
export const createAccount = (data) => api.post('/accounts', data);

export const getTransactions = () => api.get('/transactions');
export const createTransaction = (data) => api.post('/transactions', data);

export const customerSignup = (data) => api.post('/auth/customer/signup', data);
export const customerLogin = (data) => api.post('/auth/login', { ...data, user_type: 'customer' });
export const adminLogin = (data) => api.post('/auth/login', { ...data, user_type: 'admin' });
export const adminSignup = (data) => api.post('/auth/admin/signup', data);

export const getCurrentUser = () => api.get('/auth/me');
export const logout = () => api.post('/auth/logout');

export default api;
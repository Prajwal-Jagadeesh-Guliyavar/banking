import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getCustomers = () => api.get('/customers/');
export const createCustomer = (data) => api.post('/customers/', data);
export const customerSignup = (data) => api.post('/auth/customer/signup', data);
export const customerLogin = (data) => api.post('/auth/customer/login', data);

export const getAccounts = () => api.get('/accounts/');
export const createAccount = (data) => api.post('/accounts/', data);

export const getTransactions = () => api.get('/transactions/');
export const createTransaction = (data) => api.post('/transactions/', data);

export const adminSignup = (data) => api.post('/auth/admin/signup', data);
export const adminLogin = (data) => api.post('/auth/admin/login', data);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
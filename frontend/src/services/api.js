import axios from 'axios';

const api = axios.create({
    baseURL : 'http://localhost:5000/api',
});

export const getCustomers = () => api.get('/customers');
export const createCustomer = (data) => api.post('/customers', data);

export const getAccounts = () => api.get('/accounts');
export const createAccount = (data) => api.post('/accounts', data);

export const getTransactions = () => api.get('/transactions');
export const createTransaction = (data) => api.post('transactions', data);
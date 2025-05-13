
const API_URL = 'http://localhost:5000/api';

// Helper function for making authenticated requests
const authFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: `HTTP error! status: ${response.status}`,
    }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

// Auth services
export const registerUser = async (userData) => {
  return await authFetch('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const loginUser = async (credentials) => {
  return await authFetch('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const getUserProfile = async () => {
  return await authFetch('/user');
};

export const updateUserProfile = async (profileData) => {
  return await authFetch('/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
};

export const changePassword = async (passwordData) => {
  return await authFetch('/profile/password', {
    method: 'PUT',
    body: JSON.stringify(passwordData),
  });
};

// Transaction services
export const getTransactions = async () => {
  return await authFetch('/transactions');
};

export const createTransaction = async (transactionData) => {
  return await authFetch('/transactions', {
    method: 'POST',
    body: JSON.stringify(transactionData),
  });
};

// Loan services
export const getLoans = async () => {
  return await authFetch('/loans');
};

export const getLoanApplications = async () => {
  return await authFetch('/loan/applications');
};

export const applyForLoan = async (loanData) => {
  return await authFetch('/loan/apply', {
    method: 'POST',
    body: JSON.stringify(loanData),
  });
};

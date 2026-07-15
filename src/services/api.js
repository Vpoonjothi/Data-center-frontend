import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    // If an Authorization header is already provided (e.g., from an override), don't overwrite it
    if (config.headers['Authorization']) {
      return config;
    }
    
    // Automatically use adminToken for /admin/ endpoints
    if (config.url && config.url.includes('/admin/')) {
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        config.headers['Authorization'] = `Bearer ${adminToken}`;
      }
      return config;
    }

    // Default to customer token for all other endpoints
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to catch HTML responses (e.g. Nginx 404 pages) instead of expected JSON
api.interceptors.response.use(
  (response) => {
    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('text/html') && typeof response.data === 'string') {
      return Promise.reject(new Error('Received HTML response instead of JSON. The API endpoint might be missing or misconfigured on the server.'));
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Submit public enquiry
export const submitEnquiry = async (enquiryData) => {
  const response = await api.post('/enquiries', enquiryData);
  return response.data;
};

// Get user's own enquiries
export const getMyEnquiries = async () => {
  const response = await api.get('/enquiries/me');
  return response.data;
};

export const getMyQuotes = async () => {
  const response = await api.get('/quotes/my-quotes');
  return response.data;
};

export const acceptQuote = async (id) => {
  const response = await api.put(`/quotes/${id}/accept`);
  return response.data;
};

export const rejectQuote = async (id, reject_reason) => {
  const response = await api.put(`/quotes/${id}/reject`, { reject_reason });
  return response.data;
};

// --- PAYMENTS ---

export const getPaymentDetails = async (quoteId) => {
  const response = await api.get(`/payments/${quoteId}/details`);
  return response.data;
};

export const processPayment = async (quoteId, termsAccepted) => {
  const response = await api.post(`/payments/${quoteId}/process`, { termsAccepted });
  return response.data;
};

export const createServiceRenewalOrder = async (serviceId) => {
  const response = await api.post(`/payments/service/${serviceId}/razorpay/create-order`);
  return response.data;
};

export const verifyServiceRenewalPayment = async (serviceId, paymentData) => {
  const response = await api.post(`/payments/service/${serviceId}/razorpay/verify`, paymentData);
  return response.data;
};

// --- SERVICES ---

export const getMyServices = async () => {
  const response = await api.get('/services/my-services');
  return response.data;
};

export const getAllServices = async () => {
  const response = await api.get('/services/all');
  return response.data;
};

// --- VERIFICATIONS ---

export const uploadVerificationDocs = async (formData) => {
  const response = await api.post('/verifications/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getVerificationStatus = async (quoteId) => {
  const response = await api.get(`/verifications/status/${quoteId}`);
  return response.data;
};

// --- NEW KYC VERIFICATIONS (API-First) ---

export const getKycStatus = async (quoteId) => {
  const response = await api.get(`/kyc/status/${quoteId}`);
  return response.data;
};

export const startAadhaarVerification = async (quoteId, kycConsent, otp, aadhaarNumber, customerDetails, customerType) => {
  const response = await api.post(`/kyc/aadhaar/start`, { quoteId, kycConsent, otp, aadhaarNumber, customerDetails, customerType });
  return response.data;
};

export const startPanVerification = async (quoteId, kycConsent) => {
  const response = await api.post(`/kyc/pan/start`, { quoteId, kycConsent });
  return response.data;
};

export const submitKyc = async (formData) => {
  const response = await api.post('/kyc/submit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const replaceKycDocument = async (formData) => {
  const response = await api.post('/kyc/replace-document', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getMyPayments = async () => {
  const response = await api.get('/payments/my-payments');
  return response.data;
};

// --- OFFERS ---
export const getOffers = async () => {
  const response = await api.get('/offers');
  return response.data;
};

// --- CONTENT CMS ---
export const getContentBlocks = async () => {
  const response = await api.get('/content');
  return response.data; // object mapping keys to blocks
};

// AI Servers
export const getAiServers = async () => {
  const response = await api.get('/ai-servers');
  return response.data;
};

export default api;

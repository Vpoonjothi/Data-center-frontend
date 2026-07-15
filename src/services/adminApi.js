import api from '../utils/axios';

const BASE_API = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`;
const API_URL = `${BASE_API}/admin`;

const getConfig = () => {
  const token = localStorage.getItem('adminToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Auth
export const loginAdmin = async (email, password) => {
  const response = await api.post(`${API_URL}/auth/login`, { email, password });
  if (response.data.success && response.data.data.token) {
    localStorage.setItem('adminToken', response.data.data.token);
    localStorage.setItem('adminInfo', JSON.stringify(response.data.data));
  }
  return response.data;
};

export const logoutAdmin = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminInfo');
};

export const getAdminProfile = async () => {
  const response = await api.get(`${API_URL}/auth/me`, getConfig());
  return response.data;
};

export const updateAdminPassword = async (currentPassword, newPassword) => {
  const response = await api.put(`${API_URL}/auth/password`, { currentPassword, newPassword }, getConfig());
  return response.data;
};

export const updateAdminProfile = async (profileData) => {
  const response = await api.put(`${API_URL}/auth/profile`, profileData, getConfig());
  return response.data;
};

export const updateAdminNotifications = async (notificationsData) => {
  const response = await api.put(`${API_URL}/auth/notifications`, notificationsData, getConfig());
  return response.data;
};

// Users
export const getUsers = async () => {
  const response = await api.get(`${API_URL}/users`, getConfig());
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`${API_URL}/users/${id}`, getConfig());
  return response.data;
};

export const updateUserStatus = async (id, status) => {
  const response = await api.put(`${API_URL}/users/${id}/status`, { status }, getConfig());
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`${API_URL}/users/${id}`, getConfig());
  return response.data;
};

// Superadmin (Admin Management)
export const getAdmins = async () => {
  const response = await api.get(`${API_URL}/admins`, getConfig());
  return response.data;
};

export const createAdmin = async (adminData) => {
  const response = await api.post(`${API_URL}/admins`, adminData, getConfig());
  return response.data;
};

export const deleteAdmin = async (id) => {
  const response = await api.delete(`${API_URL}/admins/${id}`, getConfig());
  return response.data;
};

export const updateAdminAccount = async (id, adminData) => {
  const response = await api.put(`${API_URL}/admins/${id}`, adminData, getConfig());
  return response.data;
};

// --- AI SERVERS ---
const AI_SERVER_API = `${BASE_API}/ai-servers`;

export const getAdminAiServers = async () => {
  const response = await api.get(`${AI_SERVER_API}/admin`, getConfig());
  return response.data;
};

export const createAiServer = async (serverData) => {
  const response = await api.post(AI_SERVER_API, serverData, getConfig());
  return response.data;
};

export const updateAiServer = async (id, serverData) => {
  const response = await api.put(`${AI_SERVER_API}/${id}`, serverData, getConfig());
  return response.data;
};

export const deleteAiServer = async (id) => {
  const response = await api.delete(`${AI_SERVER_API}/${id}`, getConfig());
  return response.data;
};

// Enquiries
export const getEnquiries = async () => {
  const response = await api.get(`${API_URL}/enquiries`, getConfig());
  return response.data;
};

export const getEnquiryById = async (id) => {
  const response = await api.get(`${API_URL}/enquiries/${id}`, getConfig());
  return response.data;
};

export const updateEnquiryStatus = async (id, status) => {
  const response = await api.put(`${API_URL}/enquiries/${id}/status`, { status }, getConfig());
  return response.data;
};

export const addEnquiryResponse = async (id, subject, responseText, markAsClosed) => {
  const response = await api.post(`${API_URL}/enquiries/${id}/responses`, {
    subject,
    response: responseText,
    markAsClosed
  }, getConfig());
  return response.data;
};

export const addEnquiryNote = async (id, note_text) => {
  const response = await api.post(`${API_URL}/enquiries/${id}/notes`, { note_text }, getConfig());
  return response.data;
};

export const deleteEnquiryNote = async (enquiryId, noteId) => {
  const response = await api.delete(`${API_URL}/enquiries/${enquiryId}/notes/${noteId}`, getConfig());
  return response.data;
};

export const generateQuoteFromEnquiry = async (id, payload) => {
  const response = await api.post(`${API_URL}/enquiries/${id}/quote`, payload, getConfig());
  return response.data;
};

// Quotes
export const getQuotes = async () => {
  const response = await api.get(`${API_URL}/quotes`, getConfig());
  return response.data;
};

export const getQuoteById = async (id) => {
  const response = await api.get(`${API_URL}/quotes/${id}`, getConfig());
  return response.data;
};

export const updateQuoteStatus = async (id, status, final_amount, notes) => {
  const payload = { status };
  if (final_amount !== undefined) payload.final_amount = final_amount;
  if (notes !== undefined) payload.notes = notes;
  const response = await api.put(`${API_URL}/quotes/${id}/status`, payload, getConfig());
  return response.data;
};

// Verifications
export const getVerifications = async () => {
  const response = await api.get(`${API_URL}/verifications`, getConfig());
  return response.data;
};

export const getVerificationById = async (id) => {
  const response = await api.get(`${API_URL}/verifications/${id}`, getConfig());
  return response.data;
};

export const updateVerificationStatus = async (id, status, admin_notes) => {
  const response = await api.put(`${API_URL}/verifications/${id}/status`, { status, admin_notes }, getConfig());
  return response.data;
};

export const getVerificationDocumentUrl = (filename) => {
  return `${API_URL}/verifications/document/${filename}`;
};

// KYC
export const getAdminKycVerifications = async () => {
  const response = await api.get(`${API_URL}/kyc`, getConfig());
  return response.data;
};

export const getAdminKycVerificationById = async (id) => {
  const response = await api.get(`${API_URL}/kyc/${id}`, getConfig());
  return response.data;
};

export const updateAdminKycVerificationStatus = async (id, status, reject_reason, admin_notes) => {
  const response = await api.put(`${API_URL}/kyc/${id}/status`, { status, reject_reason, admin_notes }, getConfig());
  return response.data;
};

export const updateAdminKycDocumentStatus = async (id, documentType, status, reason) => {
  const response = await api.put(`${API_URL}/kyc/${id}/document-status`, { documentType, status, reason }, getConfig());
  return response.data;
};

export const getKycDocumentBlob = async (path, userId) => {
  const token = localStorage.getItem('adminToken');
  const response = await api.get(`${API_URL}/kyc/document?path=${path}&userId=${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob'
  });
  return response.data;
};

// Services
export const getAdminServices = async () => {
  const response = await api.get(`${API_URL}/services`, getConfig());
  return response.data;
};

// Payments
export const getAdminPayments = async () => {
  const response = await api.get(`${API_URL}/payments`, getConfig());
  return response.data;
};

// Compliance
export const getComplianceLogs = async () => {
  const response = await api.get(`${API_URL}/compliance/logs`, getConfig());
  return response.data;
};

export const getAuditLogs = async () => {
  const response = await api.get(`${API_URL}/compliance/audit-logs`, getConfig());
  return response.data;
};

// Offers (Using absolute URL since the route is on /api/offers not /api/admin/offers)
export const updateOffer = async (id, data) => {
  const token = localStorage.getItem('adminToken');
  const response = await api.put(`${BASE_API}/offers/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createOffer = async (data) => {
  const token = localStorage.getItem('adminToken');
  const response = await api.post(`${BASE_API}/offers`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteOffer = async (id) => {
  const token = localStorage.getItem('adminToken');
  const response = await api.delete(`${BASE_API}/offers/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Content CMS (Using absolute URL)
export const createContentBlock = async (data) => {
  const token = localStorage.getItem('adminToken');
  const response = await api.post(`${BASE_API}/content`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateContentBlock = async (id, data) => {
  const token = localStorage.getItem('adminToken');
  const response = await api.put(`${BASE_API}/content/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteContentBlock = async (id) => {
  const token = localStorage.getItem('adminToken');
  const response = await api.delete(`${BASE_API}/content/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Admin Notifications
export const getAdminNotifications = async () => {
  const response = await api.get(`${API_URL}/notifications`, getConfig());
  return response.data;
};

export const markAdminNotificationRead = async (id) => {
  const response = await api.put(`${API_URL}/notifications/${id}/read`, {}, getConfig());
  return response.data;
};

export const markAllAdminNotificationsRead = async () => {
  const response = await api.put(`${API_URL}/notifications/read-all`, {}, getConfig());
  return response.data;
};

export const clearAllAdminNotifications = async () => {
  const response = await api.delete(`${API_URL}/notifications/clear-all`, getConfig());
  return response.data;
};

// Admin Dashboard
export const getAdminDashboardStats = async () => {
  const response = await api.get(`${API_URL}/dashboard`, getConfig());
  return response.data;
};

// Admin Settings
export const getGlobalSettings = async () => {
  const response = await api.get(`${API_URL}/settings`, getConfig());
  return response.data;
};

export const updateGlobalSettings = async (settings) => {
  const response = await api.put(`${API_URL}/settings`, { settings }, getConfig());
  return response.data;
};

// Admin Services extension
export const updateAdminServiceStatus = async (id, status) => {
  const response = await api.put(`${API_URL}/services/${id}/status`, { status }, getConfig());
  return response.data;
};

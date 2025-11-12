import axios from 'axios';
// import { retryApiCall, isRetryableError } from '@/utils/apiUtils';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000; // Increased to 30 seconds

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add retry configuration
  retry: 3,
  retryDelay: 1000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eep_jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle timeout errors
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      console.error('API timeout:', error.message);
      return Promise.reject({
        error: 'Connection timeout',
        message: 'Server is taking too long to respond. Please try again.',
        timeout: true
      });
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject({
        error: 'Network error',
        message: 'Unable to connect to server. Please check your internet connection.',
        network: true
      });
    }
    
    // Handle 401 errors (token expired)
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('eep_jwt_token');
      localStorage.removeItem('eep_current_user');
      window.location.href = '/login';
    }
    
    // Handle other HTTP errors
    const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
    return Promise.reject({
      error: error.response?.data?.error || 'Server error',
      message: errorMessage,
      status: error.response?.status,
      statusText: error.response?.statusText
    });
  }
);

// API Services
export const authAPI = {
  // Login
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export const usersAPI = {
  // Get all users
  getUsers: async (params = {}) => {
    try {
      const response = await api.get('/users', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create user
  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user status
  updateUserStatus: async (id, status) => {
    try {
      const response = await api.put(`/users/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user role
  updateUserRole: async (id, role) => {
    try {
      const response = await api.put(`/users/${id}/role`, { role });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const response = await api.get('/users/stats/overview');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export const agenciesAPI = {
  // Search agencies by name (autocomplete)
  searchAgencies: async (query) => {
    try {
      const response = await api.get(`/agencies/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all agencies
  getAgencies: async (params = {}) => {
    try {
      const response = await api.get('/agencies', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all agencies (alias)
  getAllAgencies: async () => {
    try {
      const response = await api.get('/agencies');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get agency by ID
  getAgencyById: async (id) => {
    try {
      const response = await api.get(`/agencies/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create agency
  createAgency: async (agencyData) => {
    try {
      const response = await api.post('/agencies', agencyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Register new agency
  registerAgency: async (agencyData) => {
    try {
      const response = await api.post('/agencies/register', agencyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update agency
  updateAgency: async (id, agencyData) => {
    try {
      const response = await api.put(`/agencies/${id}`, agencyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Approve agency
  approveAgency: async (id) => {
    try {
      const response = await api.put(`/agencies/${id}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reject agency
  rejectAgency: async (id) => {
    try {
      const response = await api.put(`/agencies/${id}/reject`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get agency statistics
  getAgencyStats: async () => {
    try {
      const response = await api.get('/agencies/stats/overview');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export const projectsAPI = {
  // Get all projects
  getProjects: async (params = {}) => {
    try {
      const response = await api.get('/projects', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get project by ID
  getProjectById: async (id) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create project
  createProject: async (projectData) => {
    try {
      const response = await api.post('/projects', projectData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Register project (alias for createProject, uses /projects/register endpoint)
  registerProject: async (projectData) => {
    try {
      const response = await api.post('/projects/register', projectData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update project
  updateProject: async (id, projectData) => {
    try {
      const response = await api.put(`/projects/${id}`, projectData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete project
  deleteProject: async (id) => {
    try {
      const response = await api.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get project steps (16 steps)
  getProjectSteps: async (projectId) => {
    try {
      const response = await api.get(`/project-steps/${projectId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update project step
  updateProjectStep: async (projectId, stepId, stepData) => {
    try {
      const response = await api.put(`/project-steps/${projectId}/${stepId}`, stepData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Upload step evidence
  uploadStepEvidence: async (projectId, stepId, formData) => {
    try {
      const response = await api.post(`/project-steps/${projectId}/${stepId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Download step evidence
  downloadStepEvidence: async (projectId, stepId) => {
    try {
      const response = await api.get(`/project-steps/${projectId}/${stepId}/download`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export const coordinatorsAPI = {
  // Get all coordinators
  getCoordinators: async (params = {}) => {
    try {
      const response = await api.get('/coordinators', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get coordinator by ID
  getCoordinatorById: async (id) => {
    try {
      const response = await api.get(`/coordinators/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create coordinator
  createCoordinator: async (coordinatorData) => {
    try {
      const response = await api.post('/coordinators', coordinatorData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update coordinator
  updateCoordinator: async (id, coordinatorData) => {
    try {
      const response = await api.put(`/coordinators/${id}`, coordinatorData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Approve coordinator
  approveCoordinator: async (id) => {
    try {
      const response = await api.put(`/coordinators/${id}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reject coordinator
  rejectCoordinator: async (id) => {
    try {
      const response = await api.put(`/coordinators/${id}/reject`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete coordinator
  deleteCoordinator: async (id) => {
    try {
      const response = await api.delete(`/coordinators/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export const reportsAPI = {
  // Get all reports
  getReports: async (params = {}) => {
    try {
      const response = await api.get('/reports', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get report by ID
  getReportById: async (id) => {
    try {
      const response = await api.get(`/reports/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create report
  createReport: async (reportData) => {
    try {
      const response = await api.post('/reports', reportData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update report
  updateReport: async (id, reportData) => {
    try {
      const response = await api.put(`/reports/${id}`, reportData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete report
  deleteReport: async (id) => {
    try {
      const response = await api.delete(`/reports/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Health check
export const healthAPI = {
  check: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// EPC API
export const epcAPI = {
  // Register EPC company
  registerEpc: async (epcData, files) => {
    try {
      const formData = new FormData();
      
      // Add form data
      Object.keys(epcData).forEach(key => {
        if (epcData[key] !== null && epcData[key] !== undefined) {
          formData.append(key, epcData[key]);
        }
      });
      
      // Add files
      Object.keys(files).forEach(key => {
        if (files[key]) {
          formData.append(key, files[key]);
        }
      });
      
      const response = await api.post('/epc/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get EPC companies list
  getEpcList: async () => {
    try {
      const response = await api.get('/epc/list');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all EPC companies (alias for getEpcList)
  getAllEpcCompanies: async () => {
    try {
      const response = await api.get('/epc/list');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get EPC company by ID
  getEpcById: async (id) => {
    try {
      const response = await api.get(`/epc/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update EPC company
  updateEpc: async (id, epcData) => {
    try {
      const response = await api.put(`/epc/${id}`, epcData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete EPC company
  deleteEpc: async (id) => {
    try {
      const response = await api.delete(`/epc/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Approve EPC company
  approveEpc: async (id) => {
    try {
      const response = await api.put(`/epc/${id}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reject EPC company
  rejectEpc: async (id) => {
    try {
      const response = await api.put(`/epc/${id}/reject`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export const documentVersionsAPI = {
  // Get all versions for a project
  getProjectVersions: async (projectId) => {
    try {
      const response = await api.get(`/document-versions/project/${projectId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get project summary with version info
  getProjectSummary: async (projectId) => {
    try {
      const response = await api.get(`/document-versions/project/${projectId}/summary`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new version (edit document)
  createVersion: async (projectId, versionData) => {
    try {
      const response = await api.post(`/document-versions/project/${projectId}`, versionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get specific version by ID
  getVersionById: async (versionId) => {
    try {
      const response = await api.get(`/document-versions/${versionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default api;

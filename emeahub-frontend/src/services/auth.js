import API from './api';

export const authService = {
    // Register a new student or public user
    register: async (userData) => {
        const response = await API.post('/register', userData);
        return response.data;
    },

    // Register a new teacher (requires admin approval)
    registerTeacher: async (teacherData) => {
        const response = await API.post('/register/teacher', teacherData);
        return response.data;
    },

    // Login user
    login: async (credentials) => {
        const response = await API.post('/login', credentials);
        return response.data;
    },

    // Logout user
    logout: async () => {
        const response = await API.post('/logout');
        return response.data;
    },

    // Get current user profile
    getCurrentUser: async () => {
        const response = await API.get('/me');
        return response.data;
    },

    // Update user profile
    updateProfile: async (userData) => {
        const response = await API.put('/profile', userData);
        return response.data;
    },

    // Change password
    changePassword: async (passwordData) => {
        const response = await API.post('/change-password', passwordData);
        return response.data;
    },

    // Request password reset
    forgotPassword: async (email) => {
        const response = await API.post('/forgot-password', { email });
        return response.data;
    },

    // Reset password with token
    resetPassword: async (resetData) => {
        const response = await API.post('/reset-password', resetData);
        return response.data;
    },

    // Verify email
    verifyEmail: async (token) => {
        const response = await API.get(`/verify-email/${token}`);
        return response.data;
    },

    // Resend verification email
    resendVerification: async () => {
        const response = await API.post('/email/resend');
        return response.data;
    },

    // Check if user is authenticated
    checkAuth: () => {
        const token = localStorage.getItem('token');
        return !!token;
    },

    // Get stored token
    getToken: () => {
        return localStorage.getItem('token');
    },

    // Set token
    setToken: (token) => {
        localStorage.setItem('token', token);
    },

    // Remove token
    removeToken: () => {
        localStorage.removeItem('token');
    },

    // Get user role from stored user data
    getUserRole: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                return user.role;
            } catch {
                return null;
            }
        }
        return null;
    },

    // Store user data
    setUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
    },

    // Get stored user data
    getUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
        return null;
    },

    // Clear all auth data
    clearAuth: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export default authService;
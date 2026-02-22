import axios from 'axios';
import toast from 'react-hot-toast';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log requests in development
        if (import.meta.env.DEV) {
            console.log(`🚀 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, config);
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
API.interceptors.response.use(
    (response) => {
        // Log responses in development
        if (import.meta.env.DEV) {
            console.log('✅ Response:', response.data);
        }
        return response;
    },
    (error) => {
        // Handle errors
        if (error.response) {
            const { status, data } = error.response;
            
            // Log errors in development
            if (import.meta.env.DEV) {
                console.error('❌ Error:', status, data);
            }
            
            // Handle specific status codes
            switch (status) {
                case 401:
                    localStorage.removeItem('token');
                    if (!window.location.pathname.includes('/login')) {
                        toast.error('Session expired. Please login again.');
                        window.location.href = '/login';
                    }
                    break;
                    
                case 403:
                    toast.error('You do not have permission to perform this action.');
                    break;
                    
                case 404:
                    toast.error('Resource not found.');
                    break;
                    
                case 422:
                    // Validation errors - handled by components
                    break;
                    
                case 500:
                    toast.error('Server error. Please try again later.');
                    break;
                    
                default:
                    toast.error(data?.message || 'An error occurred.');
            }
        } else if (error.request) {
            // Network error
            toast.error('Network error. Please check your connection.');
            console.error('Network Error:', error.request);
        } else {
            // Something else
            toast.error('An unexpected error occurred.');
            console.error('Error:', error.message);
        }
        
        return Promise.reject(error);
    }
);

// File upload helper
export const uploadFile = (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return API.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
            if (onProgress) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percentCompleted);
            }
        },
    });
};

export default API;
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

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (import.meta.env.DEV) {
            console.log(`🚀 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, config);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

API.interceptors.response.use(
    (response) => {
        if (import.meta.env.DEV) {
            console.log('✅ Response:', response.data);
        }
        return response;
    },
    (error) => {
        if (error.response) {
            const { status, data } = error.response;
            
            if (import.meta.env.DEV) {
                console.error('❌ Error:', status, data);
            }
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
                    break;
                case 500:
                    toast.error('Server error. Please try again later.');
                    break;
                default:
                    toast.error(data?.message || 'An error occurred.');
            }
        } else if (error.request) {
            toast.error('Network error. Please check your connection.');
            console.error('Network Error:', error.request);
        } else {
            toast.error('An unexpected error occurred.');
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

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

import API from './api';

export const resourceService = {
    // Public endpoints
    getResources: (params) => API.get('/resources', { params }),
    getResource: (id) => API.get(`/resources/${id}`),
    downloadResource: (id) => API.get(`/resources/${id}/download`),
    
    // Authenticated endpoints
    uploadResource: (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });
        return API.post('/resources/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    getMyUploads: () => API.get('/resources/my-uploads'),
    deleteResource: (id) => API.delete(`/resources/${id}`),
    rateResource: (id, rating, review) => API.post(`/resources/${id}/rate`, { rating, review }),
    
    // Teacher endpoints
    getPendingVerifications: () => API.get('/teacher/pending'),
    verifyResource: (id, action, rejectionReason) => 
        API.post(`/teacher/verify/${id}`, { action, rejection_reason: rejectionReason }),
    
    // Search
    searchResources: (query) => API.get('/search/all', { params: { q: query } })
};
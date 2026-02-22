import API from './api';

export const gamificationService = {
    // Public endpoints
    getLeaderboard: (type = 'points', page = 1) => 
        API.get('/leaderboard', { params: { type, page } }),
    getAchievements: () => API.get('/achievements'),
    
    // Authenticated endpoints
    getUserStats: () => API.get('/user/stats'),
    getUserActivity: () => API.get('/user/activity'),
    getUserRank: () => API.get('/user/rank'),
    getUserAchievements: () => API.get('/user/achievements'),
    
    // Teacher stats
    getTeacherStats: () => API.get('/teacher/stats'),
    getTeacherContributions: () => API.get('/teacher/contributions'),
    
    // Admin endpoints
    getAdminLeaderboard: () => API.get('/admin/leaderboard/admin-view'),
    createAchievement: (data) => API.post('/admin/achievements/create', data),
    updateAchievement: (id, data) => API.put(`/admin/achievements/${id}`, data)
};
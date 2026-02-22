import API from './api';

export const aiService = {
    // Smart search with AI understanding
    smartSearch: async (query) => {
        const response = await API.post('/ai/search', { query });
        return response;
    },

    // Chat with AI assistant
    chat: async (message) => {
        const response = await API.post('/ai/chat', { message });
        return response;
    },

    // Generate study plan
    generateStudyPlan: async (subjectId, hoursPerDay, examDate) => {
        const response = await API.post('/ai/study-plan', {
            subject_id: subjectId,
            hours_per_day: hoursPerDay,
            exam_date: examDate
        });
        return response;
    },

    // Get trending topics
    getTrendingTopics: async () => {
        const response = await API.get('/ai/trending-topics');
        return response;
    },

    // Get chat history
    getChatHistory: async () => {
        const response = await API.get('/ai/chat-history');
        return response;
    },

    // Summarize content
    summarize: async (content) => {
        const response = await API.post('/ai/summarize', { content });
        return response;
    },

    // Get personalized recommendations
    getRecommendations: async () => {
        const response = await API.post('/ai/recommend');
        return response;
    }
};

export default aiService;
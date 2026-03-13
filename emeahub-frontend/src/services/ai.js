import API from "./api";

export const aiService = {
    // Smart search with AI understanding
    smartSearch: async (query) => {
        const { data } = await API.post("/ai/search", { query });
        return data;
    },

    // Chat with AI assistant
    chat: async (message) => {
        const { data } = await API.post("/ai/chat", { message });
        return data;
    },

    // Generate study plan
    generateStudyPlan: async (subjectId, hoursPerDay, examDate) => {
        const { data } = await API.post("/ai/study-plan", {
            subject_id: subjectId,
            hours_per_day: hoursPerDay,
            exam_date: examDate,
        });
        return data;
    },

    // Get trending topics
    getTrendingTopics: async () => {
        const { data } = await API.get("/ai/trending-topics");
        return data;
    },

    // Chat history
    getChatHistory: async () => {
        const { data } = await API.get("/ai/chat-history");
        return data;
    },

    // Summarize topic
    summarize: async (topic) => {
        const { data } = await API.post("/ai/summarize", { topic });
        return data;
    },

    // Recommendations
    getRecommendations: async () => {
        const { data } = await API.post("/ai/recommend");
        return data;
    },
};

export default aiService;
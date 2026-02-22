import { useState, useEffect } from 'react';
import { aiService } from '../../services/ai';
import LoadingSpinner from '../common/LoadingSpinner';
import { ChatBubbleLeftIcon, ClockIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../utils/helpers';

export default function AIHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedChat, setSelectedChat] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await aiService.getChatHistory();
            setHistory(response.data.history || []);
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Chat History
            </h1>

            {history.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                    <ChatBubbleLeftIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No chat history yet</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Start a conversation with the AI assistant
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map((chat) => (
                        <div
                            key={chat.id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => setSelectedChat(selectedChat === chat.id ? null : chat.id)}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                    {chat.query}
                                </h3>
                                <span className="text-xs text-gray-500 flex items-center">
                                    <ClockIcon className="h-4 w-4 mr-1" />
                                    {formatDate(chat.created_at)}
                                </span>
                            </div>

                            {selectedChat === chat.id && (
                                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                        {chat.response}
                                    </p>
                                    {chat.resources_suggested && (
                                        <div className="mt-3">
                                            <p className="text-xs font-medium text-gray-500 mb-2">
                                                Suggested Resources:
                                            </p>
                                            <div className="space-y-2">
                                                {JSON.parse(chat.resources_suggested).map((res, idx) => (
                                                    <div key={idx} className="text-sm text-primary-600">
                                                        • {res.title}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
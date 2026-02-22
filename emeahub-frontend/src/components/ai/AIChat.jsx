import { useState, useRef, useEffect } from 'react';
// import { useAuth } from '../../hooks/useAuth';
import { useAuth } from '../../context/AuthContext';
import { aiService } from '../../services/ai';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
    PaperAirplaneIcon, 
    // RobotIcon, 
    UserIcon,
    SparklesIcon,
    BookOpenIcon 
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AIChat() {
    const { isAuthenticated } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestedResources, setSuggestedResources] = useState([]);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        // Add welcome message
        setMessages([
            {
                role: 'assistant',
                content: '👋 Hello! I\'m your EMEAHub AI Assistant. I can help you with:\n\n' +
                        '• Finding study resources\n' +
                        '• Explaining concepts\n' +
                        '• Creating study plans\n' +
                        '• Answering academic questions\n\n' +
                        'What would you like help with today?'
            }
        ]);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        if (!isAuthenticated) {
            toast.error('Please login to use AI chat');
            return;
        }

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);
        setSuggestedResources([]);

        try {
            const response = await aiService.chat(userMessage);
            
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: response.data.response 
            }]);

            if (response.data.suggested_resources?.length > 0) {
                setSuggestedResources(response.data.suggested_resources);
            }

        } catch (error) {
            toast.error('Failed to get response from AI');
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: 'Sorry, I encountered an error. Please try again.' 
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                        <SparklesIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white">EMEAHub AI Assistant</h2>
                        <p className="text-sm text-primary-100">Powered by Google Gemini</p>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-4"
            >
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar */}
                            <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-3' : 'mr-3'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    message.role === 'user' 
                                        ? 'bg-primary-100 text-primary-600' 
                                        : 'bg-purple-100 text-purple-600'
                                }`}>
                                    {message.role === 'user' ? (
                                        <UserIcon className="h-5 w-5" />
                                    ) : (
                                        // <RobotIcon className="h-5 w-5" />
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot-icon lucide-bot"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                                    )}
                                </div>
                            </div>

                            {/* Message Bubble */}
                            <div>
                                <div className={`rounded-lg px-4 py-2 ${
                                    message.role === 'user'
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                }`}>
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date().toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="flex max-w-[80%] flex-row">
                            <div className="flex-shrink-0 mr-3">
                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                    {/* <RobotIcon className="h-5 w-5 text-purple-600" /> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot-icon lucide-bot"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                                </div>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3">
                                <LoadingSpinner size="sm" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Suggested Resources */}
                {suggestedResources.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                            <BookOpenIcon className="h-4 w-4 mr-1" />
                            Recommended Resources
                        </h4>
                        <div className="space-y-2">
                            {suggestedResources.map((resource, index) => (
                                <Link
                                    key={index}
                                    to={`/resources/${resource.id}`}
                                    className="block p-2 bg-white dark:bg-gray-800 rounded hover:shadow transition-shadow"
                                >
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {resource.title}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {resource.type} • ⭐ {resource.rating}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex space-x-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything about your studies..."
                        className="flex-1 input-field resize-none"
                        rows="2"
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="btn-primary px-4 self-end"
                    >
                        <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    {!isAuthenticated && 'Please login to use AI chat'}
                </p>
            </div>
        </div>
    );
}
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

        // if (!isAuthenticated) {
        //     toast.error('Please login to use AI chat');
        //     return;
        // }

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);
        setSuggestedResources([]);

        try {
            const response = await aiService.chat(userMessage);

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response.response
            }]);

            if (response.suggested_resources?.length > 0) {
                setSuggestedResources(response.suggested_resources);
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
        <div className="max-w-4xl mx-auto h-[calc(100vh-10rem)] flex flex-col bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700/50 overflow-hidden animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-indigo-600 px-8 py-7 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 shadow-xl">
                            <SparklesIcon className="h-7 w-7" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight">AI Academic Assistant</h2>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                <p className="text-[10px] font-black text-white/80 uppercase tracking-widest">Powered by Gemini Pro</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`flex max-w-[85%] gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar */}
                            <div className="flex-shrink-0 pt-1">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm border ${
                                    message.role === 'user' 
                                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 border-primary-100 dark:border-primary-800' 
                                        : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 border-indigo-100 dark:border-indigo-800'
                                }`}>
                                    {message.role === 'user' ? <UserIcon className="h-5 w-5" /> : <SparklesIcon className="h-5 w-5" />}
                                </div>
                            </div>

                            {/* Message Content */}
                            <div className={`space-y-1 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`rounded-3xl px-6 py-4 shadow-sm text-sm font-medium leading-relaxed ${
                                    message.role === 'user'
                                        ? 'bg-primary-600 text-white rounded-tr-none'
                                        : 'bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-800 rounded-tl-none'
                                }`}>
                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                </div>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">
                                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start animate-pulse">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                                <SparklesIcon className="h-5 w-5" />
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl px-8 py-4 flex items-center gap-2 border border-gray-100 dark:border-gray-800">
                                <div className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Suggested Resources */}
                {suggestedResources.length > 0 && (
                    <div className="mt-8 bg-blue-50/50 dark:bg-blue-900/10 rounded-[2rem] p-6 border border-blue-100 dark:border-blue-900/20 animate-in zoom-in-95 duration-500">
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <BookOpenIcon className="h-5 w-5 text-blue-600" />
                            <h4 className="text-sm font-black text-blue-900 dark:text-blue-100 uppercase tracking-widest">Recommended Files</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {suggestedResources.map((resource, index) => (
                                <Link
                                    key={index}
                                    to={`/resources/${resource.id}`}
                                    className="flex flex-col p-4 bg-white dark:bg-gray-800 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all border border-blue-50 dark:border-gray-700 group"
                                >
                                    <p className="text-xs font-black text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors uppercase tracking-tight line-clamp-1">{resource.title}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{resource.type}</span>
                                        <span className="text-primary-600 text-[10px] font-black">VIEW FILE →</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-8 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800/50">
                <div className="relative flex items-end gap-4">
                    {!isAuthenticated && (
                        <div className="absolute inset-0 z-20 bg-white/60 dark:bg-gray-900/60 backdrop-blur-[2px] rounded-3xl flex items-center justify-center p-4">
                            <Link to="/login" className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black rounded-xl uppercase tracking-widest shadow-xl">
                                Login to continue chat
                            </Link>
                        </div>
                    )}
                    <div className="flex-1 relative group">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask about subjects, topics, or study plans..."
                            className="w-full px-7 py-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2rem] focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 transition-all resize-none shadow-sm"
                            rows="2"
                            disabled={loading || !isAuthenticated}
                        />
                        <div className="absolute bottom-4 right-4 text-[9px] font-black text-gray-300 uppercase tracking-widest pointer-events-none group-focus-within:opacity-0 transition-opacity">
                            Shift + Enter for new line
                        </div>
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim() || !isAuthenticated}
                        className="h-16 w-16 bg-primary-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-primary-500/20 hover:bg-primary-500 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0 transition-all"
                    >
                        <PaperAirplaneIcon className="h-7 w-7 -rotate-12 group-hover:rotate-0 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
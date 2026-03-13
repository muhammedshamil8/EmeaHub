import { useNavigate } from 'react-router-dom';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';

export default function FloatingAIBot() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[60] sm:bottom-10 sm:right-10 animate-in slide-in-from-bottom-10 duration-700">
            <button
                onClick={() => navigate('/ai/chat')}
                className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#ff006e] to-[#8338ec] rounded-2xl shadow-2xl shadow-pink-500/40 hover:scale-110 hover:-translate-y-1 active:scale-95 transition-all duration-300"
                aria-label="AI Assistant"
            >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse"></div>
                
                {/* Sparkles Icon */}
                <SparklesIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
                
                {/* Tooltip/Badge */}
                <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none hidden md:block">
                    <p className="text-xs font-black text-gray-900 dark:text-white whitespace-nowrap uppercase tracking-widest">
                        Ask AI Assistant
                    </p>
                </div>

                {/* Notification Dot */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white dark:border-gray-900 animate-bounce"></div>
            </button>
        </div>
    );
}

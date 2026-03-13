import { Link } from 'react-router-dom';
import { 
    ChatBubbleLeftRightIcon, 
    MagnifyingGlassIcon, 
    CalendarIcon, 
    DocumentTextIcon, 
    LightBulbIcon,
    ClockIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import { StaggerContainer, StaggerItem, FadeIn } from '../components/common/MotionContainer';

export default function AIHub() {
    const aiTools = [
        {
            name: 'Smart Chat',
            description: 'Chat with our AI about your subjects, notes, or college queries.',
            icon: ChatBubbleLeftRightIcon,
            href: '/ai/chat',
            color: 'from-blue-600 to-indigo-600',
            badge: 'Popular'
        },
        {
            name: 'Resource Search',
            description: 'Find elusive materials using natural language queries.',
            icon: MagnifyingGlassIcon,
            href: '/ai/search',
            color: 'from-purple-600 to-pink-600',
        },
        {
            name: 'Study Planner',
            description: 'Generate personalized study routines based on your exams.',
            icon: CalendarIcon,
            href: '/ai/planner',
            color: 'from-emerald-500 to-teal-600',
            badge: 'New'
        },
        {
            name: 'Smart Summarizer',
            description: 'Paste content or upload PDFs to get concise summaries.',
            icon: DocumentTextIcon,
            href: '/ai/summarize',
            color: 'from-orange-500 to-red-600',
        },
        {
            name: 'Recommendations',
            description: 'Get tailored material suggestions based on your profile.',
            icon: LightBulbIcon,
            href: '/ai/recommend',
            color: 'from-fuchsia-500 to-purple-600',
        },
        {
            name: 'Chat History',
            description: 'Review your past interactions and study plans.',
            icon: ClockIcon,
            href: '/ai/history',
            color: 'from-gray-600 to-gray-800',
        }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20 px-4">
            {/* Header section */}
            <FadeIn>
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-black text-xs uppercase tracking-widest shadow-sm">
                        <SparklesIcon className="h-4 w-4" />
                        <span>AI Ecosystem</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">
                        Intelligence at <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-pink-600">Your Fingertips</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                        A suite of powerful AI tools designed to supercharge your academic journey at EMEA College.
                    </p>
                </div>
            </FadeIn>

            {/* AI Tools Grid */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiTools.map((tool) => (
                    <StaggerItem key={tool.name}>
                        <Link
                            to={tool.href}
                            className="group relative flex flex-col h-full bg-white dark:bg-gray-800 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-700 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                        >
                            {/* Decorative background gradient */}
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tool.color} opacity-5 blur-3xl group-hover:opacity-20 transition-opacity duration-500`}></div>
                            
                            <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <tool.icon className="h-8 w-8" />
                            </div>

                            {tool.badge && (
                                <span className="absolute top-8 right-8 px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-primary-100 dark:border-primary-800/50">
                                    {tool.badge}
                                </span>
                            )}

                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 tracking-tight group-hover:text-primary-600 transition-colors uppercase">
                                {tool.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 font-medium text-sm leading-relaxed mb-8 flex-grow">
                                {tool.description}
                            </p>

                            <div className="flex items-center text-xs font-black tracking-widest text-primary-600 uppercase">
                                Explore Tool
                                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </Link>
                    </StaggerItem>
                ))}
            </StaggerContainer>

            {/* Bottom Info Card */}
            <FadeIn delay={0.5}>
                <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black dark:from-white dark:to-gray-100 p-10 sm:p-16 rounded-[3rem] text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-2xl sm:text-4xl font-black text-white dark:text-gray-900 tracking-tighter uppercase">
                            Privacy by Design
                        </h2>
                        <p className="text-gray-400 dark:text-gray-600 max-w-xl mx-auto font-medium text-lg leading-relaxed">
                            Your interactions are private and secure. AI tools are optimized specifically for the EMEAHub academic dataset.
                        </p>
                        <div className="inline-flex items-center px-6 py-3 border-2 border-white/20 dark:border-gray-900/20 rounded-full text-white dark:text-gray-900 font-black text-xs uppercase tracking-widest">
                            EMEAHub Intelligence Core v2.0
                        </div>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}

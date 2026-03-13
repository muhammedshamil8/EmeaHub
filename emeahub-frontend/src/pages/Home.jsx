import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resourceService } from '../services/resources';
import { 
    DocumentTextIcon, 
    AcademicCapIcon, 
    BookOpenIcon, 
    SparklesIcon,
    TrophyIcon,
    CloudArrowUpIcon,
    BellAlertIcon,
    ChatBubbleLeftEllipsisIcon,
    CameraIcon,
    PaperAirplaneIcon,
    MegaphoneIcon,
    ClockIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';
import { 
    DocumentTextIcon as DocumentTextSolid,
    AcademicCapIcon as AcademicCapSolid,
    BookOpenIcon as BookOpenSolid,
    SparklesIcon as SparklesSolid,
    TrophyIcon as TrophySolid,
    CloudArrowUpIcon as CloudArrowUpSolid
} from '@heroicons/react/24/solid';
import { StaggerContainer, StaggerItem, FadeIn } from '../components/common/MotionContainer';
import ResourceCard from '../components/resources/ResourceCard';

export default function Home() {
    const { isAuthenticated } = useAuth();
    const [latestResources, setLatestResources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLatestResources();
    }, []);

    const fetchLatestResources = async () => {
        try {
            const response = await resourceService.getResources({ sort: 'newest', limit: 3 });
            setLatestResources(response.data.data.slice(0, 3));
        } catch (error) {
            console.error('Failed to fetch latest resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const quickLinks = [
        {
            name: 'NOTES',
            href: '/resources?type=note&sort=popular',
            icon: DocumentTextSolid,
            bgColor: 'bg-[#d90429]', 
        },
        {
            name: 'SYLLABUS',
            href: '/syllabus',
            icon: AcademicCapSolid,
            bgColor: 'bg-[#ff006e]', 
        },
        {
            name: 'PYQs',
            href: '/resources?type=pyq&sort=popular',
            icon: BookOpenSolid,
            bgColor: 'bg-[#8338ec]', 
        },
        {
            name: 'AI CHAT',
            href: '/ai/chat',
            icon: SparklesSolid,
            bgColor: 'bg-[#3a86ff]', 
        },
        {
            name: 'TIME TABLE',
            href: '/timetable',
            icon: ClockIcon,
            bgColor: 'bg-[#fb5607]', 
        },
        {
            name: 'UPLOAD',
            href: '/upload',
            icon: CloudArrowUpSolid,
            bgColor: 'bg-[#ffb703]', 
        },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12 ">
            {/* Top Alerts Ticker */}
            <FadeIn>
                <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide flex-shrink-0 animate-pulse">
                        Alerts
                    </span>
                    <div className="overflow-hidden flex-grow relative h-5">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 absolute whitespace-nowrap animate-[marquee_15s_linear_infinite]">
                            EMEAHub v2 is Live! • Upload notes to earn points • New AI feature available!
                        </p>
                    </div>
                </div>
            </FadeIn>

            {/* Notification Banner */}
            <FadeIn delay={0.1}>
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900 to-fuchsia-700 shadow-lg p-6 sm:p-8 flex items-center justify-between group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
                    <div className="relative z-10 w-full sm:w-2/3 pr-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <MegaphoneIcon className="h-6 w-6 text-pink-500" />
                            <h2 className="text-2xl font-bold text-white tracking-wide uppercase">Notifications</h2>
                        </div>
                        <p className="text-purple-100 text-sm sm:text-base font-medium mb-4 leading-relaxed">
                            Instant notifications and study materials for EMEA College Students
                        </p>
                        <div className="flex items-center space-x-2">
                            <span className="bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Automated</span>
                            <span className="text-white/60 text-xs font-medium">www.emeahub.in</span>
                        </div>
                    </div>
                    <div className="hidden sm:block relative z-10 w-1/3 text-right">
                        <BellAlertIcon className="h-24 w-24 text-white/20 inline-block drop-shadow-2xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
                    </div>
                </div>
            </FadeIn>

            {/* Quick Actions Grid */}
            <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 py-2">
                {quickLinks.map((link) => (
                    <StaggerItem key={link.name}>
                        <Link
                            to={link.href}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 flex flex-col items-center justify-center space-y-3 sm:space-y-4 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
                        >
                            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white shadow-lg shadow-gray-200 dark:shadow-none group-hover:scale-110 transition-transform duration-300 ${link.bgColor}`}>
                                <link.icon className="h-7 w-7 sm:h-8 sm:w-8 drop-shadow-md" />
                            </div>
                            <span className="text-xs sm:text-sm font-extrabold text-gray-800 dark:text-gray-200 tracking-wider">
                                {link.name}
                            </span>
                        </Link>
                    </StaggerItem>
                ))}
            </StaggerContainer>

            {/* Latest Resources Section */}
            {!loading && latestResources.length > 0 && (
                <FadeIn delay={0.3}>
                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-6 px-1">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center tracking-tight">
                                <SparklesIcon className="h-6 w-6 text-yellow-500 mr-2" />
                                RECENTLY ADDED
                            </h2>
                            <Link to="/resources" className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center transition-colors">
                                View All <ArrowRightIcon className="h-4 w-4 ml-1" />
                            </Link>
                        </div>
                        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {latestResources.map((resource) => (
                                <StaggerItem key={resource.id}>
                                    <ResourceCard resource={resource} compact />
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    </div>
                </FadeIn>
            )}

            {/* Social Connect Banner */}
            <FadeIn delay={0.4}>
                <div className="bg-[#eafaea] dark:bg-emerald-950/30 rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100 dark:border-emerald-900/50 mt-4 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-4 border-b border-emerald-200/50 dark:border-emerald-800/50 pb-4">
                        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute"></div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 relative"></div>
                            <h3 className="font-black text-gray-900 dark:text-gray-200 tracking-wide text-sm sm:text-base uppercase">
                                EMEAHub Community
                            </h3>
                            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase ml-2">Live Update</span>
                        </div>
                    </div>
                    
                    <p className="text-xs sm:text-sm text-center font-bold text-gray-600 dark:text-gray-400 italic mb-6">
                        "Stay connected with the campus rhythm"
                    </p>

                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                        <a href="#" className="flex items-center justify-center space-x-1 sm:space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl py-3 transition-all hover:scale-105 shadow-lg shadow-emerald-500/20 group">
                            <ChatBubbleLeftEllipsisIcon className="w-5 h-5 group-hover:animate-bounce" />
                            <span className="text-xs sm:text-sm font-bold uppercase tracking-tighter">WhatsApp</span>
                        </a>
                        <a href="#" className="flex items-center justify-center space-x-1 sm:space-x-2 bg-pink-600 hover:bg-pink-700 text-white rounded-2xl py-3 transition-all hover:scale-105 shadow-lg shadow-pink-600/20 group">
                            <CameraIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            <span className="text-xs sm:text-sm font-bold uppercase tracking-tighter">Insta</span>
                        </a>
                        <a href="#" className="flex items-center justify-center space-x-1 sm:space-x-2 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl py-3 transition-all hover:scale-105 shadow-lg shadow-blue-500/20 group">
                            <PaperAirplaneIcon className="w-5 h-5 -rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            <span className="text-xs sm:text-sm font-bold uppercase tracking-tighter">Telegram</span>
                        </a>
                    </div>
                </div>
            </FadeIn>

            {/* Bottom CTA Block */}
            {!isAuthenticated && (
                <FadeIn delay={0.5}>
                    <div className="mt-8 bg-white dark:bg-gray-800 rounded-[2rem] p-8 sm:p-12 shadow-xl border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-primary-100 dark:bg-primary-900/20 rounded-full blur-3xl opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
                        
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4 relative z-10 tracking-tight uppercase">
                            Join the Community
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-lg mx-auto relative z-10 text-lg font-medium">
                            Upload resources, earn reputation points, and climb the leaderboard.
                        </p>
                        <Link
                            to="/register"
                            className="inline-flex justify-center items-center px-10 py-5 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-100 text-white dark:text-gray-900 font-black rounded-2xl shadow-2xl hover:scale-105 hover:shadow-primary-500/20 transition-all duration-300 relative z-10 uppercase tracking-widest text-sm"
                        >
                            Create Free Account
                        </Link>
                    </div>
                </FadeIn>
            )}
        </div>
    );
}
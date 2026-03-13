import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { gamificationService } from '../services/gamification';
import { resourceService } from '../services/resources';
import LoadingSpinner from '../components/common/LoadingSpinner';
import UserStats from '../components/gamification/UserStats';
import { 
    DocumentTextIcon, 
    ArrowDownTrayIcon,
    StarIcon,
    ClockIcon,
    CheckBadgeIcon,
    SparklesIcon,
    ArrowTrendingUpIcon,
    IdentificationIcon,
    FolderIcon
} from '@heroicons/react/24/outline';
import { StaggerContainer, StaggerItem, FadeIn } from '../components/common/MotionContainer';

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentUploads, setRecentUploads] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, uploadsRes, activityRes] = await Promise.all([
                gamificationService.getUserStats(),
                resourceService.getMyUploads(),
                gamificationService.getUserActivity()
            ]);

            console.log(statsRes.data.stats)
            
            setStats(statsRes.data.stats);
            setRecentUploads(uploadsRes.data.resources.slice(0, 5));
            setRecentActivity(activityRes.data.activity.slice(0, 5));
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    const quickActions = [
        {
            title: 'My Uploads',
            description: 'Manage files',
            icon: FolderIcon,
            link: '/my-uploads',
            color: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
        },
        {
            title: 'Resources',
            description: 'Find materials',
            icon: DocumentTextIcon,
            link: '/resources',
            color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
        },
        {
            title: 'Upload',
            description: 'Share notes',
            icon: ArrowDownTrayIcon,
            link: '/upload',
            color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
        },
        {
            title: 'AI Hub',
            description: 'Smart tools',
            icon: SparklesIcon,
            link: '/ai',
            color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
        }
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Premium Header */}
            <FadeIn>
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-600 to-indigo-700 p-8 md:p-12 text-white shadow-2xl shadow-primary-500/30">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-50"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mb-32 -mr-32 animate-pulse"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to={`/profile/${user.id}`}
                                    className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-primary-600 transition-all shadow-xl shadow-black/5"
                                >
                                    View Public Profile
                                </Link>
                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black tracking-widest uppercase">
                                    <IdentificationIcon className="h-4 w-4 mr-2" />
                                    User Session Active
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase drop-shadow-2xl">
                                Hello, <br />
                                <span className="text-primary-100">{user?.name.split(' ')[0]}!</span>
                            </h1>
                            <p className="text-lg text-primary-50 font-medium max-w-md opacity-90 drop-shadow-md">
                                Your academic dashboard is primed with the latest contributions and your personal stats.
                            </p>
                        </div>
                        <div className="flex-shrink-0 relative">
                           <div className="absolute inset-0 bg-white/20 rounded-[2.5rem] blur-2xl animate-pulse"></div>
                           <div className="relative w-24 h-24 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-2xl">
                               <SparklesIcon className="w-12 h-12 text-white" />
                           </div>
                        </div>
                    </div>
                </div>
            </FadeIn>

            {/* User Stats Section */}
            {stats && (
                <FadeIn delay={0.2}>
                    <UserStats stats={stats} />
                </FadeIn>
            )}

            {/* Quick Actions Grid */}
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {quickActions.map((action) => (
                    <StaggerItem key={action.title}>
                        <Link
                            to={action.link}
                            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col items-center text-center"
                        >
                            <div className={`inline-flex p-4 rounded-2xl ${action.color} mb-5 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                                <action.icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1 tracking-tight group-hover:text-primary-600 transition-colors uppercase">
                                {action.title}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">
                                {action.description}
                            </p>
                        </Link>
                    </StaggerItem>
                ))}
            </StaggerContainer>

            {/* Recent Activity & Uploads */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Uploads */}
                <FadeIn delay={0.4}>
                    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-700 shadow-xl h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center uppercase tracking-tight">
                                <DocumentTextIcon className="h-6 w-6 text-primary-500 mr-2" />
                                Recent Contributions
                            </h2>
                            <Link to="/my-uploads" className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline">Manage All</Link>
                        </div>
                        {recentUploads.length > 0 ? (
                            <div className="space-y-4">
                                {recentUploads.map((upload) => (
                                    <Link
                                        key={upload.id}
                                        to={`/resources/${upload.id}`}
                                        className="flex items-center p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-50 dark:border-gray-700/50 hover:shadow-lg hover:border-primary-300 transition-all duration-300 group"
                                    >
                                        <div className="flex-shrink-0 mr-4 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-primary-500 group-hover:scale-110 transition-transform">
                                            <DocumentTextIcon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-black text-gray-900 dark:text-white truncate uppercase tracking-tight">
                                                {upload.title}
                                            </h3>
                                            <div className="flex items-center text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">
                                                <span>{upload.type}</span>
                                                <span className="mx-2 opacity-30">•</span>
                                                <span>{upload.downloads || 0} Downloads</span>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 ml-4 flex flex-col items-end">
                                            {upload.status === 'verified' ? (
                                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                                                    Pending
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-3xl">
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No uploads detected</p>
                            </div>
                        )}
                    </div>
                </FadeIn>

                {/* Recent Activity */}
                <FadeIn delay={0.5}>
                    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-700 shadow-xl h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center uppercase tracking-tight">
                                <ArrowTrendingUpIcon className="h-6 w-6 text-emerald-500 mr-2" />
                                Activity Feed
                            </h2>
                            <Link to="/profile" className="text-xs font-black text-primary-600 uppercase tracking-widest">History</Link>
                        </div>
                        {recentActivity.length > 0 ? (
                            <div className="space-y-4">
                                {recentActivity.map((activity, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-5 border-b border-gray-50 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-2xl transition-colors duration-300 group"
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 group-hover:scale-150 transition-transform"></div>
                                            <div>
                                                <p className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-tight">
                                                    {activity.action}
                                                </p>
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
                                                    {activity.resource}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md mb-1">
                                                +{activity.points} pts
                                            </p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">
                                                {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-3xl">
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Quiet for now...</p>
                            </div>
                        )}
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
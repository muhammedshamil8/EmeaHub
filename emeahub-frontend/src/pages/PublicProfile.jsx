import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gamificationService } from '../services/gamification';
import { formatDate } from '../utils/helpers';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
    UserIcon, 
    AcademicCapIcon, 
    ChartBarIcon,
    CalendarIcon,
    CheckBadgeIcon,
    DocumentTextIcon,
    ArrowUpIcon
} from '@heroicons/react/24/outline';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/common/MotionContainer';

export default function PublicProfile() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await gamificationService.getPublicProfile(id);
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch public profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    if (loading) return <LoadingSpinner />;
    if (!data) return (
        <div className="text-center py-20">
            <h1 className="text-2xl font-black text-gray-400 uppercase tracking-widest">User not found</h1>
        </div>
    );

    const { user, stats, achievements, recent_uploads } = data;

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            {/* Premium Header */}
            <FadeIn>
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-gray-900 to-primary-900 p-8 md:p-12 text-white shadow-2xl border border-gray-800">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl -mt-32 -mr-32 animate-pulse"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-8 text-center md:text-left">
                        <div className="h-32 w-32 rounded-[2.5rem] bg-white/10 backdrop-blur-xl p-2 border border-white/20 shadow-2xl">
                            <div className="h-full w-full rounded-[2rem] bg-gradient-to-br from-primary-500 to-indigo-500 flex items-center justify-center text-white text-5xl font-black tracking-tighter">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        
                        <div className="flex-1 space-y-3">
                            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-600/50 text-[10px] font-black uppercase tracking-widest border border-primary-500/50">
                                <CheckBadgeIcon className="h-4 w-4 mr-2" />
                                {user.role === 'teacher' ? 'Faculty Member' : 'Scholar'}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
                                {user.name}
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <div className="flex items-center">
                                    <CalendarIcon className="h-4 w-4 mr-2" />
                                    Joined {formatDate(user.created_at)}
                                </div>
                                <div className="flex items-center">
                                    <AcademicCapIcon className="h-4 w-4 mr-2" />
                                    {user.department}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center md:items-end gap-2 bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-md">
                            <span className="text-4xl font-black italic tracking-tighter leading-none text-primary-400">
                                Rank #{stats.rank}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Community Ranking</span>
                        </div>
                    </div>
                </div>
            </FadeIn>

            {/* Stats Grid */}
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {[
                    { label: 'Reputation', value: stats.total_points, icon: ChartBarIcon, color: 'text-primary-500' },
                    { label: 'Uploads', value: user.total_uploads, icon: DocumentTextIcon, color: 'text-emerald-500' },
                    { label: 'Rank', value: stats.badge, icon: CheckBadgeIcon, color: 'text-amber-500' },
                    { label: 'Growth', value: '+12%', icon: ArrowUpIcon, color: 'text-indigo-500' }
                ].map((stat) => (
                    <StaggerItem key={stat.label}>
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 text-center">
                            <div className={`p-3 rounded-2xl bg-gray-50 dark:bg-gray-900 inline-block mb-3 ${stat.color}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">{stat.value}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    </StaggerItem>
                ))}
            </StaggerContainer>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Achievements Area */}
                <div className="lg:col-span-2 space-y-8">
                    <FadeIn delay={0.3}>
                        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-700 shadow-xl">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-8 flex items-center">
                                <CheckBadgeIcon className="h-6 w-6 mr-3 text-primary-500" />
                                Achieved Milestones
                            </h2>
                            {achievements.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {achievements.map((ach) => (
                                        <div key={ach.id} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-3xl border border-transparent hover:border-primary-300 transition-all text-center group">
                                            <div className="w-16 h-16 mx-auto bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                                {ach.icon || '🏅'}
                                            </div>
                                            <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-tight">{ach.name}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-3xl">
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No badges earned yet</p>
                                </div>
                            )}
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.4}>
                        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-700 shadow-xl">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-8">
                                Recent Contributions
                            </h2>
                            <div className="space-y-4">
                                {recent_uploads.map((upload) => (
                                    <Link 
                                        key={upload.id}
                                        to={`/resources/${upload.id}`}
                                        className="flex items-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-transparent hover:border-primary-300 transition-all group"
                                    >
                                        <div className="h-10 w-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-primary-500 mr-4 shadow-sm group-hover:scale-110 transition-transform">
                                            <DocumentTextIcon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-black text-gray-900 dark:text-white truncate uppercase tracking-tight">{upload.title}</h4>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{upload.subject?.name}</p>
                                        </div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase">
                                            {formatDate(upload.created_at)}
                                        </div>
                                    </Link>
                                ))}
                                {recent_uploads.length === 0 && (
                                    <p className="text-center py-10 text-gray-400 font-black uppercase tracking-widest text-xs">No public uploads yet</p>
                                )}
                            </div>
                        </div>
                    </FadeIn>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    <FadeIn delay={0.5}>
                        <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/5 pointer-events-none"></div>
                            <h2 className="text-lg font-black uppercase tracking-widest mb-6 px-1">Social Footprint</h2>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Verified Assets</span>
                                    <span className="text-xl font-black tracking-tighter italic">{stats.uploads}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Avg Strength</span>
                                    <span className="text-xl font-black tracking-tighter italic">92%</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Endorsements</span>
                                    <span className="text-xl font-black tracking-tighter italic">24</span>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
}

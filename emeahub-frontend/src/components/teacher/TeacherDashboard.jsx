import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resourceService } from '../../services/resources';
import { gamificationService } from '../../services/gamification';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
    ClockIcon, 
    CheckCircleIcon, 
    XCircleIcon,
    DocumentTextIcon,
    CalendarDaysIcon,
    RocketLaunchIcon,
    ArrowUpRightIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';

export default function TeacherDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [pendingCount, setPendingCount] = useState(0);
    const [recentVerifications, setRecentVerifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, pendingRes, verificationsRes] = await Promise.all([
                gamificationService.getTeacherStats(),
                resourceService.getPendingVerifications(),
                gamificationService.getTeacherContributions()
            ]);
            
            setStats(statsRes.data.stats);
            setPendingCount(pendingRes.data.total);
            setRecentVerifications(verificationsRes.data.verifications.slice(0, 5));
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-indigo-900 border border-white/10 shadow-2xl p-10 sm:p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/30 to-purple-600/30 backdrop-blur-3xl"></div>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/20">
                                Verified Educator
                            </span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
                            Welcome, Prof. {user?.name.split(' ')[0]}
                        </h1>
                        <p className="text-gray-300 text-lg font-medium max-w-xl leading-relaxed">
                            Your expertise helps thousands of students. You have <span className="text-white font-bold">{pendingCount} materials</span> awaiting verification today.
                        </p>
                    </div>
                    <Link 
                        to="/teacher/pending"
                        className="group relative flex items-center gap-3 px-8 py-4 bg-white text-indigo-900 font-black rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-primary-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <span className="relative z-10">Start Verifying</span>
                        <ArrowUpRightIcon className="relative z-10 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Contributions', value: stats?.total_uploads || 0, icon: DocumentTextIcon, color: 'from-blue-600 to-indigo-600', sub: 'Total Uploads' },
                    { label: 'Pending', value: pendingCount, icon: ClockIcon, color: 'from-amber-400 to-orange-500', sub: 'Action Required' },
                    { label: 'Verified', value: stats?.verified_count || 0, icon: CheckCircleIcon, color: 'from-emerald-500 to-teal-600', sub: 'Impact Made' },
                    { label: 'Rejected', value: stats?.rejected_count || 0, icon: XCircleIcon, color: 'from-red-500 to-rose-600', sub: 'Low Quality' }
                ].map((stat) => (
                    <div key={stat.label} className="group relative bg-white dark:bg-gray-800 rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700/50 overflow-hidden transition-all duration-500 hover:-translate-y-1">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-[0.03] group-hover:opacity-[0.08] rounded-bl-[3rem] transition-all`}></div>
                        <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg mb-6`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter mb-2">{stat.value}</p>
                        <p className="text-xs font-bold text-gray-400">{stat.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Secondary Actions */}
                <div className="lg:col-span-1 space-y-6">
                    <Link to="/teacher/timetable" className="block group relative bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700/50 shadow-xl overflow-hidden">
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="h-16 w-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                                <CalendarDaysIcon className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">Timetable</h3>
                                <p className="text-xs font-bold text-gray-500">Update your schedule</p>
                            </div>
                        </div>
                        <ArrowPathIcon className="absolute bottom-6 right-6 h-10 w-10 text-gray-50 dark:text-gray-800 group-hover:rotate-180 transition-transform duration-700" />
                    </Link>

                    <div className="bg-primary-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary-500/20 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/20"></div>
                        <RocketLaunchIcon className="absolute -bottom-4 -right-4 h-32 w-32 text-white/10 group-hover:-translate-y-4 group-hover:-translate-x-4 transition-transform duration-700" />
                        <h3 className="text-xl font-black mb-2 relative z-10">Upload Materials</h3>
                        <p className="text-primary-100 text-sm font-medium mb-6 relative z-10 leading-relaxed">Contribution points help you gain reputation in the community.</p>
                        <Link to="/upload" className="inline-flex h-12 items-center px-6 bg-white text-primary-600 font-black rounded-xl text-sm shadow-lg hover:shadow-xl transition-all relative z-10">
                            Upload Now
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700/50 shadow-xl overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-gray-50 dark:border-gray-700/50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <CheckCircleIcon className="h-6 w-6" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Recent Verifications</h2>
                        </div>
                    </div>
                    <div className="p-8 flex-1 overflow-y-auto max-h-[400px]">
                        {recentVerifications.length > 0 ? (
                            <div className="space-y-4">
                                {recentVerifications.map((verification) => (
                                    <div key={verification.id} className="flex items-center p-5 bg-gray-50/50 dark:bg-gray-900/30 rounded-3xl border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-all group">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${
                                            verification.action === 'approved' 
                                                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' 
                                                : 'bg-red-100 text-red-600 dark:bg-red-900/30'
                                        }`}>
                                            {verification.action === 'approved' ? <CheckCircleIcon className="h-6 w-6" /> : <XCircleIcon className="h-6 w-6" />}
                                        </div>
                                        <div className="ml-5 flex-1">
                                            <h3 className="text-sm font-black text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors">
                                                {verification.title}
                                            </h3>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                {verification.type} • {verification.time}
                                            </p>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] ${
                                            verification.action === 'approved' 
                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40' 
                                                : 'bg-red-50 text-red-700 dark:bg-red-900/40'
                                        }`}>
                                            {verification.action}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 opacity-30 grayscale">
                                <DocumentTextIcon className="h-20 w-20 mb-4" />
                                <p className="font-black uppercase tracking-[0.2em] text-sm">No activity found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
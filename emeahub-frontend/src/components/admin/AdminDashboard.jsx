import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import {
    UsersIcon,
    DocumentTextIcon,
    BuildingOfficeIcon,
    AcademicCapIcon,
    ArrowUpIcon,
    UserGroupIcon,
    ChartBarIcon,
    ClockIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { getInitials, formatDate } from '../../utils/helpers';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await API.get('/admin/dashboard');
            setStats(response.data.stats);
            setRecentActivity(response.data.recent);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    const statCards = [
        {
            title: 'Total Users',
            value: stats.total_users,
            icon: UsersIcon,
            color: 'from-blue-600 to-indigo-600',
            link: '/admin/users'
        },
        {
            title: 'Resources',
            value: stats.total_resources,
            icon: DocumentTextIcon,
            color: 'from-emerald-600 to-teal-600',
            link: '/admin/resources'
        },
        {
            title: 'Pending Approvals',
            value: stats.pending_teachers || 0,
            icon: ClockIcon,
            color: 'from-amber-500 to-orange-600',
            link: '/admin/users?status=pending'
        }
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 border border-white/10 shadow-2xl p-10 sm:p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/30 to-indigo-600/30 backdrop-blur-3xl"></div>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
                            Hello, {user?.name.split(' ')[0]} 👋
                        </h1>
                        <p className="text-gray-300 text-lg font-medium max-w-xl">
                            Welcome back to the EmeaHub Control Center. Here's a snapshot of the activity across your academic portal today.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Link 
                            to="/admin/resources"
                            className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white font-bold hover:bg-white/20 transition-all shadow-xl group"
                        >
                            <span className="flex items-center gap-2">
                                <DocumentTextIcon className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                                Manage Feed
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((card) => (
                    <Link
                        key={card.title}
                        to={card.link}
                        className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-[0.03] group-hover:opacity-[0.08] rounded-bl-[4rem] transition-all duration-500`}></div>
                        
                        <div className="relative z-10">
                            <div className={`w-14 h-14 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20 mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                <card.icon className="h-7 w-7" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 font-black text-xs uppercase tracking-[0.2em] mb-2">{card.title}</p>
                            <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{card.value}</p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Users Section */}
                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700/50 shadow-xl overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-gray-50 dark:border-gray-700/50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <UserGroupIcon className="h-6 w-6" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Recent Users</h2>
                        </div>
                        <Link to="/admin/users" className="text-sm font-bold text-primary-600 hover:text-primary-500">View All</Link>
                    </div>
                    <div className="p-4 sm:p-6 space-y-4">
                        {recentActivity.new_users?.map((user) => (
                            <div key={user.id} className="flex items-center p-4 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 font-black text-xs">
                                    {getInitials(user.name)}
                                </div>
                                <div className="ml-4 flex-1">
                                    <h3 className="text-sm font-black text-gray-900 dark:text-white">{user.name}</h3>
                                    <p className="text-xs font-medium text-gray-500">{user.email}</p>
                                </div>
                                <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-500 shadow-sm border border-gray-100 dark:border-gray-700">
                                    {user.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700/50 shadow-xl overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-gray-50 dark:border-gray-700/50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <ClockIcon className="h-6 w-6" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Recent Activity</h2>
                        </div>
                    </div>
                    <div className="p-4 sm:p-6 space-y-4">
                        {recentActivity.new_resources?.map((resource) => (
                            <div key={resource.id} className="flex items-start p-4 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl transition-all">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-500 flex items-center justify-center text-white/50 font-black text-[10px]">
                                    NEW
                                </div>
                                <div className="ml-4 flex-1">
                                    <h3 className="text-sm font-black text-gray-900 dark:text-white leading-tight mb-1">{resource.title}</h3>
                                    <p className="text-xs font-medium text-gray-500">
                                        Uploaded by <span className="font-bold text-gray-700 dark:text-gray-300">{resource.uploader}</span>
                                    </p>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter ${
                                    resource.status === 'verified' 
                                        ? 'bg-emerald-100 text-emerald-700' 
                                        : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {resource.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
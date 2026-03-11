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
    ClockIcon 
} from '@heroicons/react/24/outline';

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
            title: 'Browse Resources',
            description: 'Find study materials',
            icon: DocumentTextIcon,
            link: '/resources',
            color: 'bg-blue-100 text-blue-600'
        },
        {
            title: 'Upload Resource',
            description: 'Share your materials',
            icon: ArrowDownTrayIcon,
            link: '/upload',
            color: 'bg-green-100 text-green-600'
        },
        {
            title: 'View Leaderboard',
            description: 'See top contributors',
            icon: StarIcon,
            link: '/leaderboard',
            color: 'bg-yellow-100 text-yellow-600'
        },
        {
            title: 'My Profile',
            description: 'View your stats',
            icon: ClockIcon,
            link: '/profile',
            color: 'bg-purple-100 text-purple-600'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-purple-600 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-primary-500/20 relative overflow-hidden backdrop-blur-lg">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-white/5 to-transparent"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">
                        Welcome back, {user?.name}!
                    </h1>
                    <p className="text-lg text-primary-50 font-medium max-w-2xl">
                        Here's what's happening with your account today.
                    </p>
                </div>
            </div>

            {/* User Stats */}
            {stats && <UserStats stats={stats} />}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                    <Link
                        key={action.title}
                        to={action.link}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                    >
                        <div className={`inline-flex p-4 rounded-xl ${action.color} mb-5 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                            <action.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                            {action.description}
                        </p>
                    </Link>
                ))}
            </div>

            {/* Recent Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Uploads */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-xl">
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
                        Recent Uploads
                    </h2>
                    {recentUploads.length > 0 ? (
                        <div className="space-y-3">
                            {recentUploads.map((upload) => (
                                <Link
                                    key={upload.id}
                                    to={`/resources/${upload.id}`}
                                    className="block p-4 border border-gray-100 dark:border-gray-700/50 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 group"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                {upload.title}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {upload.type} • {upload.downloads} downloads
                                            </p>
                                        </div>
                                        <span className={`badge ${
                                            upload.status === 'verified' 
                                                ? 'badge-success' 
                                                : 'badge-warning'
                                        }`}>
                                            {upload.status}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">
                            No uploads yet
                        </p>
                    )}
                    <Link
                        to="/upload"
                        className="mt-4 inline-block text-primary-600 hover:text-primary-700 font-medium"
                    >
                        Upload New Resource →
                    </Link>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-xl">
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
                        Recent Activity
                    </h2>
                    {recentActivity.length > 0 ? (
                        <div className="space-y-3">
                            {recentActivity.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700/50 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-300"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {activity.action}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {activity.resource}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">
                                            {activity.time}
                                        </p>
                                        <p className="text-xs text-green-600">
                                            +{activity.points} points
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">
                            No recent activity
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
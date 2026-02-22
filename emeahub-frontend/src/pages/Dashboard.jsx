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
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">
                    Welcome back, {user?.name}!
                </h1>
                <p className="opacity-90">
                    Here's what's happening with your account today.
                </p>
            </div>

            {/* User Stats */}
            {stats && <UserStats stats={stats} />}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                    <Link
                        key={action.title}
                        to={action.link}
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
                    >
                        <div className={`inline-flex p-3 rounded-lg ${action.color} mb-4`}>
                            <action.icon className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {action.description}
                        </p>
                    </Link>
                ))}
            </div>

            {/* Recent Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Uploads */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        Recent Uploads
                    </h2>
                    {recentUploads.length > 0 ? (
                        <div className="space-y-3">
                            {recentUploads.map((upload) => (
                                <Link
                                    key={upload.id}
                                    to={`/resources/${upload.id}`}
                                    className="block p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">
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
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        Recent Activity
                    </h2>
                    {recentActivity.length > 0 ? (
                        <div className="space-y-3">
                            {recentActivity.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
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
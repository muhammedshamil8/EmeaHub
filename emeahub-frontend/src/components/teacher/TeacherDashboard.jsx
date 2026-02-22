import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resourceService } from '../../services/resources';
import { gamificationService } from '../../services/gamification';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
    ClockIcon, 
    CheckCircleIcon, 
    XCircleIcon,
    DocumentTextIcon 
} from '@heroicons/react/24/outline';

export default function TeacherDashboard() {
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
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">Teacher Dashboard</h1>
                <p className="opacity-90">Manage your teaching materials and verifications</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Uploads</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats?.total_uploads}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <ClockIcon className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Verified</p>
                            <p className="text-2xl font-bold text-green-600">{stats?.verified_count}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <CheckCircleIcon className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
                            <p className="text-2xl font-bold text-red-600">{stats?.rejected_count}</p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-full">
                            <XCircleIcon className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                    to="/teacher/pending"
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Pending Verifications
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {pendingCount} resources waiting for your review
                    </p>
                    <span className="text-primary-600 hover:text-primary-700">View Pending →</span>
                </Link>

                <Link
                    to="/teacher/timetable"
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Manage Timetable
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Update your class schedules
                    </p>
                    <span className="text-primary-600 hover:text-primary-700">Edit Timetable →</span>
                </Link>
            </div>

            {/* Recent Verifications */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Recent Verifications
                </h2>
                {recentVerifications.length > 0 ? (
                    <div className="space-y-3">
                        {recentVerifications.map((verification) => (
                            <div
                                key={verification.id}
                                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                            >
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {verification.title}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {verification.type} • {verification.time}
                                    </p>
                                </div>
                                <span className={`badge ${
                                    verification.action === 'approved' 
                                        ? 'badge-success' 
                                        : 'badge-error'
                                }`}>
                                    {verification.action}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">No recent verifications</p>
                )}
            </div>
        </div>
    );
}
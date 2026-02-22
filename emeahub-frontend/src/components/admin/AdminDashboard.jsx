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
    UserGroupIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
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
            color: 'bg-blue-100 text-blue-600',
            link: '/admin/users'
        },
        {
            title: 'Students',
            value: stats.total_students,
            icon: AcademicCapIcon,
            color: 'bg-green-100 text-green-600',
            link: '/admin/users?role=student'
        },
        {
            title: 'Teachers',
            value: stats.total_teachers,
            icon: UserGroupIcon,
            color: 'bg-purple-100 text-purple-600',
            link: '/admin/users?role=teacher'
        },
        {
            title: 'Resources',
            value: stats.total_resources,
            icon: DocumentTextIcon,
            color: 'bg-yellow-100 text-yellow-600',
            link: '/admin/resources'
        },
        {
            title: 'Departments',
            value: stats.total_departments,
            icon: BuildingOfficeIcon,
            color: 'bg-pink-100 text-pink-600',
            link: '/admin/departments'
        },
        {
            title: 'Pending Teachers',
            value: stats.pending_teachers,
            icon: UsersIcon,
            color: 'bg-orange-100 text-orange-600',
            link: '/admin/users?status=pending'
        }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {statCards.map((card) => (
                    <Link
                        key={card.title}
                        to={card.link}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    {card.title}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {card.value}
                                </p>
                            </div>
                            <div className={`p-3 rounded-lg ${card.color}`}>
                                <card.icon className="h-6 w-6" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* New Users */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        New Users
                    </h2>
                    <div className="space-y-4">
                        {recentActivity.new_users?.map((user) => (
                            <div key={user.id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                                        <span className="text-primary-600 font-semibold">
                                            {user.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {user.name}
                                        </p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500">{user.role}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* New Resources */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        New Resources
                    </h2>
                    <div className="space-y-4">
                        {recentActivity.new_resources?.map((resource) => (
                            <div key={resource.id} className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {resource.title}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        by {resource.uploader} • {resource.type}
                                    </p>
                                </div>
                                <span className={`badge ${
                                    resource.status === 'verified' 
                                        ? 'badge-success' 
                                        : 'badge-warning'
                                }`}>
                                    {resource.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Link
                    to="/admin/users"
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center space-x-3 hover:shadow-lg transition-shadow"
                >
                    <UsersIcon className="h-6 w-6 text-primary-600" />
                    <span className="font-medium text-gray-900 dark:text-white">
                        Manage Users
                    </span>
                </Link>
                <Link
                    to="/admin/resources"
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center space-x-3 hover:shadow-lg transition-shadow"
                >
                    <DocumentTextIcon className="h-6 w-6 text-primary-600" />
                    <span className="font-medium text-gray-900 dark:text-white">
                        Manage Resources
                    </span>
                </Link>
                <Link
                    to="/admin/departments"
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center space-x-3 hover:shadow-lg transition-shadow"
                >
                    <BuildingOfficeIcon className="h-6 w-6 text-primary-600" />
                    <span className="font-medium text-gray-900 dark:text-white">
                        Departments
                    </span>
                </Link>
                <Link
                    to="/admin/reports"
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center space-x-3 hover:shadow-lg transition-shadow"
                >
                    <DocumentTextIcon className="h-6 w-6 text-primary-600" />
                    <span className="font-medium text-gray-900 dark:text-white">
                        Reports
                    </span>
                </Link>
            </div>
        </div>
    );
}
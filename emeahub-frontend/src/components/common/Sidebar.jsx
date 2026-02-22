import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    HomeIcon,
    DocumentTextIcon,
    CloudArrowUpIcon,
    TrophyIcon,
    UserGroupIcon,
    ChartBarIcon,
    ClockIcon,
    CheckBadgeIcon,
    BuildingOfficeIcon,
    UsersIcon
} from '@heroicons/react/24/outline';

export default function Sidebar() {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    const publicLinks = [
        { name: 'Home', href: '/', icon: HomeIcon },
        { name: 'Resources', href: '/resources', icon: DocumentTextIcon },
        { name: 'Leaderboard', href: '/leaderboard', icon: TrophyIcon },
    ];

    const studentLinks = [
        { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
        { name: 'My Uploads', href: '/my-uploads', icon: CloudArrowUpIcon },
        { name: 'Download History', href: '/downloads', icon: ClockIcon },
        { name: 'Achievements', href: '/achievements', icon: CheckBadgeIcon },
    ];

    const teacherLinks = [
        { name: 'Teacher Dashboard', href: '/teacher/dashboard', icon: ChartBarIcon },
        { name: 'Pending Verifications', href: '/teacher/pending', icon: ClockIcon },
        { name: 'My Uploads', href: '/my-uploads', icon: CloudArrowUpIcon },
        { name: 'Manage Timetable', href: '/teacher/timetable', icon: BuildingOfficeIcon },
        { name: 'My Stats', href: '/teacher/stats', icon: TrophyIcon },
    ];

    const adminLinks = [
        { name: 'Admin Dashboard', href: '/admin/dashboard', icon: ChartBarIcon },
        { name: 'User Management', href: '/admin/users', icon: UsersIcon },
        { name: 'Resource Management', href: '/admin/resources', icon: DocumentTextIcon },
        { name: 'Departments', href: '/admin/departments', icon: BuildingOfficeIcon },
        { name: 'Reports', href: '/admin/reports', icon: CheckBadgeIcon },
    ];

    const isActive = (href) => location.pathname === href;

    const renderLink = (link) => (
        <Link
            key={link.name}
            to={link.href}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(link.href)
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
        >
            <link.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{link.name}</span>
        </Link>
    );

    return (
        <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
            <nav className="p-4 space-y-6">
                {/* Public Links */}
                <div className="space-y-1">
                    <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Public
                    </h3>
                    {publicLinks.map(renderLink)}
                </div>

                {/* Authenticated Links */}
                {isAuthenticated && (
                    <>
                        {/* Student Links */}
                        {user?.role === 'student' && (
                            <div className="space-y-1 pt-4 border-t border-gray-200 dark:border-gray-800">
                                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Student
                                </h3>
                                {studentLinks.map(renderLink)}
                            </div>
                        )}

                        {/* Teacher Links */}
                        {user?.role === 'teacher' && (
                            <div className="space-y-1 pt-4 border-t border-gray-200 dark:border-gray-800">
                                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Teacher
                                </h3>
                                {teacherLinks.map(renderLink)}
                            </div>
                        )}

                        {/* Admin Links */}
                        {user?.role === 'admin' && (
                            <div className="space-y-1 pt-4 border-t border-gray-200 dark:border-gray-800">
                                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Admin
                                </h3>
                                {adminLinks.map(renderLink)}
                            </div>
                        )}

                        {/* Common Links for All Users */}
                        <div className="space-y-1 pt-4 border-t border-gray-200 dark:border-gray-800">
                            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Common
                            </h3>
                            <Link
                                to="/profile"
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive('/profile')
                                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                                }`}
                            >
                                <UserGroupIcon className="h-5 w-5" />
                                <span className="text-sm font-medium">Profile</span>
                            </Link>
                        </div>
                    </>
                )}
            </nav>
        </aside>
    );
}
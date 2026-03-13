import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
    HomeIcon, 
    UsersIcon, 
    DocumentTextIcon, 
    BuildingOfficeIcon, 
    ClipboardDocumentCheckIcon,
    CalendarDaysIcon,
    ChartBarIcon,
    ChevronLeftIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout({ role }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { user } = useAuth();

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const adminNavigation = [
        { name: 'Overview', href: '/admin/dashboard', icon: HomeIcon },
        { name: 'User Management', href: '/admin/users', icon: UsersIcon },
        { name: 'Resources', href: '/admin/resources', icon: DocumentTextIcon },
        { name: 'Departments', href: '/admin/departments', icon: BuildingOfficeIcon },
        { name: 'Subjects', href: '/admin/subjects', icon: ClipboardDocumentCheckIcon },
        { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    ];

    const teacherNavigation = [
        { name: 'Dashboard', href: '/teacher/dashboard', icon: HomeIcon },
        { name: 'Pending Verifications', href: '/teacher/pending', icon: ClipboardDocumentCheckIcon },
        { name: 'Timetable Manager', href: '/teacher/timetable', icon: CalendarDaysIcon },
        { name: 'Upload Resource', href: '/upload', icon: DocumentTextIcon },
    ];

    const navigation = role === 'admin' ? adminNavigation : teacherNavigation;

    return (
        <div className="min-h-screen flex">
            {/* bg-gray-50 dark:bg-gray-900  */}
            {/* Sidebar for Desktop */}
            <aside 
                className={`fixed inset-y-0 left-0 z-40 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${
                    isSidebarOpen ? 'w-64' : 'w-20'
                } hidden lg:block`}
            >
                <div className="h-full flex flex-col">
                    <div className="p-6 flex items-center justify-between">
                        {isSidebarOpen ? (
                            <span className="text-xl mt-16 text-center mx-auto font-black text-primary-600 dark:text-primary-400 tracking-tighter">
                                {role.toUpperCase()} PANEL
                            </span>
                        ) : (
                            <span className="text-xl font-black text-primary-600 dark:text-primary-400 mx-auto">
                                E
                            </span>
                        )}
                    </div>

                    <nav className="flex-1 px-4 space-y-2 mt-4">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                className={({ isActive }) => `
                                    flex items-center p-3 rounded-2xl transition-all duration-300 group
                                    ${isActive 
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-primary-600 dark:hover:text-primary-400'
                                    }
                                `}
                            >
                                <item.icon className={`h-6 w-6 shrink-0 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                                {isSidebarOpen && <span className="font-bold text-sm">{item.name}</span>}
                                {!isSidebarOpen && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                                        {item.name}
                                    </div>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="w-full flex items-center justify-center p-3 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-colors"
                        >
                            <ChevronLeftIcon className={`h-6 w-6 transition-transform duration-300 ${!isSidebarOpen ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-gray-600/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
                        <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
                            <span className="text-xl font-black text-primary-600 tracking-tighter uppercase">{role}</span>
                            <button onClick={() => setIsMobileMenuOpen(false)}>
                                <XMarkIcon className="h-6 w-6 text-gray-500" />
                            </button>
                        </div>
                        <nav className="flex-1 p-4 space-y-2">
                            {navigation.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.href}
                                    className={({ isActive }) => `
                                        flex items-center p-3 rounded-2xl font-bold text-sm
                                        ${isActive 
                                            ? 'bg-primary-600 text-white shadow-lg' 
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                        }
                                    `}
                                >
                                    <item.icon className="h-6 w-6 mr-3" />
                                    {item.name}
                                </NavLink>
                            ))}
                        </nav>
                    </aside>
                </div>
            )}

            {/* Main Content Area */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
                {/* Topbar for Mobile */}
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-4 py-4 lg:hidden">
                    <div className="flex items-center justify-between">
                        <button onClick={() => setIsMobileMenuOpen(true)}>
                            <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        </button>
                        <span className="font-black text-primary-600 dark:text-primary-400 text-lg tracking-tighter">EMEA HUB</span>
                        <div className="w-6"></div> {/* Spacer */}
                    </div>
                </header>

                <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

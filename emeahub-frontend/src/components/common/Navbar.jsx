import { Fragment, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Transition, Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, SparklesIcon, ChevronDownIcon, PlayIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
    { name: 'Home', href: '/', public: true },
    { name: 'Resources', href: '/resources', public: true },
    { 
        name: 'Academic Hub', 
        public: true,
        children: [
            { name: 'Timetable', href: '/timetable' },
            { name: 'Syllabus', href: '/syllabus' },
            { name: 'Analytics', href: '/analytics' },
            { name: 'Leaderboard', href: '/leaderboard' },
            { name: 'Achievements', href: '/achievements' },
        ]
    },
    { 
        name: 'AI Ecosystem', 
        href: '/ai',
        public: true,
        highlight: true
    },
    { name: 'About', href: '/about', public: true },
];

const userNavigation = [
    { name: 'Dashboard', href: '/dashboard', roles: ['student', 'teacher', 'admin'] },
    { name: 'Upload', href: '/upload', roles: ['student', 'teacher', 'admin'] },
    { name: 'My Bookmarks', href: '/bookmarks', roles: ['student', 'teacher', 'admin'] },
    { name: 'Teacher Portal', href: '/teacher/dashboard', roles: ['teacher', 'admin'] },
    { name: 'Admin Portal', href: '/admin/dashboard', roles: ['admin'] },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const filteredNav = navigation.filter(item => item.public);
    const filteredUserNav = userNavigation.filter(item => 
        item.roles.includes(user?.role)
    );

    const isActive = (path) => location.pathname === path;

    return (
        <Disclosure as="nav" className={classNames(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
            scrolled 
                ? "py-2" 
                : "py-4"
        )}>
            {({ open }) => (
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className={classNames(
                        "relative flex h-16 items-center justify-between rounded-[2rem] px-6 transition-all duration-500 border border-transparent",
                        scrolled 
                            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-gray-100 dark:border-gray-800" 
                            : "bg-transparent"
                    )}>
                        {/* Logo */}
                        <div className="flex flex-shrink-0 items-center">
                            <Link to="/" className="flex items-center group">
                                <span className="text-2xl font-black tracking-tighter text-primary-600 dark:text-primary-400 group-hover:scale-105 transition-transform">
                                    EMEA<span className="text-gray-900 dark:text-white">Hub</span>
                                </span>
                                <div className="ml-2 w-2 h-2 rounded-full bg-primary-600 animate-pulse"></div>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex lg:items-center lg:space-x-1">
                            {filteredNav.map((item) => (
                                item.children ? (
                                    <Menu as="div" key={item.name} className="relative">
                                        <Menu.Button className={classNames(
                                            "inline-flex items-center px-4 py-2 text-xs font-black uppercase tracking-widest transition-all duration-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 group",
                                            item.children.some(c => isActive(c.href)) ? "text-primary-600" : "text-gray-500 dark:text-gray-400"
                                        )}>
                                            {item.name}
                                            <ChevronDownIcon className="ml-1.5 h-3 w-3 group-hover:rotate-180 transition-transform" />
                                        </Menu.Button>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-200"
                                            enterFrom="transform opacity-0 scale-95 -translate-y-2"
                                            enterTo="transform opacity-100 scale-100 translate-y-0"
                                            leave="transition ease-in duration-150"
                                            leaveFrom="transform opacity-100 scale-100 translate-y-0"
                                            leaveTo="transform opacity-0 scale-95 -translate-y-2"
                                        >
                                            <Menu.Items className="absolute left-0 mt-3 w-56 origin-top-left rounded-[2rem] bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl py-3 shadow-2xl ring-1 ring-black/5 focus:outline-none border border-gray-100 dark:border-gray-800">
                                                {item.children.map((child) => (
                                                    <Menu.Item key={child.name}>
                                                        {({ active }) => (
                                                            <Link
                                                                to={child.href}
                                                                className={classNames(
                                                                    active ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-gray-600 dark:text-gray-400',
                                                                    'flex items-center px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-colors mx-2 rounded-2xl'
                                                                )}
                                                            >
                                                                <PlayIcon className={classNames(
                                                                    "h-2.5 w-2.5 mr-3 transition-transform",
                                                                    active ? "translate-x-1" : "opacity-0"
                                                                )} />
                                                                {child.name}
                                                            </Link>
                                                        )}
                                                    </Menu.Item>
                                                ))}
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                ) : (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className="relative group px-4 py-2"
                                    >
                                        <span className={classNames(
                                            "relative z-10 text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
                                            isActive(item.href) ? "text-primary-600" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                        )}>
                                            {item.name}
                                        </span>
                                        {isActive(item.href) && (
                                            <motion.div 
                                                layoutId="navbar-indicator"
                                                className="absolute inset-0 bg-primary-50 dark:bg-primary-900/20 rounded-xl -z-0"
                                                transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                                            />
                                        )}
                                        {item.highlight && !isActive(item.href) && (
                                            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary-500 rounded-full animate-ping"></div>
                                        )}
                                    </Link>
                                )
                            ))}
                        </div>

                        {/* Right Actions */}
                        <div className="hidden lg:flex lg:items-center lg:space-x-4">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-primary-600 transition-all duration-300 border border-gray-100 dark:border-gray-700"
                            >
                                {theme === 'dark' ? '🌞' : '🌙'}
                            </button>

                            {isAuthenticated ? (
                                <Menu as="div" className="relative ml-2">
                                    <Menu.Button className="flex items-center group bg-gray-50 dark:bg-gray-800 rounded-2xl p-1 pr-4 border border-gray-100 dark:border-gray-700 hover:border-primary-300 transition-colors">
                                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-700 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-primary-500/20">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="ml-3 text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest hidden xl:block">
                                            Account
                                        </span>
                                        <ChevronDownIcon className="ml-2 h-3 w-3 text-gray-400 group-hover:rotate-180 transition-transform" />
                                    </Menu.Button>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 mt-3 w-56 origin-top-right rounded-[2rem] bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl py-3 shadow-2xl border border-gray-100 dark:border-gray-800 group">
                                            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 mb-2">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Session</p>
                                                <p className="text-xs font-black text-gray-900 dark:text-white truncate mt-1">{user?.name}</p>
                                            </div>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link to="/profile" className={classNames(
                                                        active ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-gray-600 dark:text-gray-400',
                                                        'flex items-center px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-colors mx-2 rounded-2xl'
                                                    )}>Profile</Link>
                                                )}
                                            </Menu.Item>
                                            {filteredUserNav.map((item) => (
                                                <Menu.Item key={item.name}>
                                                    {({ active }) => (
                                                        <Link to={item.href} className={classNames(
                                                            active ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-gray-600 dark:text-gray-400',
                                                            'flex items-center px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-colors mx-2 rounded-2xl'
                                                        )}>{item.name}</Link>
                                                    )}
                                                </Menu.Item>
                                            ))}
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={handleLogout}
                                                        className={classNames(
                                                            active ? 'bg-red-50 dark:bg-red-900/10 text-red-600' : 'text-red-500',
                                                            'flex w-full items-center px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-colors mx-2 rounded-2xl text-left'
                                                        )}
                                                    >
                                                        Sign out
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Link
                                        to="/login"
                                        className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary-600 px-4 py-2 transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-primary-600 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-500 shadow-lg shadow-primary-500/20 transition-all hover:scale-105 active:scale-95"
                                    >
                                        Join Hub
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex lg:hidden items-center space-x-3">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500"
                            >
                                {theme === 'dark' ? '🌞' : '🌙'}
                            </button>
                            <Disclosure.Button className="inline-flex items-center justify-center rounded-2xl p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none ring-1 ring-gray-100 dark:ring-gray-800">
                                <span className="sr-only">Open main menu</span>
                                {open ? (
                                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                ) : (
                                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                )}
                            </Disclosure.Button>
                        </div>
                    </div>

                    {/* Mobile Menu Panel */}
                    <AnimatePresence>
                        {open && (
                            <Disclosure.Panel static as={motion.div}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="lg:hidden mt-4 bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-y-auto max-h-[80vh] scrollbar-hide"
                            >
                                <div className="p-6 space-y-2">
                                    {filteredNav.map((item) => (
                                        item.children ? (
                                            <div key={item.name} className="space-y-1 py-2 border-b border-gray-50 dark:border-gray-800">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-4">{item.name}</p>
                                                {item.children.map((child) => (
                                                    <Disclosure.Button
                                                        key={child.name}
                                                        as={Link}
                                                        to={child.href}
                                                        className={classNames(
                                                            isActive(child.href) ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-gray-600 dark:text-gray-400',
                                                            'block px-4 py-3 text-xs font-black uppercase tracking-widest rounded-2xl transition-colors'
                                                        )}
                                                    >
                                                        {child.name}
                                                    </Disclosure.Button>
                                                ))}
                                            </div>
                                        ) : (
                                            <Disclosure.Button
                                                key={item.name}
                                                as={Link}
                                                to={item.href}
                                                className={classNames(
                                                    isActive(item.href) ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-gray-600 dark:text-gray-300',
                                                    'block px-4 py-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-colors'
                                                )}
                                            >
                                                {item.name}
                                            </Disclosure.Button>
                                        )
                                    ))}
                                </div>

                                {isAuthenticated ? (
                                    <div className="bg-gray-50 dark:bg-gray-850 p-6 space-y-6">
                                        <div className="flex items-center">
                                            <div className="h-12 w-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white font-black text-sm">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{user?.name}</div>
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{user?.email}</div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            {filteredUserNav.map((item) => (
                                                <Disclosure.Button
                                                    key={item.name}
                                                    as={Link}
                                                    to={item.href}
                                                    className="block px-4 py-3 text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800"
                                                >
                                                    {item.name}
                                                </Disclosure.Button>
                                            ))}
                                            <Disclosure.Button
                                                as="button"
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-3 text-xs font-black text-red-600 uppercase tracking-widest rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                Sign out
                                            </Disclosure.Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6 grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800">
                                        <Link to="/login" className="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-300">Login</Link>
                                        <Link to="/register" className="flex items-center justify-center p-4 bg-primary-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white">Join</Link>
                                    </div>
                                )}
                            </Disclosure.Panel>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </Disclosure>
    );
}
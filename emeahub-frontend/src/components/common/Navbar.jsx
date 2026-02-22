import { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navigation = [
    { name: 'Home', href: '/', public: true },
    { name: 'Resources', href: '/resources', public: true },
    { name: 'Leaderboard', href: '/leaderboard', public: true },
    { name: 'Achievements', href: '/achievements', public: true },
    { name: 'About', href: '/about', public: true },
];

const userNavigation = [
    { name: 'Dashboard', href: '/dashboard', roles: ['student', 'teacher', 'admin'] },
    { name: 'Upload', href: '/upload', roles: ['student', 'teacher', 'admin'] },
    { name: 'Teacher Panel', href: '/teacher/dashboard', roles: ['teacher', 'admin'] },
    { name: 'Admin Panel', href: '/admin/dashboard', roles: ['admin'] },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const filteredNav = navigation.filter(item => item.public);
    
    const filteredUserNav = userNavigation.filter(item => 
        item.roles.includes(user?.role)
    );

    return (
        <Disclosure as="nav" className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex">
                                <Link to="/" className="flex flex-shrink-0 items-center">
                                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                        EMEAHub
                                    </span>
                                </Link>
                                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                    {filteredNav.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                                {/* Theme Toggle */}
                                <button
                                    onClick={toggleTheme}
                                    className="rounded-full bg-gray-100 p-1 text-gray-400 hover:text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                                >
                                    <span className="sr-only">Toggle theme</span>
                                    {theme === 'dark' ? '🌞' : '🌙'}
                                </button>

                                {isAuthenticated ? (
                                    <Menu as="div" className="relative ml-3">
                                        <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                                            <span className="sr-only">Open user menu</span>
                                            <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </div>
                                        </Menu.Button>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-200"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <Link
                                                            to="/profile"
                                                            className={classNames(
                                                                active ? 'bg-gray-100 dark:bg-gray-700' : '',
                                                                'block px-4 py-2 text-sm text-gray-700 dark:text-gray-300'
                                                            )}
                                                        >
                                                            Your Profile
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                                {filteredUserNav.map((item) => (
                                                    <Menu.Item key={item.name}>
                                                        {({ active }) => (
                                                            <Link
                                                                to={item.href}
                                                                className={classNames(
                                                                    active ? 'bg-gray-100 dark:bg-gray-700' : '',
                                                                    'block px-4 py-2 text-sm text-gray-700 dark:text-gray-300'
                                                                )}
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        )}
                                                    </Menu.Item>
                                                ))}
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button
                                                            onClick={handleLogout}
                                                            className={classNames(
                                                                active ? 'bg-gray-100 dark:bg-gray-700' : '',
                                                                'block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400'
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
                                    <div className="space-x-4">
                                        <Link
                                            to="/login"
                                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 px-3 py-2 text-sm font-medium"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div className="-mr-2 flex items-center sm:hidden">
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className="sm:hidden">
                        <div className="space-y-1 pb-3 pt-2">
                            {filteredNav.map((item) => (
                                <Disclosure.Button
                                    key={item.name}
                                    as={Link}
                                    to={item.href}
                                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800"
                                >
                                    {item.name}
                                </Disclosure.Button>
                            ))}
                        </div>
                        {isAuthenticated && (
                            <div className="border-t border-gray-200 pb-3 pt-4 dark:border-gray-700">
                                <div className="flex items-center px-4">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                            {user?.name}
                                        </div>
                                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {user?.email}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 space-y-1">
                                    {filteredUserNav.map((item) => (
                                        <Disclosure.Button
                                            key={item.name}
                                            as={Link}
                                            to={item.href}
                                            className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800"
                                        >
                                            {item.name}
                                        </Disclosure.Button>
                                    ))}
                                    <Disclosure.Button
                                        as="button"
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        Sign out
                                    </Disclosure.Button>
                                </div>
                            </div>
                        )}
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}
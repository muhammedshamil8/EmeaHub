import { useState, useEffect } from 'react';
import API from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
    UserIcon, 
    CheckCircleIcon, 
    XCircleIcon,
    MagnifyingGlassIcon,
    TrashIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { getInitials } from '../../utils/helpers';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [filter, search]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await API.get('/admin/teachers', {
                params: { status: filter !== 'all' ? filter : undefined, search }
            });
            setUsers(response.data.teachers);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (userId) => {
        try {
            await API.post(`/admin/verify-teacher/${userId}`);
            toast.success('Teacher verified successfully');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to verify teacher');
        }
    };

    const handleDelete = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        
        try {
            await API.delete(`/admin/teacher/${userId}`);
            toast.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    const filters = [
        { value: 'all', label: 'All Users' },
        { value: 'pending', label: 'Pending Verification' },
        { value: 'verified', label: 'Verified' }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
                    User Management
                </h1>
                <p className="text-gray-500 font-medium">Manage permissions and verification for all portal users.</p>
            </div>

            {/* Filters & Actions Bar */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex bg-gray-50 dark:bg-gray-900 p-1 rounded-2xl border border-gray-100 dark:border-gray-700">
                    {filters.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                                filter === f.value
                                    ? 'bg-white dark:bg-gray-800 text-primary-600 shadow-md ring-1 ring-gray-200 dark:ring-gray-700'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="md:ml-auto relative group">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:w-80 px-4 py-3 pl-12 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-300 text-gray-900 dark:text-white font-medium"
                    />
                </div>
            </div>

            {/* Users Table */}
            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700/50">
                            <thead className="bg-gray-50/50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.15em]">User Details</th>
                                    <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.15em]">Department</th>
                                    <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.15em]">Role</th>
                                    <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.15em]">Status</th>
                                    <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.15em]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors group">
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-500/20">
                                                    {getInitials(user.name)}
                                                </div>
                                                <div className="ml-5">
                                                    <div className="text-sm font-black text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-xs font-medium text-gray-500">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                                                {user.department || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${
                                                user.role === 'admin' 
                                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' 
                                                    : user.role === 'teacher'
                                                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                                                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            {user.is_verified ? (
                                                <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-xs font-bold space-x-1.5">
                                                    <ShieldCheckIcon className="h-5 w-5" />
                                                    <span>VERIFIED</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-amber-500 text-xs font-bold space-x-1.5">
                                                    <XCircleIcon className="h-5 w-5" />
                                                    <span>PENDING</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transform duration-300">
                                                {!user.is_verified && (
                                                    <button
                                                        onClick={() => handleVerify(user.id)}
                                                        className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-sm"
                                                        title="Verify User"
                                                    >
                                                        <CheckCircleIcon className="h-5 w-5" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300 shadow-sm"
                                                    title="Delete User"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {users.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No users found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
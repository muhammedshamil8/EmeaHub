import { useState, useEffect } from 'react';
import API from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
    DocumentTextIcon, 
    EyeIcon, 
    EyeSlashIcon,
    StarIcon,
    ArrowDownTrayIcon,
    TrashIcon,
    CheckCircleIcon,
    XCircleIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { getCoverGradient, getSubjectShortCode, formatFileSize, formatDate } from '../../utils/helpers';

export default function ResourceManagement() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1
    });

    useEffect(() => {
        fetchResources();
    }, [filter, pagination.currentPage]);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const response = await API.get('/admin/resources', {
                params: { 
                    status: filter !== 'all' ? filter : undefined,
                    page: pagination.currentPage
                }
            });
            setResources(response.data.resources.data);
            setPagination({
                currentPage: response.data.resources.current_page,
                lastPage: response.data.resources.last_page
            });
        } catch (error) {
            toast.error('Failed to fetch resources');
        } finally {
            setLoading(false);
        }
    };

    const handleVisibility = async (resourceId, currentVisibility) => {
        const newVisibility = currentVisibility === 'visible' ? 'hidden' : 'visible';
        const reason = newVisibility === 'hidden' ? prompt('Reason for hiding:') : null;
        
        if (newVisibility === 'hidden' && !reason) return;

        try {
            await API.post(`/admin/resource/${resourceId}/visibility`, {
                visibility: newVisibility,
                reason
            });
            toast.success(`Resource ${newVisibility === 'visible' ? 'shown' : 'hidden'}`);
            fetchResources();
        } catch (error) {
            toast.error('Failed to update visibility');
        }
    };

    const handleDelete = async (resourceId) => {
        if (!confirm('Are you sure you want to delete this resource?')) return;

        try {
            await API.delete(`/admin/resource/${resourceId}`);
            toast.success('Resource deleted');
            fetchResources();
        } catch (error) {
            toast.error('Failed to delete resource');
        }
    };

    const filters = [
        { value: 'all', label: 'All Resources' },
        { value: 'pending', label: 'Pending' },
        { value: 'verified', label: 'Verified' },
        { value: 'rejected', label: 'Rejected' }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
                    Resource Management
                </h1>
                <p className="text-gray-500 font-medium">Review, verify, and manage all uploaded study materials.</p>
            </div>

            {/* Filters Bar */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex bg-gray-50 dark:bg-gray-900 p-1 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-x-auto">
                    {filters.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => {
                                setFilter(f.value);
                                setPagination({ ...pagination, currentPage: 1 });
                            }}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                                filter === f.value
                                    ? 'bg-white dark:bg-gray-800 text-primary-600 shadow-md ring-1 ring-gray-200 dark:ring-gray-700'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Resources Table */}
            {loading ? (
                <LoadingSpinner />
            ) : (
                <>
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700/50">
                            <thead className="bg-gray-50/50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.15em]">Resource</th>
                                    <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.15em]">Uploader</th>
                                    <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.15em]">Status</th>
                                    <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.15em]">Visibility</th>
                                    <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.15em]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                {resources.map((resource) => (
                                    <tr key={resource.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center">
                                                <div className={`relative flex-shrink-0 h-14 w-14 rounded-2xl bg-gradient-to-br ${getCoverGradient(resource.type)} flex items-center justify-center text-white/40 font-black text-[10px] shadow-lg overflow-hidden`}>
                                                    <span className="relative z-10">{getSubjectShortCode(resource.subject)}</span>
                                                    <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                                                </div>
                                                <div className="ml-5">
                                                    <div className="text-sm font-black text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                                                        {resource.title}
                                                    </div>
                                                    <div className="text-xs font-bold text-gray-500 mt-0.5">
                                                        {resource.type.toUpperCase()} • {resource.subject}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                                {resource.uploader}
                                            </div>
                                            <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-0.5">
                                                {formatDate(resource.created_at || new Date())}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${
                                                resource.status === 'verified' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                                                resource.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                                                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                            }`}>
                                                {resource.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <button
                                                onClick={() => handleVisibility(resource.id, resource.visibility)}
                                                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                                                    resource.visibility === 'visible' 
                                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-800/50' 
                                                        : 'bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600'
                                                }`}
                                            >
                                                {resource.visibility === 'visible' ? (
                                                    <EyeIcon className="h-4 w-4" />
                                                ) : (
                                                    <EyeSlashIcon className="h-4 w-4" />
                                                )}
                                                <span>{resource.visibility}</span>
                                            </button>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 transform duration-300">
                                                <button
                                                    onClick={() => handleDelete(resource.id)}
                                                    className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300 shadow-sm"
                                                    title="Delete Resource"
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
                </div>

                    <div className="mt-8 flex items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
                        <p className="text-sm font-bold text-gray-500">
                            Showing Page {pagination.currentPage} of {pagination.lastPage}
                        </p>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
                                disabled={pagination.currentPage === 1}
                                className="px-6 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
                                disabled={pagination.currentPage === pagination.lastPage}
                                className="px-6 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/20"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
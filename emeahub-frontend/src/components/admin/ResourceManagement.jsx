import { useState, useEffect } from 'react';
import API from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
    DocumentTextIcon, 
    EyeIcon, 
    EyeSlashIcon,
    StarIcon 
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

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
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Resource Management
            </h1>

            {/* Filters */}
            <div className="flex space-x-2">
                {filters.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => {
                            setFilter(f.value);
                            setPagination({ ...pagination, currentPage: 1 });
                        }}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            filter === f.value
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Resources Table */}
            {loading ? (
                <LoadingSpinner />
            ) : (
                <>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Resource
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Uploader
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Visibility
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Stats
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {resources.map((resource) => (
                                    <tr key={resource.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {resource.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {resource.subject} • Sem {resource.semester}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="badge badge-info">
                                                {resource.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {resource.uploader}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`badge ${
                                                resource.status === 'verified' ? 'badge-success' :
                                                resource.status === 'pending' ? 'badge-warning' :
                                                'badge-error'
                                            }`}>
                                                {resource.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleVisibility(resource.id, resource.visibility)}
                                                className="flex items-center space-x-1 text-sm"
                                            >
                                                {resource.visibility === 'visible' ? (
                                                    <>
                                                        <EyeIcon className="h-4 w-4 text-green-600" />
                                                        <span className="text-green-600">Visible</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                                                        <span className="text-gray-400">Hidden</span>
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-3 text-sm">
                                                <span className="text-gray-500">⬇️ {resource.downloads}</span>
                                                <span className="flex items-center text-yellow-500">
                                                    <StarIcon className="h-4 w-4 mr-1" />
                                                    {resource.rating}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleDelete(resource.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.lastPage > 1 && (
                        <div className="flex justify-center space-x-2">
                            <button
                                onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
                                disabled={pagination.currentPage === 1}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2">
                                Page {pagination.currentPage} of {pagination.lastPage}
                            </span>
                            <button
                                onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
                                disabled={pagination.currentPage === pagination.lastPage}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
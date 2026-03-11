import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ResourceGrid from '../components/resources/ResourceGrid';
import ResourceFilters from '../components/resources/ResourceFilters';
import { resourceService } from '../services/resources';
import { useDebounce } from '../hooks/useDebounce';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function BrowseResources() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0
    });

    const searchQuery = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const semester = searchParams.get('semester') || '';
    const department = searchParams.get('department') || '';
    const subject = searchParams.get('subject') || '';
    const sort = searchParams.get('sort') || 'latest';
    const page = parseInt(searchParams.get('page')) || 1;

    const debouncedSearch = useDebounce(searchQuery, 500);

    useEffect(() => {
        fetchResources();
    }, [debouncedSearch, type, semester, department, subject, sort, page]);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const params = {
                search: debouncedSearch,
                type,
                semester,
                department_id: department,
                subject_id: subject,
                sort,
                page
            };
            
            // Remove empty params
            Object.keys(params).forEach(key => 
                !params[key] && delete params[key]
            );

            const response = await resourceService.getResources(params);
            setResources(response.data.data);
            setPagination({
                currentPage: response.data.pagination.current_page,
                lastPage: response.data.pagination.last_page,
                total: response.data.pagination.total
            });
        } catch (error) {
            console.error('Failed to fetch resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        const params = new URLSearchParams(searchParams);
        Object.keys(newFilters).forEach(key => {
            if (newFilters[key]) {
                params.set(key, newFilters[key]);
            } else {
                params.delete(key);
            }
        });
        params.set('page', '1');
        setSearchParams(params);
    };

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage);
        setSearchParams(params);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-8">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 drop-shadow-sm">
                    Browse Resources
                </h1>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
                    Total: {pagination.total} resources
                </p>
            </div>

            <ResourceFilters 
                filters={{ search: searchQuery, type, semester, department, subject, sort }}
                onFilterChange={handleFilterChange}
            />

            {loading ? (
                <div className="py-12">
                    <LoadingSpinner />
                </div>
            ) : (
                <>
                    <ResourceGrid resources={resources} />
                    
                    {/* Pagination */}
                    {pagination.lastPage > 1 && (
                        <div className="flex justify-center flex-wrap gap-2 mt-12 pb-8">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className="px-5 py-2.5 border border-gray-200 dark:border-gray-700/50 rounded-xl font-medium text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 bg-white dark:bg-gray-900 shadow-sm disabled:hover:bg-white dark:disabled:hover:bg-gray-900"
                            >
                                Previous
                            </button>
                            {[...Array(pagination.lastPage)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`px-5 py-2.5 border rounded-xl font-medium transition-all duration-300 shadow-sm ${
                                        page === i + 1 
                                            ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white border-transparent' 
                                            : 'border-gray-200 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === pagination.lastPage}
                                className="px-5 py-2.5 border border-gray-200 dark:border-gray-700/50 rounded-xl font-medium text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 bg-white dark:bg-gray-900 shadow-sm disabled:hover:bg-white dark:disabled:hover:bg-gray-900"
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
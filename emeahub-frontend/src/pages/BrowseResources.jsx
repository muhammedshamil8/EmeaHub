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
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Browse Resources
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
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
                        <div className="flex justify-center space-x-2 mt-8">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Previous
                            </button>
                            {[...Array(pagination.lastPage)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`px-4 py-2 border rounded-lg ${
                                        page === i + 1 
                                            ? 'bg-primary-600 text-white' 
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === pagination.lastPage}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800"
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
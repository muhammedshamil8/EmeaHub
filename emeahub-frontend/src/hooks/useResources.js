import { useState, useEffect } from 'react';
import { resourceService } from '../services/resources';
import { useDebounce } from './useDebounce';
import toast from 'react-hot-toast';

export const useResources = (initialFilters = {}) => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState(initialFilters);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 15
    });

    const debouncedSearch = useDebounce(filters.search, 500);

    useEffect(() => {
        fetchResources();
    }, [
        debouncedSearch,
        filters.type,
        filters.semester,
        filters.department,
        filters.subject,
        filters.sort,
        pagination.currentPage
    ]);

    const fetchResources = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const params = {
                search: debouncedSearch,
                type: filters.type,
                semester: filters.semester,
                department_id: filters.department,
                subject_id: filters.subject,
                sort: filters.sort,
                page: pagination.currentPage,
                per_page: pagination.perPage
            };

            // Remove empty params
            Object.keys(params).forEach(key => 
                (params[key] === undefined || params[key] === '') && delete params[key]
            );

            const response = await resourceService.getResources(params);
            
            setResources(response.data.data || []);
            setPagination({
                currentPage: response.data.pagination?.current_page || 1,
                lastPage: response.data.pagination?.last_page || 1,
                total: response.data.pagination?.total || 0,
                perPage: response.data.pagination?.per_page || 15
            });
        } catch (err) {
            setError(err.message || 'Failed to fetch resources');
            toast.error('Failed to load resources');
            console.error('Error fetching resources:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateFilter = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
        // Reset to first page when filters change
        setPagination(prev => ({
            ...prev,
            currentPage: 1
        }));
    };

    const resetFilters = () => {
        setFilters({});
        setPagination(prev => ({
            ...prev,
            currentPage: 1
        }));
    };

    const goToPage = (page) => {
        setPagination(prev => ({
            ...prev,
            currentPage: Math.min(Math.max(1, page), prev.lastPage)
        }));
    };

    const nextPage = () => {
        if (pagination.currentPage < pagination.lastPage) {
            setPagination(prev => ({
                ...prev,
                currentPage: prev.currentPage + 1
            }));
        }
    };

    const prevPage = () => {
        if (pagination.currentPage > 1) {
            setPagination(prev => ({
                ...prev,
                currentPage: prev.currentPage - 1
            }));
        }
    };

    const refresh = () => {
        fetchResources();
    };

    return {
        resources,
        loading,
        error,
        filters,
        pagination,
        updateFilter,
        resetFilters,
        goToPage,
        nextPage,
        prevPage,
        refresh
    };
};

export const useResource = (id) => {
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetchResource();
        }
    }, [id]);

    const fetchResource = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await resourceService.getResource(id);
            setResource(response.data.resource);
        } catch (err) {
            setError(err.message || 'Failed to fetch resource');
            toast.error('Failed to load resource details');
            console.error('Error fetching resource:', err);
        } finally {
            setLoading(false);
        }
    };

    const rateResource = async (rating, review = '') => {
        try {
            await resourceService.rateResource(id, rating, review);
            await fetchResource(); // Refresh resource data
            toast.success('Rating submitted successfully');
            return true;
        } catch (err) {
            toast.error('Failed to submit rating');
            console.error('Error rating resource:', err);
            return false;
        }
    };

    const downloadResource = async () => {
        try {
            const response = await resourceService.downloadResource(id);
            window.open(response.data.download_url, '_blank');
            toast.success('Download started');
            return true;
        } catch (err) {
            toast.error('Failed to download resource');
            console.error('Error downloading resource:', err);
            return false;
        }
    };

    const refresh = () => {
        fetchResource();
    };

    return {
        resource,
        loading,
        error,
        rateResource,
        downloadResource,
        refresh
    };
};

export const useMyUploads = () => {
    const [uploads, setUploads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUploads();
    }, []);

    const fetchUploads = async () => {
        setLoading(true);
        try {
            const response = await resourceService.getMyUploads();
            setUploads(response.data.resources || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch uploads');
            toast.error('Failed to load your uploads');
        } finally {
            setLoading(false);
        }
    };

    const deleteUpload = async (id) => {
        try {
            await resourceService.deleteResource(id);
            setUploads(prev => prev.filter(u => u.id !== id));
            toast.success('Resource deleted successfully');
            return true;
        } catch (err) {
            toast.error('Failed to delete resource');
            return false;
        }
    };

    const refresh = () => {
        fetchUploads();
    };

    return {
        uploads,
        loading,
        error,
        deleteUpload,
        refresh
    };
};

export const usePendingVerifications = () => {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        setLoading(true);
        try {
            const response = await resourceService.getPendingVerifications();
            setPending(response.data.pending || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch pending verifications');
            toast.error('Failed to load pending verifications');
        } finally {
            setLoading(false);
        }
    };

    const verify = async (id, action, rejectionReason = '') => {
        try {
            await resourceService.verifyResource(id, action, rejectionReason);
            setPending(prev => prev.filter(p => p.id !== id));
            toast.success(`Resource ${action === 'approve' ? 'verified' : 'rejected'}`);
            return true;
        } catch (err) {
            toast.error(`Failed to ${action} resource`);
            return false;
        }
    };

    const refresh = () => {
        fetchPending();
    };

    return {
        pending,
        loading,
        error,
        verify,
        refresh
    };
};
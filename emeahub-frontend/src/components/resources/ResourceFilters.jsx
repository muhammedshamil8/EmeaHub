import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useDebounce } from '../../hooks/useDebounce';
import API from '../../services/api';

export default function ResourceFilters({ filters, onFilterChange }) {
    const [departments, setDepartments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [localSearch, setLocalSearch] = useState(filters.search || '');
    
    const debouncedSearch = useDebounce(localSearch, 500);

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        if (filters.department) {
            fetchSubjects(filters.department, filters.semester);
        }
    }, [filters.department, filters.semester]);

    useEffect(() => {
        if (debouncedSearch !== filters.search) {
            onFilterChange({ search: debouncedSearch });
        }
    }, [debouncedSearch]);

    const fetchDepartments = async () => {
        try {
            const response = await API.get('/departments');
            setDepartments(response.data.departments);
        } catch (error) {
            console.error('Failed to fetch departments:', error);
        }
    };

    const fetchSubjects = async (departmentId, semester) => {
        if (!departmentId || !semester) return;
        try {
            const response = await API.get(`/subjects/by-department`, {
                params: { department_id: departmentId, semester }
            });
            setSubjects(response.data.subjects);
        } catch (error) {
            console.error('Failed to fetch subjects:', error);
        }
    };

    const resourceTypes = [
        { value: '', label: 'All Types' },
        { value: 'note', label: 'Notes' },
        { value: 'pyq', label: 'PYQs' },
        { value: 'syllabus', label: 'Syllabus' },
        { value: 'timetable', label: 'Timetable' },
        { value: 'other', label: 'Other' }
    ];

    const sortOptions = [
        { value: 'latest', label: 'Latest' },
        { value: 'popular', label: 'Most Downloaded' },
        { value: 'rating', label: 'Top Rated' },
        { value: 'oldest', label: 'Oldest' }
    ];

    const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex space-x-2">
                <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="input-field pl-10"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="btn-secondary flex items-center space-x-2"
                >
                    <FunnelIcon className="h-5 w-5" />
                    <span>Filters</span>
                </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Type Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Resource Type
                            </label>
                            <select
                                value={filters.type}
                                onChange={(e) => onFilterChange({ type: e.target.value })}
                                className="input-field"
                            >
                                {resourceTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Department Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Department
                            </label>
                            <select
                                value={filters.department}
                                onChange={(e) => onFilterChange({ 
                                    department: e.target.value,
                                    subject: '' // Reset subject when department changes
                                })}
                                className="input-field"
                            >
                                <option value="">All Departments</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Semester Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Semester
                            </label>
                            <select
                                value={filters.semester}
                                onChange={(e) => onFilterChange({ 
                                    semester: e.target.value,
                                    subject: '' // Reset subject when semester changes
                                })}
                                className="input-field"
                            >
                                <option value="">All Semesters</option>
                                {semesters.map(sem => (
                                    <option key={sem} value={sem}>
                                        Semester {sem}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Subject Filter (shown when department and semester selected) */}
                        {filters.department && filters.semester && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Subject
                                </label>
                                <select
                                    value={filters.subject}
                                    onChange={(e) => onFilterChange({ subject: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="">All Subjects</option>
                                    {subjects.map(subj => (
                                        <option key={subj.id} value={subj.id}>
                                            {subj.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Sort By */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Sort By
                            </label>
                            <select
                                value={filters.sort}
                                onChange={(e) => onFilterChange({ sort: e.target.value })}
                                className="input-field"
                            >
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => onFilterChange({
                                type: '',
                                department: '',
                                semester: '',
                                subject: '',
                                sort: 'latest'
                            })}
                            className="text-sm text-primary-600 hover:text-primary-700"
                        >
                            Clear All Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
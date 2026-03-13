import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useDebounce } from '../../hooks/useDebounce';
import CustomSelect from '../common/CustomSelect';
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
            setSubjects([]);
            fetchSubjects(filters.department, filters.semester);
        } else {
            setSubjects([]);
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
        // Require at minimum a department. Semester filters results further.
        if (!departmentId) return;
        try {
            const params = { department_id: departmentId };
            if (semester) params.semester = semester;
            const response = await API.get(`/subjects/by-department`, { params });
            setSubjects(response.data.subjects || []);
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
                        className="w-full px-4 py-3 pl-10 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex items-center justify-center px-4 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 space-x-2"
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
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                Resource Type
                            </label>
                            <CustomSelect
                                value={filters.type}
                                onChange={(val) => onFilterChange({ type: val })}
                                options={resourceTypes}
                                placeholder="Select type"
                            />
                        </div>

                        {/* Department Filter */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                Department
                            </label>
                            <CustomSelect
                                value={filters.department}
                                onChange={(val) => onFilterChange({ 
                                    department: val,
                                    subject: ''
                                })}
                                options={[{ value: '', label: 'All Departments' }, ...departments.map(dept => ({ value: dept.id, label: dept.name }))]}
                                placeholder="All Departments"
                            />
                        </div>

                        {/* Semester Filter */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                Semester
                            </label>
                            <CustomSelect
                                value={filters.semester}
                                onChange={(val) => onFilterChange({ 
                                    semester: val,
                                    subject: '' 
                                })}
                                options={[{ value: '', label: 'All Semesters' }, ...semesters.map(sem => ({ value: sem, label: `Semester ${sem}` }))]}
                                placeholder="All Semesters"
                            />
                        </div>

                        {/* Subject Filter (shown when department selected AND type is notes/pyq) */}
                        {filters.department && !['timetable', 'syllabus'].includes(filters.type) && (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Subject
                                </label>
                                <CustomSelect
                                    value={filters.subject}
                                    onChange={(val) => onFilterChange({ subject: val })}
                                    options={[{ value: '', label: 'All Subjects' }, ...subjects.map(subj => ({ value: subj.id, label: subj.name }))]}
                                    placeholder="All Subjects"
                                />
                            </div>
                        )}

                        {/* Sort By - Hidden for Timetables and Syllabus */}
                        {!['timetable', 'syllabus'].includes(filters.type) && (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Sort By
                                </label>
                                <CustomSelect
                                    value={filters.sort}
                                    onChange={(val) => onFilterChange({ sort: val })}
                                    options={sortOptions}
                                    placeholder="Sort By"
                                />
                            </div>
                        )}
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
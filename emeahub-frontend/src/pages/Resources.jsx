// src/pages/Resources.jsx
import { useState, useEffect } from 'react';
import CustomSelect from '../common/CustomSelect';
import API from '../services/api';

export default function Resources() {
    const [resources, setResources] = useState([]);
    const [filters, setFilters] = useState({
        type: '',
        semester: '',
        search: ''
    });

    useEffect(() => {
        fetchResources();
    }, [filters]);

    const fetchResources = async () => {
        const params = new URLSearchParams(filters).toString();
        const response = await API.get(`/resources?${params}`);
        setResources(response.data.data);
    };

    const getPageTitle = () => {
        if (!filters.type) return "Browse All Resources";
        const types = { note: "Notes", pyq: "PYQs", syllabus: "Syllabus", timetable: "Timetable", other: "Other" };
        return `Browse ${types[filters.type] || "Resources"}`;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                {getPageTitle()}
            </h1>
            
            {/* Filters */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search..."
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400"
                />
                <CustomSelect
                    value={filters.type}
                    onChange={(val) => setFilters({...filters, type: val})}
                    options={[
                        { value: '', label: 'All Types' },
                        { value: 'note', label: 'Notes' },
                        { value: 'pyq', label: 'PYQs' },
                        { value: 'syllabus', label: 'Syllabus' }
                    ]}
                    placeholder="All Types"
                />
                <CustomSelect
                    value={filters.semester}
                    onChange={(val) => setFilters({...filters, semester: val})}
                    options={[{ value: '', label: 'All Semesters' }, ...[1,2,3,4,5,6,7,8].map(sem => ({ value: sem, label: `Semester ${sem}` }))]}
                    placeholder="All Semesters"
                />
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resources.map(resource => (
                    <div key={resource.id} className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                        <h3 className="font-semibold text-lg">{resource.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{resource.description}</p>
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-sm bg-blue-100 px-2 py-1 rounded">
                                {resource.type}
                            </span>
                            <span className="text-sm">⭐ {resource.rating_avg}</span>
                        </div>
                        <div className="mt-auto pt-6">
                            <button className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-medium rounded-xl shadow-md shadow-green-500/20 transition-all duration-300">
                                Download
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
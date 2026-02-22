// src/pages/Resources.jsx
import { useState, useEffect } from 'react';
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

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Study Resources</h1>
            
            {/* Filters */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search..."
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                    className="px-3 py-2 border rounded"
                />
                <select
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                    className="px-3 py-2 border rounded"
                >
                    <option value="">All Types</option>
                    <option value="note">Notes</option>
                    <option value="pyq">PYQs</option>
                    <option value="syllabus">Syllabus</option>
                </select>
                <select
                    value={filters.semester}
                    onChange={(e) => setFilters({...filters, semester: e.target.value})}
                    className="px-3 py-2 border rounded"
                >
                    <option value="">All Semesters</option>
                    {[1,2,3,4,5,6,7,8].map(sem => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                </select>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resources.map(resource => (
                    <div key={resource.id} className="border rounded-lg p-4 shadow">
                        <h3 className="font-semibold text-lg">{resource.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{resource.description}</p>
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-sm bg-blue-100 px-2 py-1 rounded">
                                {resource.type}
                            </span>
                            <span className="text-sm">⭐ {resource.rating_avg}</span>
                        </div>
                        <button className="mt-4 w-full bg-green-600 text-white py-2 rounded">
                            Download
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
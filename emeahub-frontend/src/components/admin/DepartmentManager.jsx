import { useState, useEffect } from 'react';
import API from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { BuildingOfficeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function DepartmentManager() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingDept, setEditingDept] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: ''
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await API.get('/admin/departments/stats');
            setDepartments(response.data.departments);
        } catch (error) {
            toast.error('Failed to fetch departments');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingDept) {
                await API.put(`/admin/departments/${editingDept.id}`, formData);
                toast.success('Department updated');
            } else {
                await API.post('/admin/departments', formData);
                toast.success('Department created');
            }
            setShowModal(false);
            setEditingDept(null);
            setFormData({ name: '', code: '', description: '' });
            fetchDepartments();
        } catch (error) {
            toast.error('Failed to save department');
        }
    };

    const handleEdit = (dept) => {
        setEditingDept(dept);
        setFormData({
            name: dept.name,
            code: dept.code,
            description: dept.description || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this department?')) return;

        try {
            await API.delete(`/admin/departments/${id}`);
            toast.success('Department deleted');
            fetchDepartments();
        } catch (error) {
            toast.error('Failed to delete department');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Department Management
                </h1>
                <button
                    onClick={() => {
                        setEditingDept(null);
                        setFormData({ name: '', code: '', description: '' });
                        setShowModal(true);
                    }}
                    className="btn-primary"
                >
                    Add Department
                </button>
            </div>

            {/* Departments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept) => (
                    <div key={dept.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary-100 rounded-lg">
                                    <BuildingOfficeIcon className="h-6 w-6 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {dept.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">Code: {dept.code}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(dept)}
                                    className="p-1 text-gray-500 hover:text-primary-600"
                                >
                                    <PencilIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(dept.id)}
                                    className="p-1 text-gray-500 hover:text-red-600"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {dept.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                {dept.description}
                            </p>
                        )}

                        <div className="grid grid-cols-3 gap-2 text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div>
                                <div className="text-lg font-semibold text-primary-600">
                                    {dept.total_students}
                                </div>
                                <div className="text-xs text-gray-500">Students</div>
                            </div>
                            <div>
                                <div className="text-lg font-semibold text-primary-600">
                                    {dept.total_teachers}
                                </div>
                                <div className="text-xs text-gray-500">Teachers</div>
                            </div>
                            <div>
                                <div className="text-lg font-semibold text-primary-600">
                                    {dept.total_resources}
                                </div>
                                <div className="text-xs text-gray-500">Resources</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            {editingDept ? 'Edit Department' : 'Add Department'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Department Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Department Code *
                                </label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="input-field"
                                    rows="3"
                                />
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button type="submit" className="btn-primary flex-1">
                                    {editingDept ? 'Update' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingDept(null);
                                    }}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
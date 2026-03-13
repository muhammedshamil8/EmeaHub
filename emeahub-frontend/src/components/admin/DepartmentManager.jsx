import { useState, useEffect } from 'react';
import API from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { BuildingOfficeIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
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
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
                        Department Management
                    </h1>
                    <p className="text-gray-500 font-medium">Manage academic departments and track their overall engagement.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingDept(null);
                        setFormData({ name: '', code: '', description: '' });
                        setShowModal(true);
                    }}
                    className="group flex items-center gap-3 px-8 py-3.5 bg-primary-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-primary-500/20 hover:bg-primary-500 hover:-translate-y-1 transition-all"
                >
                    <PlusIcon className="h-4 w-4" />
                    Add New Dept
                </button>
            </div>

            {/* Departments List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {departments.map((dept) => (
                    <div key={dept.id} className="group bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700/50 hover:-translate-y-2 transition-all duration-500">
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-5">
                                <div className="h-16 w-16 bg-primary-50 dark:bg-primary-900/20 rounded-[1.5rem] flex items-center justify-center text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-800/30">
                                    <BuildingOfficeIcon className="h-8 w-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-1">{dept.name}</h3>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{dept.code}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(dept)}
                                    className="p-3 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 rounded-2xl hover:bg-primary-600 hover:text-white transition-all shadow-sm border border-gray-100 dark:border-gray-700"
                                >
                                    <PencilIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(dept.id)}
                                    className="p-3 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm border border-gray-100 dark:border-gray-700"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {dept.description && (
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-8 leading-relaxed line-clamp-2">
                                {dept.description}
                            </p>
                        )}

                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-gray-50/50 dark:bg-gray-900/50 rounded-3xl p-5 border border-gray-100/50 dark:border-gray-800/30 text-center">
                                <p className="text-2xl font-black text-primary-600 dark:text-primary-400 mb-1">{dept.total_students || 0}</p>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Students</p>
                            </div>
                            <div className="bg-gray-50/50 dark:bg-gray-900/50 rounded-3xl p-5 border border-gray-100/50 dark:border-gray-800/30 text-center">
                                <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mb-1">{dept.total_teachers || 0}</p>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Teachers</p>
                            </div>
                            <div className="bg-gray-50/50 dark:bg-gray-900/50 rounded-3xl p-5 border border-gray-100/50 dark:border-gray-800/30 text-center">
                                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-1">{dept.total_resources || 0}</p>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Files</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 border border-gray-200 dark:border-gray-700 transform transition-all animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400">
                                <BuildingOfficeIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                                    {editingDept ? 'Edit Dept' : 'Add Dept'}
                                </h3>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Organization details</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">
                                        Dept Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-gray-50/50 dark:bg-gray-900/50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/50 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                                        placeholder="Computer Science"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">
                                        Code
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-gray-50/50 dark:bg-gray-900/50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/50 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                                        placeholder="CS"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-gray-50/50 dark:bg-gray-900/50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/50 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 transition-all resize-none"
                                    rows="4"
                                    placeholder="Brief description of the department..."
                                />
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingDept(null);
                                    }}
                                    className="flex-1 px-8 py-4 bg-gray-50 dark:bg-gray-900 text-gray-500 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-8 py-4 bg-primary-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-primary-500/20 hover:bg-primary-500 transition-all"
                                >
                                    {editingDept ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
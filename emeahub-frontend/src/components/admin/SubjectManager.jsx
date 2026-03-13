import { useState, useEffect } from 'react';
import API from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
    BookOpenIcon, 
    PencilIcon, 
    TrashIcon,
    AcademicCapIcon,
    BuildingOfficeIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { getInitials } from '../../utils/helpers';

export default function SubjectManager() {
    const [subjects, setSubjects] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        type: 'major',
        department_id: '',
        semester: '1',
        syllabus_file: null
    });

    const [filter, setFilter] = useState({
        department_id: '',
        semester: '',
        search: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [subjectsRes, deptsRes] = await Promise.all([
                API.get('/admin/subjects'),
                API.get('/departments')
            ]);

            setSubjects(subjectsRes.data.subjects || []);
            setDepartments(deptsRes.data.departments || []);

        } catch (error) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        data.append('name', formData.name);
        data.append('code', formData.code);
        data.append('type', formData.type);
        data.append('department_id', formData.department_id);
        data.append('semester', formData.semester);
        if (formData.syllabus_file) {
            data.append('syllabus_file', formData.syllabus_file);
        }

        try {
            if (editingSubject) {
                // Laravel workaround for PUT with multipart/form-data
                data.append('_method', 'PUT');
                await API.post(`/admin/subjects/${editingSubject.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Subject updated');
            } else {
                await API.post('/admin/subjects', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Subject created');
            }
            setShowModal(false);
            setEditingSubject(null);
            setFormData({ name: '', code: '', type: 'major', department_id: '', semester: '1', syllabus_file: null });
            fetchData();
        } catch (error) {
            toast.error('Failed to save subject. Ensure all fields are correct.');
        }
    };

    const handleEdit = (sub) => {
        setEditingSubject(sub);
        setFormData({
            name: sub.name,
            code: sub.code,
            type: sub.type || 'major',
            department_id: sub.department_id,
            semester: sub.semester.toString(),
            syllabus_file: null
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this subject?')) return;

        try {
            await API.delete(`/admin/subjects/${id}`);
            toast.success('Subject deleted');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete subject');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
                        Subject Management
                    </h1>
                    <p className="text-gray-500 font-medium">Configure academic subjects across departments and semesters.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingSubject(null);
                        setFormData({ name: '', code: '', type: 'major', department_id: '', semester: '1' });
                        setShowModal(true);
                    }}
                    className="group flex items-center gap-3 px-8 py-3.5 bg-primary-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-primary-500/20 hover:bg-primary-500 hover:-translate-y-1 transition-all"
                >
                    <PlusIcon className="h-4 w-4" />
                    Add New Subject
                </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/50 dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 backdrop-blur-xl shadow-inner">
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search subjects..."
                        value={filter.search}
                        onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/50 text-xs font-bold text-gray-900 dark:text-white placeholder-gray-400 transition-all uppercase tracking-widest"
                    />
                </div>
                <select
                    value={filter.department_id}
                    onChange={(e) => setFilter({ ...filter, department_id: e.target.value })}
                    className="w-full px-5 py-3 bg-white dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/50 text-xs font-bold text-gray-900 dark:text-white appearance-none transition-all cursor-pointer uppercase tracking-widest"
                >
                    <option value="">All Departments</option>
                    {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>
                <select
                    value={filter.semester}
                    onChange={(e) => setFilter({ ...filter, semester: e.target.value })}
                    className="w-full px-5 py-3 bg-white dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/50 text-xs font-bold text-gray-900 dark:text-white appearance-none transition-all cursor-pointer uppercase tracking-widest"
                >
                    <option value="">All Semesters</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                </select>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-gray-900/50">
                                <th className="px-8 py-6 text-left border-b border-gray-100 dark:border-gray-700/50">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Subject Information</span>
                                </th>
                                <th className="px-8 py-6 text-left border-b border-gray-100 dark:border-gray-700/50">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Department</span>
                                </th>
                                <th className="px-8 py-6 text-left border-b border-gray-100 dark:border-gray-700/50">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Curriculum</span>
                                </th>
                                <th className="px-8 py-6 text-right border-b border-gray-100 dark:border-gray-700/50">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                            {(subjects || [])
                                .filter(s => {
                                    const matchSearch = s.name.toLowerCase().includes(filter.search.toLowerCase()) || 
                                                       s.code.toLowerCase().includes(filter.search.toLowerCase());
                                    const matchDept = !filter.department_id || s.department_id.toString() === filter.department_id;
                                    const matchSem = !filter.semester || s.semester.toString() === filter.semester;
                                    return matchSearch && matchDept && matchSem;
                                })
                                .map((sub) => (
                                <tr key={sub.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-all duration-300">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform shadow-inner border border-primary-100 dark:border-primary-800/30">
                                                <BookOpenIcon className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 dark:text-white leading-tight mb-1">{sub.name}</p>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{sub.code}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 font-black text-[10px]">
                                                {getInitials(sub.department?.name || '??')}
                                            </div>
                                            <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{sub.department?.name || 'Main College'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="inline-flex items-center px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-indigo-100 dark:border-indigo-800/30 w-fit">
                                                Semester {sub.semester}
                                            </span>
                                            <span className="inline-flex items-center px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-emerald-100 dark:border-emerald-800/30 w-fit">
                                                {sub.type || 'Major'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleEdit(sub)}
                                                className="p-3 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 rounded-2xl hover:bg-primary-600 hover:text-white transition-all shadow-sm border border-gray-100 dark:border-gray-700"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(sub.id)}
                                                className="p-3 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm border border-gray-100 dark:border-gray-700"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 border border-gray-200 dark:border-gray-700 transform transition-all animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400">
                                <BookOpenIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                                    {editingSubject ? 'Edit Subject' : 'Add Subject'}
                                </h3>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Provide subject details</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">
                                        Subject Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-gray-50/50 dark:bg-gray-900/50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/50 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                                        placeholder="e.g. Discrete Mathematics"
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
                                        placeholder="MAT101"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">
                                        Semester
                                    </label>
                                    <select
                                        value={formData.semester}
                                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-gray-50/50 dark:bg-gray-900/50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/50 text-sm font-bold text-gray-900 dark:text-white appearance-none transition-all cursor-pointer"
                                        required
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                            <option key={sem} value={sem}>Sem {sem}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">
                                    Category (FYUGP)
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-gray-50/50 dark:bg-gray-900/50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/50 text-sm font-bold text-gray-900 dark:text-white appearance-none transition-all cursor-pointer"
                                    required
                                >
                                    <option value="major">Major / Core</option>
                                    <option value="minor">Minor / Complementary</option>
                                    <option value="mdc">MDC (Multidisciplinary)</option>
                                    <option value="aec">AEC (Ability Enhancement)</option>
                                    <option value="sec">SEC (Skill Enhancement)</option>
                                    <option value="vac">VAC (Value Added Course)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">
                                    Department
                                </label>
                                <select
                                    value={formData.department_id}
                                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-gray-50/50 dark:bg-gray-900/50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/50 text-sm font-bold text-gray-900 dark:text-white appearance-none transition-all cursor-pointer"
                                    required
                                >
                                    <option value="" disabled>Select Department</option>
                                    {(departments || []).map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">
                                    Syllabus PDF {editingSubject && <span className="text-primary-500 font-bold lowercase tracking-normal">(Leave empty to keep current)</span>}
                                </label>
                                <div className="relative group/file">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => setFormData({ ...formData, syllabus_file: e.target.files[0] })}
                                        className="hidden"
                                        id="syllabus-upload"
                                    />
                                    <label 
                                        htmlFor="syllabus-upload"
                                        className="flex flex-col items-center justify-center w-full h-32 px-5 py-3.5 bg-gray-50/50 dark:bg-gray-900/50 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl cursor-pointer hover:border-primary-500/50 hover:bg-primary-50/10 transition-all group-hover/file:scale-[1.01]"
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <PlusIcon className="w-6 h-6 mb-2 text-gray-400 group-hover:text-primary-500 transition-colors" />
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                {formData.syllabus_file ? formData.syllabus_file.name : 'Click to upload Syllabus PDF'}
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingSubject(null);
                                    }}
                                    className="flex-1 px-8 py-4 bg-gray-50 dark:bg-gray-900 text-gray-500 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 px-8 py-4 bg-primary-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-primary-500/20 hover:bg-primary-500 transition-all"
                                >
                                    {editingSubject ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

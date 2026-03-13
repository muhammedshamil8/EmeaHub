import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { resourceService } from '../services/resources';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
    DocumentTextIcon, 
    ArrowDownTrayIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    AdjustmentsHorizontalIcon,
    FolderIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { getCoverGradient, getSubjectShortCode, formatDate } from '../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';

export default function MyUploads() {
    const navigate = useNavigate();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchMyUploads();
    }, []);

    const fetchMyUploads = async () => {
        setLoading(true);
        try {
            const response = await resourceService.getMyUploads();
            setResources(response.data.resources || []);
        } catch (error) {
            toast.error('Failed to fetch your uploads');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this resource? This action cannot be undone.')) return;
        
        try {
            await resourceService.deleteResource(id);
            toast.success('Resource deleted successfully');
            setResources(resources.filter(r => r.id !== id));
        } catch (error) {
            toast.error('Failed to delete resource');
        }
    };

    const filteredResources = resources.filter(res => {
        const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (res.subject_name && res.subject_name.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesFilter = filterStatus === 'all' || res.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary-600 transition-colors mb-4 group"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
                        Manage <span className="text-primary-600">Your Uploads</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                        Track, Edit, and Manage your academic contributions
                    </p>
                </div>
                <Link
                    to="/upload"
                    className="inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary-500/30 hover:bg-primary-500 hover:-translate-y-1 transition-all group"
                >
                    <PlusIcon className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    New Upload
                </Link>
            </div>

            {/* Controls Bar */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl p-4 rounded-[2.5rem] border border-gray-100 dark:border-gray-700/50 shadow-xl flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1 group">
                    <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="SEARCH BY TITLE OR SUBJECT..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-gray-50/50 dark:bg-gray-900/50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/50 text-[10px] font-black uppercase tracking-widest transition-all"
                    />
                </div>
                <div className="flex gap-2 p-1 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                    {['all', 'pending', 'verified', 'rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                filterStatus === status
                                    ? 'bg-white dark:bg-gray-800 text-primary-600 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Resources List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-[3rem] border border-gray-100 dark:border-gray-700">
                    <LoadingSpinner />
                    <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sychronizing data...</p>
                </div>
            ) : filteredResources.length > 0 ? (
                <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredResources.map((res) => (
                            <motion.div
                                layout
                                key={res.id}
                                variants={item}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all relative overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${getCoverGradient(res.type)} opacity-[0.03] rounded-full blur-3xl -mt-16 -mr-16 group-hover:scale-150 transition-transform duration-700`}></div>
                                
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`p-4 bg-gradient-to-br ${getCoverGradient(res.type)} rounded-2xl shadow-lg shadow-gray-200 dark:shadow-none`}>
                                            <DocumentTextIcon className="h-6 w-6 text-white" />
                                        </div>
                                        <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full ${
                                            res.status === 'verified' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                            res.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                            {res.status}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight line-clamp-2 min-h-[3.5rem] group-hover:text-primary-600 transition-colors">
                                            {res.title}
                                        </h3>
                                        <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            <FolderIcon className="h-3 w-3 mr-1" />
                                            {res.subject_name || 'GENERAL'}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-700/50">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Upload Date</span>
                                            <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">{formatDate(res.created_at)}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => navigate(`/resources/${res.id}`)}
                                                className="p-3 bg-gray-50 dark:bg-gray-900 text-gray-500 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-all shadow-sm"
                                            >
                                                <ArrowDownTrayIcon className="h-5 w-5" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(res.id)}
                                                className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <div className="text-center py-32 bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-700 flex flex-col items-center">
                    <div className="p-8 bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] mb-6">
                        <FolderIcon className="h-16 w-16 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">No Resources Detected</h3>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest max-w-xs mx-auto mb-10">
                        {searchTerm ? "WE COULDN'T FIND ANY MATCHING UPLOADS. TRY A DIFFERENT SEARCH TERM." : "YOU HAVEN'T SHARED ANY ACADEMIC MATERIALS YET. YOUR CONTRIBUTIONS HELPS US GROW TOGETHER!"}
                    </p>
                    <Link
                        to="/upload"
                        className="px-10 py-5 bg-primary-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary-500/30 hover:bg-primary-500 hover:-translate-y-1 transition-all"
                    >
                        Start Contributing
                    </Link>
                </div>
            )}
        </div>
    );
}

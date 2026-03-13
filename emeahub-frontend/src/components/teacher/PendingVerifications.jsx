import { useState, useEffect } from 'react';
import { resourceService } from '../../services/resources';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
    CheckIcon, 
    XMarkIcon, 
    EyeIcon,
    CalendarIcon,
    InformationCircleIcon,
    ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { getCoverGradient, getSubjectShortCode, formatFileSize, getInitials } from '../../utils/helpers';

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000';

export default function PendingVerifications() {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedResource, setSelectedResource] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            const response = await resourceService.getPendingVerifications();
            setPending(response.data.pending);
        } catch (error) {
            toast.error('Failed to fetch pending verifications');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        setProcessing(true);
        try {
            await resourceService.verifyResource(id, 'approve');
            toast.success('Resource verified successfully');
            fetchPending();
        } catch (error) {
            toast.error('Failed to verify resource');
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }

        setProcessing(true);
        try {
            await resourceService.verifyResource(selectedResource.id, 'reject', rejectionReason);
            toast.success('Resource rejected');
            setShowRejectModal(false);
            setRejectionReason('');
            setSelectedResource(null);
            fetchPending();
        } catch (error) {
            toast.error('Failed to reject resource');
        } finally {
            setProcessing(false);
        }
    };

    const openRejectModal = (resource) => {
        setSelectedResource(resource);
        setShowRejectModal(true);
    };

    if (loading) return <LoadingSpinner />;


    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
                    Pending Verifications
                </h1>
                <p className="text-gray-500 font-medium">Verify shared academic resources to ensure high quality for the community.</p>
            </div>

            {pending.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-20 text-center shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700/50 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-primary-500/5 backdrop-blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="h-24 w-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-3xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-8 animate-bounce transition-transform">
                            <CheckIcon className="h-12 w-12" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">All Caught Up!</h2>
                        <p className="text-gray-500 font-medium max-w-sm mx-auto">
                            There are no pending resources waiting for your expertise at the moment. Great job!
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {pending.map((resource) => (
                        <div
                            key={resource.id}
                            className="group relative bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500"
                        >
                            <div className="flex flex-col xl:flex-row gap-8">
                                {/* Mini Cover */}
                                <div className={`relative flex-shrink-0 w-full xl:w-48 h-48 xl:h-auto rounded-[2rem] bg-gradient-to-br ${getCoverGradient(resource.type)} flex flex-col items-center justify-center text-white p-6 shadow-2xl overflow-hidden`}>
                                    <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                                    <span className="relative z-10 font-black text-4xl tracking-tighter mb-2 opacity-50">
                                        {getSubjectShortCode(resource.subject)}
                                    </span>
                                    <span className="relative z-10 font-black text-[10px] uppercase tracking-[0.2em]">
                                        {resource.type}
                                    </span>
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div>
                                                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-primary-600 transition-colors">
                                                    {resource.title}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-4 text-xs font-black uppercase tracking-widest text-gray-400">
                                                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700/50">
                                                        <CalendarIcon className="h-3.5 w-3.5" />
                                                        Sem {resource.semester}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                                                        {resource.subject}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => window.open(STORAGE_URL +resource.file_url, '_blank')}
                                                    className="p-3 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 rounded-2xl hover:bg-primary-600 hover:text-white transition-all shadow-sm"
                                                    title="Preview Material"
                                                >
                                                    <EyeIcon className="h-6 w-6" />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8 line-clamp-3">
                                            {resource.description || 'No description provided for this resource. Please review the content quality carefully.'}
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-50 dark:border-gray-700/50">
                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                            <div className="h-12 w-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center text-gray-600 dark:text-gray-400 font-black text-xs">
                                                {getInitials(resource.uploaded_by)}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-0.5">Uploader</p>
                                                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{resource.uploaded_by}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 w-full sm:w-auto">
                                            <button
                                                onClick={() => openRejectModal(resource)}
                                                disabled={processing}
                                                className="flex-1 sm:flex-none px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm disabled:opacity-50"
                                            >
                                                Reject Issue
                                            </button>
                                            <button
                                                onClick={() => handleApprove(resource.id)}
                                                disabled={processing}
                                                className="flex-1 sm:flex-none px-8 py-3 bg-primary-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-primary-500/20 hover:bg-primary-500 hover:-translate-y-1 transition-all disabled:opacity-50"
                                            >
                                                {processing ? 'Verifying...' : 'Verify Content'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Reject Resource
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Please provide a reason for rejecting "{selectedResource?.title}"
                        </p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full mb-4 px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400"
                            rows="4"
                            placeholder="e.g., Poor quality, incomplete content, wrong subject..."
                        />
                        <div className="flex space-x-3">
                            <button
                                onClick={handleReject}
                                disabled={processing}
                                className="flex-1 inline-flex justify-center items-center px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                {processing ? 'Rejecting...' : 'Reject'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionReason('');
                                    setSelectedResource(null);
                                }}
                                className="flex-1 inline-flex justify-center items-center px-4 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
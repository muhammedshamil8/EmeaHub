import { useState, useEffect } from 'react';
import { resourceService } from '../../services/resources';
import LoadingSpinner from '../common/LoadingSpinner';
import { CheckIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

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
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Pending Verifications
            </h1>

            {pending.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                    <CheckIcon className="h-16 w-16 mx-auto text-green-500 mb-4" />
                    <p className="text-xl text-gray-900 dark:text-white mb-2">
                        All caught up!
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                        No pending resources to verify
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {pending.map((resource) => (
                        <div
                            key={resource.id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        {resource.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        {resource.description}
                                    </p>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Type</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {resource.type}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Subject</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {resource.subject}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Semester</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {resource.semester}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Uploaded By</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {resource.uploaded_by}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <EyeIcon className="h-4 w-4" />
                                        <span>{resource.file_name} ({resource.file_size})</span>
                                    </div>
                                </div>

                                <div className="flex space-x-2 ml-4">
                                    <button
                                        onClick={() => window.open(resource.file_url, '_blank')}
                                        className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                    >
                                        <EyeIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleApprove(resource.id)}
                                        disabled={processing}
                                        className="p-2 text-green-600 hover:text-green-700 disabled:opacity-50"
                                    >
                                        <CheckIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => openRejectModal(resource)}
                                        disabled={processing}
                                        className="p-2 text-red-600 hover:text-red-700 disabled:opacity-50"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Reject Resource
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Please provide a reason for rejecting "{selectedResource?.title}"
                        </p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="input-field w-full mb-4"
                            rows="4"
                            placeholder="e.g., Poor quality, incomplete content, wrong subject..."
                        />
                        <div className="flex space-x-3">
                            <button
                                onClick={handleReject}
                                disabled={processing}
                                className="btn-primary flex-1"
                            >
                                {processing ? 'Rejecting...' : 'Reject'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionReason('');
                                    setSelectedResource(null);
                                }}
                                className="btn-secondary flex-1"
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
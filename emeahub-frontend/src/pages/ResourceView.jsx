import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resourceService } from '../services/resources';
import { formatDate, formatFileSize } from '../utils/helpers';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
    ArrowDownTrayIcon, 
    StarIcon, 
    EyeIcon,
    DocumentTextIcon,
    UserIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

export default function ResourceView() {
    const { id } = useParams();
    const { user, isAuthenticated } = useAuth();
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRating, setUserRating] = useState(0);
    const [review, setReview] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchResource();
    }, [id]);

    const fetchResource = async () => {
        try {
            const response = await resourceService.getResource(id);
            setResource(response.data.resource);
            
            // Check if user has already rated
            if (isAuthenticated && response.data.resource.user_rating) {
                setUserRating(response.data.resource.user_rating.rating);
                setReview(response.data.resource.user_rating.review || '');
            }
        } catch (error) {
            toast.error('Failed to load resource');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await resourceService.downloadResource(id);
            window.open(response.data.download_url, '_blank');
            toast.success('Download started');
        } catch (error) {
            toast.error('Download failed');
        }
    };

    const handleRating = async (rating) => {
        if (!isAuthenticated) {
            toast.error('Please login to rate');
            return;
        }
        
        setUserRating(rating);
        setSubmitting(true);
        try {
            await resourceService.rateResource(id, rating, review);
            await fetchResource(); // Refresh to get updated rating
            toast.success('Rating submitted');
        } catch (error) {
            toast.error('Failed to submit rating');
            setUserRating(0);
        } finally {
            setSubmitting(false);
        }
    };

    const handleReviewSubmit = async () => {
        if (!userRating) {
            toast.error('Please select a rating first');
            return;
        }
        
        setSubmitting(true);
        try {
            await resourceService.rateResource(id, userRating, review);
            await fetchResource();
            toast.success('Review submitted');
        } catch (error) {
            toast.error('Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!resource) return <div>Resource not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Resource Header */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                            {resource.title}
                        </h1>
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 tracking-wide border border-blue-200 dark:border-blue-800">{resource.type}</span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 tracking-wide border border-emerald-200 dark:border-emerald-800">Semester {resource.semester}</span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 tracking-wide border border-amber-200 dark:border-amber-800">{resource.subject}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleDownload}
                        className="inline-flex justify-center items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 focus:outline-none space-x-2"
                    >
                        <ArrowDownTrayIcon className="h-5 w-5" />
                        <span>Download</span>
                    </button>
                </div>

                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                    {resource.description}
                </p>

                {/* Resource Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                        <div className="flex items-center justify-center text-yellow-500 mb-1">
                            <StarIconSolid className="h-5 w-5" />
                            <span className="ml-1 font-bold">{resource.rating_avg}</span>
                        </div>
                        <div className="text-sm text-gray-500">{resource.rating_count} ratings</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center text-blue-500 mb-1">
                            <ArrowDownTrayIcon className="h-5 w-5" />
                            <span className="ml-1 font-bold">{resource.download_count}</span>
                        </div>
                        <div className="text-sm text-gray-500">Downloads</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center text-green-500 mb-1">
                            <EyeIcon className="h-5 w-5" />
                            <span className="ml-1 font-bold">{resource.view_count}</span>
                        </div>
                        <div className="text-sm text-gray-500">Views</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center text-purple-500 mb-1">
                            <DocumentTextIcon className="h-5 w-5" />
                            <span className="ml-1 font-bold">{formatFileSize(resource.file_size)}</span>
                        </div>
                        <div className="text-sm text-gray-500">File Size</div>
                    </div>
                </div>

                {/* Uploader Info */}
                <div className="flex items-center justify-between pt-6 mt-4 border-t border-gray-100 dark:border-gray-700/50">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 w-full">
                        <div className="flex items-center space-x-2">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                                Uploaded by {resource.uploaded_by}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                                {formatDate(resource.uploaded_at)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rating Section */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                    Rate this Resource
                </h2>
                
                {/* Star Rating */}
                <div className="flex items-center space-x-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => handleRating(star)}
                            disabled={submitting}
                            className="focus:outline-none"
                        >
                            {star <= userRating ? (
                                <StarIconSolid className="h-8 w-8 text-yellow-500" />
                            ) : (
                                <StarIcon className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Review */}
                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Write your review (optional)..."
                    className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 mb-6 resize-none"
                    rows="3"
                    disabled={submitting}
                />

                <button
                    onClick={handleReviewSubmit}
                    disabled={submitting || !userRating}
                    className="inline-flex justify-center items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </div>

            {/* Related Resources */}
            {resource.related && resource.related.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                        Related Resources
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {resource.related.map((related) => (
                            <Link
                                key={related.id}
                                to={`/resources/${related.id}`}
                                className="p-5 border border-gray-100 dark:border-gray-700/50 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 group"
                            >
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                    {related.title}
                                </h3>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{related.type}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
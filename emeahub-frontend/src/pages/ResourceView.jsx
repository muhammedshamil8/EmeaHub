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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {resource.title}
                        </h1>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="badge badge-info">{resource.type}</span>
                            <span className="badge badge-success">Semester {resource.semester}</span>
                            <span className="badge badge-warning">{resource.subject}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleDownload}
                        className="btn-primary flex items-center space-x-2"
                    >
                        <ArrowDownTrayIcon className="h-5 w-5" />
                        <span>Download</span>
                    </button>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4">
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
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
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
                    className="input-field w-full mb-4"
                    rows="3"
                    disabled={submitting}
                />

                <button
                    onClick={handleReviewSubmit}
                    disabled={submitting || !userRating}
                    className="btn-primary"
                >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </div>

            {/* Related Resources */}
            {resource.related && resource.related.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                        Related Resources
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {resource.related.map((related) => (
                            <Link
                                key={related.id}
                                to={`/resources/${related.id}`}
                                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                    {related.title}
                                </h3>
                                <p className="text-sm text-gray-500">{related.type}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatFileSize } from '../../utils/helpers';
import {
    ArrowDownTrayIcon,
    StarIcon,
    EyeIcon,
    UserIcon,
    CalendarIcon,
    DocumentTextIcon,
    AcademicCapIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

export default function ResourceDetails({ resource, onDownload, onRate, userRating }) {
    const { isAuthenticated } = useAuth();
    const [rating, setRating] = useState(userRating || 0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);

    const handleRatingClick = async (value) => {
        if (!isAuthenticated) {
            toast.error('Please login to rate');
            return;
        }
        setRating(value);
        if (onRate) {
            await onRate(value, review);
        }
    };

    const handleReviewSubmit = async () => {
        if (rating === 0) {
            toast.error('Please select a rating first');
            return;
        }
        await onRate(rating, review);
        setShowReviewForm(false);
    };

    const getTypeIcon = (type) => {
        switch(type) {
            case 'note': return '📝';
            case 'pyq': return '📄';
            case 'syllabus': return '📚';
            case 'timetable': return '📅';
            default: return '📁';
        }
    };

    return (
        <div className="space-y-6">
            {/* Main Resource Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <span className="text-3xl">{getTypeIcon(resource.type)}</span>
                            <div>
                                <h1 className="text-2xl font-bold text-white">{resource.title}</h1>
                                <p className="text-primary-100 text-sm mt-1">
                                    {resource.subject} • Semester {resource.semester}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onDownload}
                            className="bg-white text-primary-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
                        >
                            <ArrowDownTrayIcon className="h-5 w-5" />
                            <span>Download</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Description
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {resource.description || 'No description provided.'}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-gray-200 dark:border-gray-700">
                        <div className="text-center">
                            <div className="flex items-center justify-center text-yellow-500 mb-1">
                                <StarIconSolid className="h-5 w-5" />
                                <span className="ml-1 font-bold text-gray-900 dark:text-white">
                                    {resource.rating_avg}
                                </span>
                            </div>
                            <div className="text-sm text-gray-500">{resource.rating_count} ratings</div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center text-blue-500 mb-1">
                                <ArrowDownTrayIcon className="h-5 w-5" />
                                <span className="ml-1 font-bold text-gray-900 dark:text-white">
                                    {resource.download_count}
                                </span>
                            </div>
                            <div className="text-sm text-gray-500">Downloads</div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center text-green-500 mb-1">
                                <EyeIcon className="h-5 w-5" />
                                <span className="ml-1 font-bold text-gray-900 dark:text-white">
                                    {resource.view_count}
                                </span>
                            </div>
                            <div className="text-sm text-gray-500">Views</div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center text-purple-500 mb-1">
                                <DocumentTextIcon className="h-5 w-5" />
                                <span className="ml-1 font-bold text-gray-900 dark:text-white">
                                    {formatFileSize(resource.file_size)}
                                </span>
                            </div>
                            <div className="text-sm text-gray-500">File Size</div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="flex items-center space-x-2">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Uploaded by</p>
                                <p className="text-gray-900 dark:text-white font-medium">
                                    {resource.uploaded_by}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Uploaded on</p>
                                <p className="text-gray-900 dark:text-white font-medium">
                                    {formatDate(resource.uploaded_at)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Department</p>
                                <p className="text-gray-900 dark:text-white font-medium">
                                    {resource.department}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">File Name</p>
                                <p className="text-gray-900 dark:text-white font-medium truncate">
                                    {resource.file_name}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rating Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Rate this Resource
                </h3>

                {/* Star Rating */}
                <div className="flex items-center space-x-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => handleRatingClick(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            {star <= (hoverRating || rating) ? (
                                <StarIconSolid className="h-8 w-8 text-yellow-500" />
                            ) : (
                                <StarIcon className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                            )}
                        </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-500">
                        {rating > 0 ? `You rated ${rating} stars` : 'Click to rate'}
                    </span>
                </div>

                {/* Review Button */}
                {isAuthenticated && (
                    <div className="mt-4">
                        {!showReviewForm ? (
                            <button
                                onClick={() => setShowReviewForm(true)}
                                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                            >
                                Write a review
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <textarea
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    placeholder="Share your thoughts about this resource..."
                                    className="input-field w-full"
                                    rows="3"
                                />
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleReviewSubmit}
                                        className="btn-primary"
                                    >
                                        Submit Review
                                    </button>
                                    <button
                                        onClick={() => setShowReviewForm(false)}
                                        className="btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Existing Reviews */}
                {resource.reviews && resource.reviews.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                            User Reviews
                        </h4>
                        <div className="space-y-4">
                            {resource.reviews.map((review, index) => (
                                <div key={index} className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {review.user_name}
                                            </span>
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <StarIconSolid
                                                        key={i}
                                                        className={`h-4 w-4 ${
                                                            i < review.rating
                                                                ? 'text-yellow-500'
                                                                : 'text-gray-300'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {formatDate(review.created_at)}
                                        </span>
                                    </div>
                                    {review.comment && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {review.comment}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
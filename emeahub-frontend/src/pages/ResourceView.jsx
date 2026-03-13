import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resourceService } from '../services/resources';
import { formatDate, formatFileSize, getCoverGradient, getSubjectShortCode } from '../utils/helpers';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
    ArrowDownTrayIcon, 
    StarIcon, 
    EyeIcon,
    DocumentTextIcon,
    UserIcon,
    CalendarIcon,
    HeartIcon,
    ArrowLeftIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/common/MotionContainer';
import ResourceCard from '../components/resources/ResourceCard';
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000';

export default function ResourceView() {
    const { id } = useParams();
    const location = useLocation();
    const { user, isAuthenticated } = useAuth();
    const [resource, setResource] = useState(null);
    const [relatedResources, setRelatedResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRating, setUserRating] = useState(0);
    const [review, setReview] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchResource();
    }, [id]);

    const fetchResource = async () => {
        setLoading(true);
        try {
            const response = await resourceService.getResource(id);
            setResource(response.data.resource);
            setIsBookmarked(response.data.resource.is_bookmarked);
            
            if (isAuthenticated && response.data.resource.user_rating) {
                setUserRating(response.data.resource.user_rating.rating);
                setReview(response.data.resource.user_rating.review || '');
            }

            // Fetch related resources (based on subject or type)
            const relatedRes = await resourceService.getResources({ 
                subject_id: response.data.resource.subject_id,
                limit: 4 
            });
            setRelatedResources(relatedRes.data.data.filter(r => r.id !== parseInt(id)).slice(0, 3));
            
        } catch (error) {
            toast.error('Failed to load resource');
        } finally {
            setLoading(false);
        }
    };

    const handleBookmark = async () => {
        if (!isAuthenticated) {
            toast.error("Please login to bookmark resources");
            return;
        }

        setIsToggling(true);
        try {
            const res = await resourceService.toggleBookmark(id);
            setIsBookmarked(res.data.is_bookmarked);
            if (res.data.is_bookmarked) toast.success("Added to bookmarks");
            else toast.success("Removed from bookmarks");
        } catch (error) {
            toast.error("Failed to update bookmark");
        } finally {
            setIsToggling(false);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await resourceService.downloadResource(id);
            window.open(STORAGE_URL +response.data.download_url, '_blank');
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
    };

    const handleReviewSubmit = async () => {
        if (!userRating) {
            toast.error('Please select a rating first');
            return;
        }
        
        setSubmitting(true);
        try {
            await resourceService.rateResource(id, userRating, review);
            toast.success('Review submitted');
            fetchResource(); // Refresh
        } catch (error) {
            toast.error('Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
            <LoadingSpinner />
            <p className="text-gray-500 font-black uppercase tracking-widest text-xs animate-pulse">Loading Excellence...</p>
        </div>
    );
    
    if (!resource) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Resource Not Found</h2>
            <Link to="/resources" className="text-primary-600 font-bold mt-4 inline-block">Back to Browse</Link>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20 px-4 sm:px-0">
            {/* Back Button */}
            <FadeIn>
                <Link to="/resources" className="inline-flex items-center text-xs font-black uppercase tracking-widest text-gray-500 hover:text-primary-600 transition-colors group">
                    <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Library
                </Link>
            </FadeIn>

            {/* Premium Header/Banner */}
            <FadeIn delay={0.1}>
                <div className="relative h-64 md:h-80 w-full rounded-[2.5rem] overflow-hidden shadow-2xl group border-4 border-white dark:border-gray-800">
                    <div className={`absolute inset-0 bg-gradient-to-br ${getCoverGradient(resource.type)} opacity-100 transition-transform duration-1000 group-hover:scale-110`}></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.3)_100%)]"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                        <span className="text-7xl md:text-9xl font-black text-white/30 tracking-tighter uppercase drop-shadow-2xl select-none mb-2 group-hover:scale-110 transition-transform duration-700">
                            {getSubjectShortCode(resource.subject)}
                        </span>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-2 shadow-xl">
                            <span className="text-white text-xs sm:text-sm font-black tracking-[0.3em] uppercase">
                                {resource.department} Hub
                            </span>
                        </div>
                    </div>

                    {/* Quick Access Top Bar */}
                    <div className="absolute top-6 left-6 flex space-x-2">
                        <span className="bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                            {resource.type}
                        </span>
                        <span className="bg-primary-600 text-white px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary-500/20">
                            SEM {resource.semester}
                        </span>
                    </div>

                    {/* Bookmark Float */}
                    <button 
                        onClick={handleBookmark}
                        disabled={isToggling}
                        className="absolute top-6 right-6 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-all duration-300 shadow-xl group/btn"
                    >
                        {isBookmarked ? (
                            <HeartIconSolid className="h-6 w-6 text-red-500 transition-transform group-hover/btn:scale-125" />
                        ) : (
                            <HeartIcon className="h-6 w-6 text-white transition-transform group-hover/btn:scale-125" />
                        )}
                    </button>
                </div>
            </FadeIn>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content Info */}
                <div className="lg:col-span-2 space-y-8">
                    <FadeIn delay={0.2}>
                        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-700/50">
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter leading-none uppercase">
                                {resource.title}
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium mb-10 leading-relaxed italic border-l-4 border-primary-500 pl-6">
                                {resource.description || 'No description provided for this high-quality academic material.'}
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-y border-gray-100 dark:border-gray-700/50">
                                <div className="text-center group">
                                    <div className="flex items-center justify-center text-yellow-500 mb-1 group-hover:scale-110 transition-transform">
                                        <StarIconSolid className="h-6 w-6" />
                                        <span className="ml-1 font-black text-xl">{resource.rating_avg || '0.0'}</span>
                                    </div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{resource.rating_count} reviews</div>
                                </div>
                                <div className="text-center group">
                                    <div className="flex items-center justify-center text-blue-500 mb-1 group-hover:scale-110 transition-transform">
                                        <ArrowDownTrayIcon className="h-6 w-6" />
                                        <span className="ml-1 font-black text-xl">{resource.download_count}</span>
                                    </div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Downloads</div>
                                </div>
                                <div className="text-center group">
                                    <div className="flex items-center justify-center text-emerald-500 mb-1 group-hover:scale-110 transition-transform">
                                        <EyeIcon className="h-6 w-6" />
                                        <span className="ml-1 font-black text-xl">{resource.view_count}</span>
                                    </div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Views</div>
                                </div>
                                <div className="text-center group">
                                    <div className="flex items-center justify-center text-purple-500 mb-1 group-hover:scale-110 transition-transform">
                                        <DocumentTextIcon className="h-6 w-6" />
                                        <span className="ml-1 font-black text-xl break-all">{formatFileSize(resource.file_size)}</span>
                                    </div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Size</div>
                                </div>
                            </div>

                            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 shadow-inner">
                                        <UserIcon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Uploaded By</p>
                                        <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight">{resource.uploaded_by}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 text-right">
                                    <div className="sm:text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Release Date</p>
                                        <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight">{formatDate(resource.uploaded_at)}</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center text-gray-500 shadow-inner">
                                        <CalendarIcon className="h-6 w-6" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Actions Panel */}
                    <FadeIn delay={0.3}>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => setIsViewing(!isViewing)}
                                className="flex-1 inline-flex justify-center items-center px-8 py-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-black rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest text-sm"
                            >
                                <EyeIcon className="h-6 w-6 mr-3" />
                                {isViewing ? 'Hide Preview' : 'Preview Document'}
                            </button>
                            <button
                                onClick={handleDownload}
                                className="flex-1 inline-flex justify-center items-center px-8 py-5 bg-gradient-to-br from-primary-600 to-indigo-700 hover:from-primary-500 hover:to-indigo-600 text-white font-black rounded-3xl shadow-2xl shadow-primary-500/20 hover:shadow-primary-500/40 hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest text-sm"
                            >
                                <ArrowDownTrayIcon className="h-6 w-6 mr-3" />
                                Quick Download
                            </button>
                        </div>
                    </FadeIn>

                    {/* PDF Previewer */}
                    {isViewing && resource.file_url && (
                        <FadeIn>
                            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-4 sm:p-6 border border-gray-100 dark:border-gray-700 shadow-2xl">
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center">
                                        <SparklesIcon className="h-5 w-5 mr-2 text-primary-500" />
                                        Advanced Preview
                                    </h3>
                                    <button onClick={() => setIsViewing(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="w-full h-[600px] rounded-2xl overflow-hidden bg-gray-900 flex items-center justify-center">
                                    <object 
                                        data={STORAGE_URL +resource.file_url} 
                                        type="application/pdf" 
                                        width="100%" 
                                        height="100%"
                                        className="w-full h-full"
                                    >
                                        <div className="text-center p-12">
                                            <DocumentTextIcon className="h-20 w-20 mx-auto text-gray-700 mb-6" />
                                            <p className="text-gray-400 mb-8 font-bold uppercase tracking-widest">Preview Unavailable</p>
                                            <button
                                                onClick={handleDownload}
                                                className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest text-xs"
                                            >
                                                Download Instead
                                            </button>
                                        </div>
                                    </object>
                                </div>
                            </div>
                        </FadeIn>
                    )}

                    {/* Related Resources at Bottom */}
                    {relatedResources.length > 0 && (
                        <FadeIn delay={0.4}>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Related Materials</h2>
                                    <Link to={`/resources?subject=${resource.subject_id}`} className="text-xs font-black text-primary-600 uppercase tracking-widest">Explore More</Link>
                                </div>
                                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {relatedResources.map((res) => (
                                        <StaggerItem key={res.id}>
                                            <ResourceCard resource={res} />
                                        </StaggerItem>
                                    ))}
                                </StaggerContainer>
                            </div>
                        </FadeIn>
                    )}
                </div>

                {/* Sidebar - Rating & Meta */}
                <div className="space-y-8">
                    <FadeIn delay={0.4}>
                        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-xl border border-gray-100 dark:border-gray-700/50 sticky top-24">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tight">Your Feedback</h2>
                            
                            <div className="flex items-center justify-center space-x-2 mb-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-3xl shadow-inner group">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => handleRating(star)}
                                        disabled={submitting}
                                        className="focus:outline-none transition-transform hover:scale-125 duration-300"
                                    >
                                        {star <= userRating ? (
                                            <StarIconSolid className="h-8 w-8 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
                                        ) : (
                                            <StarIcon className="h-8 w-8 text-gray-300 dark:text-gray-700 group-hover:text-yellow-200 transition-colors" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <textarea
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                placeholder="Any specific thoughts on this material?"
                                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all duration-300 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 mb-6 resize-none h-32"
                                disabled={submitting}
                            />

                            <button
                                onClick={handleReviewSubmit}
                                disabled={submitting || !userRating}
                                className="w-full py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-3xl shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-30 uppercase tracking-widest text-xs"
                            >
                                {submitting ? 'Processing...' : 'Submit Appraisal'}
                            </button>
                            
                            <p className="text-[10px] text-center text-gray-400 mt-6 font-bold uppercase tracking-widest">
                                Your input improves the hub's intelligence
                            </p>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
}
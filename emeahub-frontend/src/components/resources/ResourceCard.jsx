import { Link } from 'react-router-dom';
import {
    DocumentTextIcon,
    ArrowDownTrayIcon,
    EyeIcon,
    HeartIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { resourceService } from '../../services/resources';
import { getCoverGradient, getSubjectShortCode } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function ResourceCard({ resource, compact = false }) {
    const { isAuthenticated } = useAuth();
    const [isBookmarked, setIsBookmarked] = useState(resource.is_bookmarked || false);
    const [isToggling, setIsToggling] = useState(false);

    const handleBookmark = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error("Please login to bookmark resources");
            return;
        }

        setIsToggling(true);
        try {
            const res = await resourceService.toggleBookmark(resource.id);
            setIsBookmarked(res.data.is_bookmarked);
            if (res.data.is_bookmarked) toast.success("Added to bookmarks");
            else toast.success("Removed from bookmarks");
        } catch (error) {
            toast.error("Failed to update bookmark");
        } finally {
            setIsToggling(false);
        }
    };

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 group flex flex-col h-full ${compact ? 'max-w-sm' : ''}`}>
            {/* Premium Cover with Glow */}
            <Link to={`/resources/${resource.id}`} className="relative h-40 w-full overflow-hidden block">
                <div className={`absolute inset-0 bg-gradient-to-br ${getCoverGradient(resource.type)} opacity-100 group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700`}></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.2)_100%)] opacity-30"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                
                <div className="absolute inset-0 flex items-center justify-center flex-col p-4 text-center">
                    <span className="text-4xl md:text-5xl font-black text-white/40 tracking-tighter uppercase mb-1 drop-shadow-2xl group-hover:scale-110 transition-transform duration-500">
                        {getSubjectShortCode(resource.subject)}
                    </span>
                    <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/20 shadow-xl">
                        {resource.department || 'EMEA'}
                    </span>
                </div>

                <div className="absolute top-4 right-4">
                    <button
                        onClick={handleBookmark}
                        disabled={isToggling}
                        className={`p-2 rounded-2xl backdrop-blur-md transition-all duration-300 shadow-lg ${isBookmarked
                                ? 'bg-red-500/80 text-white'
                                : 'bg-white/20 text-white hover:bg-white/40'
                            }`}
                    >
                        {isBookmarked ? (
                            <HeartIconSolid className="w-5 h-5" />
                        ) : (
                            <HeartIcon className="w-5 h-5" />
                        )}
                    </button>
                </div>

                <div className="absolute bottom-4 left-4">
                    <span className="text-[10px] font-black px-3 py-1.5 rounded-xl bg-gray-900/40 backdrop-blur-md text-white shadow-xl uppercase tracking-widest border border-white/10">
                        {resource.type}
                    </span>
                </div>
            </Link>

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-full uppercase tracking-widest">
                        Semester {resource.semester}
                    </span>
                    <div className="flex items-center text-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 px-3 py-1 rounded-full border border-yellow-100 dark:border-yellow-800/50">
                        <StarIconSolid className="h-3 w-3 mr-1" />
                        <span className="text-xs font-black">{resource.rating_avg || '0.0'}</span>
                    </div>
                </div>

                <Link to={`/resources/${resource.id}`} className="group/title">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2 leading-tight group-hover/title:text-primary-600 transition-colors uppercase tracking-tight line-clamp-2 h-14">
                        {resource.title}
                    </h3>
                </Link>
                
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-6 line-clamp-2 h-8">
                    {resource.description || 'Dedicated study material for core subjects and electives.'}
                </p>

                <div className="mt-auto space-y-4 pt-4 border-t border-gray-50 dark:border-gray-700/50">
                    <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                             <div className="w-6 h-6 rounded-full bg-primary-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[10px] font-bold text-white">
                                 {resource.uploaded_by?.charAt(0) || 'E'}
                             </div>
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate max-w-[120px]">
                            {resource.uploaded_by || 'EMEA Hub'}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center text-gray-400 group-hover:text-primary-500 transition-colors">
                                <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                                <span className="text-xs font-black">{resource.download_count || 0}</span>
                            </div>
                            <div className="flex items-center text-gray-400 group-hover:text-purple-500 transition-colors">
                                <EyeIcon className="h-4 w-4 mr-1" />
                                <span className="text-xs font-black">{resource.view_count || 0}</span>
                            </div>
                        </div>
                        <Link
                            to={`/resources/${resource.id}`}
                            className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-xl text-primary-600 hover:bg-primary-600 hover:text-white transition-all duration-300"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
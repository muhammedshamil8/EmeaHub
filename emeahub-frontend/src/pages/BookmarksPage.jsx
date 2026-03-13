import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import ResourceCard from '../components/resources/ResourceCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { BookmarkIcon } from '@heroicons/react/24/outline';

export default function BookmarksPage() {
    const { isAuthenticated } = useAuth();
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            fetchBookmarks();
        }
    }, [isAuthenticated]);

    const fetchBookmarks = async () => {
        try {
            const response = await API.get('/user/bookmarks');
            setBookmarks(response.data.bookmarks.data || []);
        } catch (error) {
            console.error('Failed to fetch bookmarks', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-500 font-medium">Loading your bookmarks...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in px-4 py-8">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
                    <BookmarkIcon className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Bookmarks</h1>
                    <p className="text-gray-600 dark:text-gray-400">Resources you have saved for quick access</p>
                </div>
            </div>

            {bookmarks.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <BookmarkIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No bookmarks yet</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                        When you find a resource you want to save for later, click the heart icon on any resource card.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarks.map((resource) => (
                        <ResourceCard key={resource.id} resource={resource} />
                    ))}
                </div>
            )}
        </div>
    );
}

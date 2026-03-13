import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiService } from '../../services/ai';
import LoadingSpinner from '../common/LoadingSpinner';
import { MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function AISearch() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [aiUnderstanding, setAiUnderstanding] = useState(null);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setResults([]);
        setAiUnderstanding(null);

        try {
            const response = await aiService.smartSearch(query);
            console.log(response);
            setResults(response.results || []);
            setAiUnderstanding(response.ai_understanding);

            if (response.results?.length === 0) {
                toast.info('No resources found. Try a different search.');
            }
        } catch (error) {
            toast.error('Search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="space-y-6">
            {/* Search Header */}
            <div className="text-center py-8">
                <div className="inline-flex p-4 bg-gradient-to-br from-purple-100 to-primary-100 dark:from-purple-900/30 dark:to-primary-900/30 rounded-3xl mb-6 shadow-inner">
                    <SparklesIcon className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 tracking-tight mb-4 drop-shadow-sm">
                    AI-Powered Smart Search
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 font-medium max-w-xl mx-auto">
                    Describe what you're looking for in natural language, and let EMEAHub AI find the exact resources.
                </p>
            </div>

            {/* Search Input */}
            <div className="max-w-3xl mx-auto px-4 sm:px-0">
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-purple-400 rounded-2xl blur-md opacity-25 group-hover:opacity-40 transition duration-500"></div>
                    <div className="relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700/50 rounded-2xl shadow-xl flex items-center">
                        <MagnifyingGlassIcon className="absolute left-5 h-6 w-6 text-primary-400/70" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="e.g., 'Show me data structures notes for semester 3'"
                            className="w-full pl-14 pr-32 py-5 text-lg bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 font-medium"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={loading || !query.trim()}
                            className="absolute right-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold rounded-xl shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <LoadingSpinner size="sm" /> : 'Search'}
                        </button>
                    </div>
                </div>

                {/* Example queries */}
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    <button
                        onClick={() => setQuery('Show me notes for computer science semester 3')}
                        className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full hover:bg-gray-200"
                    >
                        📚 CS Sem 3 notes
                    </button>
                    <button
                        onClick={() => setQuery('Find previous year question papers for DBMS')}
                        className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full hover:bg-gray-200"
                    >
                        📄 DBMS PYQs
                    </button>
                    <button
                        onClick={() => setQuery('Explain binary trees with examples')}
                        className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full hover:bg-gray-200"
                    >
                        🌲 Binary trees
                    </button>
                </div>
            </div>

            {/* AI Understanding */}
            {aiUnderstanding && (
                <div className="max-w-2xl mx-auto bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                        🤖 AI understood:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(aiUnderstanding).map(([key, value]) => (
                            value && (
                                <span
                                    key={key}
                                    className="text-xs bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded"
                                >
                                    {key}: {value}
                                </span>
                            )
                        ))}
                    </div>
                </div>
            )}

            {/* Search Results */}
            {results.length > 0 && (
                <div className="max-w-4xl mx-auto mt-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Search Results ({results.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results.map((resource) => (
                            <div
                                key={resource.id}
                                onClick={() => navigate(`/resources/${resource.id}`)}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition-shadow"
                            >
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                    {resource.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    {resource.description}
                                </p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="badge badge-info">{resource.type}</span>
                                    <span className="text-gray-500">Sem {resource.semester}</span>
                                    <span className="text-yellow-500">⭐ {resource.rating_avg}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
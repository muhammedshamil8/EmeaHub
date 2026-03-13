import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import API from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { SparklesIcon, BookOpenIcon, ArrowRightIcon, StarIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export default function AIRecommendPage() {
  const [loading, setLoading] = useState(true);
  const [reasoning, setReasoning] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await API.post("/ai/recommend");
      if (response.data.success) {
        setRecommendations(response.data.recommendations);
        setReasoning(response.data.reasoning);
      }
    } catch (error) {
      console.error("Recommendations error", error);
      toast.error("Failed to fetch personal recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl mb-4">
          <StarIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
          AI Smart Recommendations
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Personalized resource suggestions based on your department, recent downloads, and academic interests.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-500 dark:text-gray-400 animate-pulse">Analyzing your activity...</p>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="space-y-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 p-4 rounded-2xl flex items-start space-x-3">
            <SparklesIcon className="w-6 h-6 text-indigo-500 shrink-0 mt-0.5" />
            <p className="text-sm text-indigo-800 dark:text-indigo-300 italic font-medium">
              "{reasoning}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((resource) => (
              <Link 
                key={resource.id} 
                to={`/resources/${resource.id}`}
                className="group relative bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-primary-500/30 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-colors">
                    <BookOpenIcon className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-primary-500 transition-colors" />
                  </div>
                  <div className="flex items-center space-x-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full text-xs font-bold">
                    <StarIcon className="w-3.5 h-3.5 fill-current" />
                    <span>{parseFloat(resource.rating_avg || 0).toFixed(1)}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {resource.title}
                </h3>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2 mb-4">
                  <span className="uppercase font-bold tracking-wider text-[10px] bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                    {resource.type}
                  </span>
                  <span>•</span>
                  <span className="truncate">{resource.subject?.name}</span>
                </div>

                <div className="flex items-center text-primary-600 dark:text-primary-400 text-sm font-bold opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
                  View Resource <ArrowRightIcon className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
          
          <button 
            onClick={fetchRecommendations}
            className="w-full py-4 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors"
          >
            Refresh Recommendations
          </button>
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
          <ExclamationCircleIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No recommendations yet</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-2">
            Download or view more resources to help our AI learn your academic preferences.
          </p>
        </div>
      )}
    </div>
  );
}

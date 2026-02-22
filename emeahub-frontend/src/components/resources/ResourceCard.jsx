import { Link } from 'react-router-dom';
import { 
    DocumentTextIcon, 
    ArrowDownTrayIcon, 
    StarIcon,
    EyeIcon 
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function ResourceCard({ resource }) {
    const getTypeColor = (type) => {
        const colors = {
            note: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            pyq: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            syllabus: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            timetable: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        };
        return colors[type] || colors.other;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getTypeColor(resource.type)}`}>
                        {resource.type.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        Sem {resource.semester}
                    </span>
                </div>

                {/* Title & Description */}
                <Link to={`/resources/${resource.id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400">
                        {resource.title}
                    </h3>
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {resource.description}
                </p>

                {/* Subject & Department */}
                <div className="mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {resource.subject} • {resource.department}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Uploaded by {resource.uploaded_by}
                    </p>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                            <span>{resource.download_count}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <EyeIcon className="h-4 w-4 mr-1" />
                            <span>{resource.view_count}</span>
                        </div>
                        <div className="flex items-center text-yellow-500">
                            {resource.rating_avg > 0 ? (
                                <>
                                    <StarIconSolid className="h-4 w-4 mr-1" />
                                    <span>{resource.rating_avg}</span>
                                </>
                            ) : (
                                <>
                                    <StarIcon className="h-4 w-4 mr-1" />
                                    <span>0</span>
                                </>
                            )}
                        </div>
                    </div>
                    <Link
                        to={`/resources/${resource.id}`}
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium"
                    >
                        View →
                    </Link>
                </div>
            </div>
        </div>
    );
}
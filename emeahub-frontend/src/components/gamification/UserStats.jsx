import { getBadgeColor } from '../../utils/helpers';
import { 
    ChartBarIcon, 
    ArrowUpIcon,
    DocumentTextIcon,
    StarIcon,
    CheckBadgeIcon
} from '@heroicons/react/24/outline';

export default function UserStats({ stats }) {
    const statCards = [
        {
            title: 'Total Points',
            value: stats.total_points,
            icon: ChartBarIcon,
            color: 'bg-blue-100 text-blue-600',
            change: stats.points_change
        },
        {
            title: 'Uploads',
            value: stats.uploads,
            icon: DocumentTextIcon,
            color: 'bg-green-100 text-green-600',
            change: stats.uploads_change
        },
        {
            title: 'Verifications',
            value: stats.verifications,
            icon: CheckBadgeIcon,
            color: 'bg-purple-100 text-purple-600',
            change: stats.verifications_change
        },
        {
            title: 'Avg Rating',
            value: (stats.avg_rating || 0).toFixed(1),
            icon: StarIcon,
            color: 'bg-yellow-100 text-yellow-600',
            change: stats.rating_change
        }
    ];

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl shadow-primary-500/20 relative overflow-hidden backdrop-blur-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm opacity-90 mb-1">Your Rank</p>
                        <p className="text-3xl font-bold">#{stats.rank}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm opacity-90 mb-1">Badge</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor(stats.badge)}`}>
                            {stats.badge}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card) => (
                    <div key={card.title} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg ${card.color}`}>
                                <card.icon className="h-6 w-6" />
                            </div>
                            {card.change && (
                                <div className="flex items-center text-green-600 text-sm">
                                    <ArrowUpIcon className="h-4 w-4" />
                                    <span>{card.change}%</span>
                                </div>
                            )}
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            {card.value}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {card.title}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
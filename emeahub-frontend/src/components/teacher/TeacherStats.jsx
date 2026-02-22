import { useState, useEffect } from 'react';
import { gamificationService } from '../../services/gamification';
import LoadingSpinner from '../common/LoadingSpinner';
import {
    ChartBarIcon,
    DocumentTextIcon,
    CheckBadgeIcon,
    ClockIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

export default function TeacherStats() {
    const [stats, setStats] = useState(null);
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [statsRes, contributionsRes] = await Promise.all([
                gamificationService.getTeacherStats(),
                gamificationService.getTeacherContributions()
            ]);
            setStats(statsRes.data.stats);
            setContributions(contributionsRes.data.contributions);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    const summaryCards = [
        {
            title: 'Total Uploads',
            value: stats.total_uploads,
            icon: DocumentTextIcon,
            color: 'bg-blue-100 text-blue-600',
            trend: '+12%'
        },
        {
            title: 'Verifications Done',
            value: stats.verifications_done,
            icon: CheckBadgeIcon,
            color: 'bg-green-100 text-green-600',
            trend: '+8%'
        },
        {
            title: 'Pending Reviews',
            value: stats.pending_reviews,
            icon: ClockIcon,
            color: 'bg-yellow-100 text-yellow-600',
            trend: '-3%'
        },
        {
            title: 'Impact Score',
            value: stats.impact_score,
            icon: ChartBarIcon,
            color: 'bg-purple-100 text-purple-600',
            trend: '+15%'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {summaryCards.map((card) => (
                    <div key={card.title} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg ${card.color}`}>
                                <card.icon className="h-6 w-6" />
                            </div>
                            <span className="flex items-center text-green-600 text-sm">
                                <ArrowTrendingUpIcon className="h-4 w-4" />
                                {card.trend}
                            </span>
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

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Verification Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Verification Stats
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600 dark:text-gray-400">Approval Rate</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {stats.approval_rate}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-green-600 h-2 rounded-full"
                                    style={{ width: `${stats.approval_rate}%` }}
                                ></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600 dark:text-gray-400">Average Response Time</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {stats.avg_response_time}h
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="text-xl font-bold text-green-600">
                                    {stats.verified_count}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">Verified</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="text-xl font-bold text-red-600">
                                    {stats.rejected_count}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">Rejected</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upload Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Upload Stats
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="text-xl font-bold text-blue-600">
                                    {stats.total_uploads}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="text-xl font-bold text-purple-600">
                                    {stats.active_uploads}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">Active</div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600 dark:text-gray-400">Downloads</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {stats.total_downloads}
                                </span>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600 dark:text-gray-400">Average Rating</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {stats.avg_rating} ⭐
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contribution Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Contribution Timeline
                </h3>
                <div className="space-y-4">
                    {contributions.map((contribution, index) => (
                        <div key={index} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary-600"></div>
                            <div className="flex-1">
                                <p className="text-gray-900 dark:text-white">
                                    {contribution.description}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {contribution.date} • +{contribution.points} points
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
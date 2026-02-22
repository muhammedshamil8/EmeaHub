import { useState, useEffect } from 'react';
import { gamificationService } from '../../services/gamification';
import { getBadgeColor } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import { TrophyIcon, UserIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function Leaderboard() {
    const [leaders, setLeaders] = useState([]);
    const [type, setType] = useState('points');
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchLeaderboard();
    }, [type, pagination.currentPage]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const response = await gamificationService.getLeaderboard(type, pagination.currentPage);
            setLeaders(response.data.leaderboard.data);
            setPagination({
                currentPage: response.data.leaderboard.current_page,
                lastPage: response.data.leaderboard.last_page
            });
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    const tabs = [
        { id: 'points', label: 'Top Points' },
        { id: 'uploads', label: 'Top Uploaders' },
        { id: 'verifications', label: 'Top Verifiers' }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
                <TrophyIcon className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Leaderboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Top contributors in the EMEAHub community
                </p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center space-x-2 bg-white dark:bg-gray-800 p-1 rounded-lg shadow">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setType(tab.id);
                            setPagination({ ...pagination, currentPage: 1 });
                        }}
                        className={`px-4 py-2 rounded-md transition-colors ${
                            type === tab.id
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Leaderboard Table */}
            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Rank
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Department
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Points
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Uploads
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Verifications
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Badge
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {leaders.map((leader) => (
                                <tr 
                                    key={leader.rank}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                    onClick={() => navigate(`/profile/${leader.id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-lg font-semibold">
                                            {getRankIcon(leader.rank)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                                                <UserIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {leader.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {leader.department}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                                        {leader.points}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {leader.uploads}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {leader.verifications}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getBadgeColor(leader.badge)}`}>
                                            {leader.badge}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {pagination.lastPage > 1 && (
                        <div className="flex justify-center space-x-2 py-4">
                            <button
                                onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
                                disabled={pagination.currentPage === 1}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2">
                                Page {pagination.currentPage} of {pagination.lastPage}
                            </span>
                            <button
                                onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
                                disabled={pagination.currentPage === pagination.lastPage}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
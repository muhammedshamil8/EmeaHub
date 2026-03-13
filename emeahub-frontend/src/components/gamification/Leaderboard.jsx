import { useState, useEffect } from 'react';
import { gamificationService } from '../../services/gamification';
import { getBadgeColor } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import { TrophyIcon, UserIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function Leaderboard() {
    const [leaders, setLeaders] = useState([]);
    const [type] = useState('points');
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



    return (
        <div className="max-w-5xl mx-auto space-y-10 py-10 animate-in fade-in duration-700">
            {/* Premium Header */}
          <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-primary-900 shadow-2xl p-10 sm:p-20 text-center">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                
                <div className="relative z-10">
                    <div className="inline-flex items-center justify-center p-5 bg-white/10 backdrop-blur-xl rounded-[2rem] mb-8 border border-white/20 shadow-2xl">
                        <TrophyIcon className="h-12 w-12 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 drop-shadow-2xl">
                        Global Elite
                    </h1>
                    <p className="text-purple-100/80 text-lg font-bold max-w-2xl mx-auto uppercase tracking-widest leading-relaxed">
                        Top contributors and academic leaders of EMEA community
                    </p>
                </div>
            </div>

            {/* Leaderboard Table Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="h-16 w-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Crunching rankings...</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Rank</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Contributor</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Dept</th>
                                    <th className="px-8 py-6 text-center text-[10px] font-black text-primary-500 uppercase tracking-widest">Points</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Impact</th>
                                    <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                                {leaders.map((leader) => (
                                    <tr
                                        key={leader.rank}
                                        className="group cursor-pointer hover:bg-gray-50/80 dark:hover:bg-gray-800/80 transition-all duration-300"
                                        onClick={() => navigate(`/profile/${leader.id}`)}
                                    >
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className={`flex items-center justify-center w-12 h-12 rounded-2xl font-black text-lg shadow-sm border ${
                                                leader.rank === 1 ? 'bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-900/20' :
                                                leader.rank === 2 ? 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-900/20' :
                                                leader.rank === 3 ? 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20' :
                                                'bg-gray-50 text-gray-400 border-gray-100 dark:bg-gray-900/20 dark:border-gray-700'
                                            }`}>
                                                {getRankIcon(leader.rank)}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-11 w-11 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-xl shadow-gray-200 dark:shadow-none group-hover:scale-110 transition-transform ${
                                                    leader.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                                                    leader.rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-500' :
                                                    leader.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                                                    'bg-gradient-to-br from-primary-500 to-indigo-600'
                                                }`}>
                                                    {leader.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-primary-600 transition-colors">
                                                        {leader.name}
                                                    </div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                                        Member since {new Date().getFullYear()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-gray-900/50 px-3 py-1 rounded-lg">
                                                {leader.department || 'GENERAL'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-center">
                                            <div className="inline-flex flex-col">
                                                <span className="text-xl font-black text-primary-600 dark:text-primary-400">
                                                    {leader.points.toLocaleString()}
                                                </span>
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Reputation</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-6">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-gray-900 dark:text-white">{leader.uploads}</span>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Files</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-gray-900 dark:text-white">{leader.verifications || 0}</span>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Checks</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-right">
                                            <span className={`px-4 py-1.5 text-[9px] font-black rounded-xl uppercase tracking-widest border-2 ${getBadgeColor(leader.badge)}`}>
                                                {leader.badge}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.lastPage > 1 && (
                        <div className="flex justify-between items-center px-10 py-8 bg-gray-50/30 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-700/50">
                            <button
                                onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
                                disabled={pagination.currentPage === 1}
                                className="px-8 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/50 rounded-2xl font-black text-[10px] uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
                            >
                                Previous
                            </button>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                                Page <span className="text-primary-600">{pagination.currentPage}</span> / {pagination.lastPage}
                            </span>
                            <button
                                onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
                                disabled={pagination.currentPage === pagination.lastPage}
                                className="px-8 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/50 rounded-2xl font-black text-[10px] uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
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
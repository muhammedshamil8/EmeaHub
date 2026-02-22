import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { gamificationService } from '../../services/gamification';
import LoadingSpinner from '../common/LoadingSpinner';
import { TrophyIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { TrophyIcon as TrophyIconSolid } from '@heroicons/react/24/solid';

export default function Achievements() {
    const { user } = useAuth();
    const [achievements, setAchievements] = useState([]);
    const [userAchievements, setUserAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const [allRes, userRes] = await Promise.all([
                gamificationService.getAchievements(),
                gamificationService.getUserAchievements()
            ]);
            setAchievements(allRes.data.achievements);
            setUserAchievements(userRes.data.achievements);
        } catch (error) {
            console.error('Failed to fetch achievements:', error);
        } finally {
            setLoading(false);
        }
    };

    const isAchievementUnlocked = (achievementId) => {
        return userAchievements.some(ua => ua.id === achievementId);
    };

    const getProgress = (achievement) => {
        if (!user) return 0;
        
        if (achievement.points_required) {
            return Math.min((user.reputation_points / achievement.points_required) * 100, 100);
        }
        if (achievement.uploads_required) {
            return Math.min((user.total_uploads / achievement.uploads_required) * 100, 100);
        }
        return 0;
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
                <TrophyIcon className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Achievements
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Unlock achievements by contributing to the community
                </p>
            </div>

            {/* Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                            {userAchievements.length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Achievements Unlocked
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                            {achievements.length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Total Achievements
                        </div>
                    </div>
                </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement) => {
                    const unlocked = isAchievementUnlocked(achievement.id);
                    const progress = getProgress(achievement);

                    return (
                        <div
                            key={achievement.id}
                            className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-all ${
                                unlocked ? 'border-2 border-yellow-500' : ''
                            }`}
                        >
                            <div className="flex items-start space-x-4">
                                <div className={`p-3 rounded-lg ${
                                    unlocked 
                                        ? 'bg-yellow-100 dark:bg-yellow-900' 
                                        : 'bg-gray-100 dark:bg-gray-700'
                                }`}>
                                    {unlocked ? (
                                        <TrophyIconSolid className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                                    ) : (
                                        <LockClosedIcon className="h-8 w-8 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                        {achievement.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        {achievement.description}
                                    </p>

                                    {/* Progress Bar */}
                                    {!unlocked && progress > 0 && (
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span>Progress</span>
                                                <span>{Math.round(progress)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Requirement Info */}
                                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                                        {achievement.points_required && (
                                            <p>Requires {achievement.points_required} points</p>
                                        )}
                                        {achievement.uploads_required && (
                                            <p>Requires {achievement.uploads_required} uploads</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
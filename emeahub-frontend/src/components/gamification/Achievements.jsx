import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { gamificationService } from '../../services/gamification';
import LoadingSpinner from '../common/LoadingSpinner';
import { TrophyIcon, LockClosedIcon, StarIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { TrophyIcon as TrophyIconSolid } from '@heroicons/react/24/solid';
import { StaggerContainer, StaggerItem, FadeIn } from '../common/MotionContainer';

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
        <div className="max-w-5xl mx-auto space-y-12 pb-20">
            {/* Cinematic Header */}
            <FadeIn>
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-3xl mb-4 shadow-inner animate-bounce">
                        <TrophyIconSolid className="h-12 w-12 text-yellow-500 shadow-yellow-500/20" />
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter uppercase leading-none">
                        Badge <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600">Gallery</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest text-sm">
                        Total Unlocked: {userAchievements.length} / {achievements.length}
                    </p>
                </div>
            </FadeIn>

            {/* Achievement Inventory */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement) => {
                    const unlocked = isAchievementUnlocked(achievement.id);
                    const progress = getProgress(achievement);

                    return (
                        <StaggerItem key={achievement.id}>
                            <div
                                className={`group relative bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 transition-all duration-500 border-2 ${
                                    unlocked 
                                        ? 'border-yellow-400 shadow-2xl shadow-yellow-500/10' 
                                        : 'border-transparent bg-gray-50/50 dark:bg-gray-800/50'
                                }`}
                            >
                                {unlocked && (
                                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-pulse ring-4 ring-white dark:ring-gray-800">
                                        <SparklesIcon className="w-5 h-5 text-white" />
                                    </div>
                                )}

                                <div className="flex items-start space-x-6">
                                    <div className={`flex-shrink-0 w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${
                                        unlocked 
                                            ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg' 
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                                    }`}>
                                        {unlocked ? (
                                            <TrophyIconSolid className="h-10 w-10" />
                                        ) : (
                                            <LockClosedIcon className="h-10 w-10" />
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                                {achievement.name}
                                            </h3>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
                                                {achievement.description}
                                            </p>
                                        </div>

                                        {/* Cinematic Progress Bar */}
                                        {!unlocked && (
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                    <span>Progression</span>
                                                    <span>{Math.round(progress)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner p-0.5">
                                                    <div 
                                                        className="bg-gradient-to-r from-primary-600 to-primary-400 h-full rounded-full transition-all duration-1000 ease-out"
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Badge Requirement */}
                                        <div className="flex items-center space-x-2 pt-2">
                                            <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                {achievement.points_required ? `${achievement.points_required} Points` : `${achievement.uploads_required} Uploads`}
                                            </div>
                                            {unlocked && (
                                                <div className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-[10px] font-black uppercase tracking-widest text-yellow-600">
                                                    Equipped
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </StaggerItem>
                    );
                })}
            </StaggerContainer>

            {/* Bottom Reward Info */}
            <FadeIn delay={0.5}>
                <div className="bg-gradient-to-br from-primary-600 to-indigo-700 p-10 sm:p-16 rounded-[4rem] text-center text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mt-32 -mr-32 group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className="relative z-10 space-y-6">
                        <StarIcon className="h-16 w-16 mx-auto text-yellow-400 animate-spin-slow" />
                        <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter">
                            Prestige Matters
                        </h2>
                        <p className="text-primary-100 max-w-xl mx-auto font-medium text-lg leading-relaxed">
                            Every badge you earn increases your profile's authority. High-prestige users get featured on the community spotlight.
                        </p>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}
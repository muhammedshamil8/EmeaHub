import { useState } from 'react';
// import { useAuth } from '../../hooks/useAuth';
import { useAuth } from '../../context/AuthContext';
import { aiService } from '../../services/ai';
import API from '../../services/api';
import { useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import CustomSelect from '../common/CustomSelect';

export default function StudyPlanner() {
    const { isAuthenticated } = useAuth();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [plan, setPlan] = useState(null);
    const [formData, setFormData] = useState({
        subject_id: '',
        hours_per_day: 2,
        exam_date: ''
    });

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const response = await API.get('/subjects/by-department', {
                params: { department_id: 1, semester: 3 } // Default values
            });
            setSubjects(response.data.subjects);
        } catch (error) {
            toast.error('Failed to fetch subjects');
        }
    };

    const handleGenerate = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to generate study plan');
            return;
        }

        if (!formData.subject_id || !formData.exam_date) {
            toast.error('Please select subject and exam date');
            return;
        }

        setGenerating(true);
        try {
            const response = await aiService.generateStudyPlan(
                formData.subject_id,
                formData.hours_per_day,
                formData.exam_date
            );
            setPlan(response.data.plan);
            toast.success('Study plan generated!');
        } catch (error) {
            toast.error('Failed to generate study plan');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-6">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-3xl mb-6 shadow-inner">
                    <AcademicCapIcon className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 tracking-tight mb-4 drop-shadow-sm">
                    AI Study Planner
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                    Let EMEAHub's AI create a personalized, optimized study schedule for your upcoming exams.
                </p>
            </div>

            {/* Input Form */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Subject</label>
                        <CustomSelect
                            value={formData.subject_id}
                            onChange={(val) => setFormData({...formData, subject_id: val})}
                            options={subjects.map(subject => ({ value: subject.id, label: subject.name }))}
                            placeholder="Choose a subject"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Study Hours per Day</label>
                        <div className="relative group">
                            <ClockIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                            <input
                                type="number"
                                min="1"
                                max="8"
                                value={formData.hours_per_day}
                                onChange={(e) => setFormData({...formData, hours_per_day: parseInt(e.target.value)})}
                                className="w-full px-5 py-3.5 pl-12 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 shadow-sm font-medium"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Target Exam Date</label>
                        <div className="relative group">
                            <CalendarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                            <input
                                type="date"
                                value={formData.exam_date}
                                onChange={(e) => setFormData({...formData, exam_date: e.target.value})}
                                className="w-full px-5 py-3.5 pl-12 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 shadow-sm font-medium"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="w-full mt-8 inline-flex justify-center items-center px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {generating ? <LoadingSpinner size="sm" /> : 'Generate My Study Plan'}
                </button>
            </div>

            {/* Generated Plan */}
            {plan && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 p-8 space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                        <AcademicCapIcon className="h-6 w-6 mr-3 text-emerald-500" />
                        Your Personalized Study Plan
                    </h2>

                    {plan.daily_schedule && (
                        <div className="space-y-6">
                            {Object.entries(plan.daily_schedule).map(([day, topics]) => (
                                <div key={day} className="border-l-4 border-emerald-500 pl-5 py-1 bg-gray-50/50 dark:bg-gray-900/30 rounded-r-2xl">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">
                                        Day {day}
                                    </h3>
                                    <ul className="space-y-2">
                                        {topics.map((topic, index) => (
                                            <li key={index} className="text-[15px] text-gray-600 dark:text-gray-400 flex items-start">
                                                <span className="text-emerald-500 mr-2 mt-0.5">•</span>
                                                {topic}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}

                    {plan.tips && (
                        <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                            <h4 className="font-bold text-lg text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                                <SparklesIcon className="h-5 w-5 mr-2" />
                                Study Tips for Success
                            </h4>
                            <ul className="space-y-2">
                                {plan.tips.map((tip, index) => (
                                    <li key={index} className="text-[15px] font-medium text-blue-900/80 dark:text-blue-200/90 flex items-start">
                                        <span className="text-blue-500 dark:text-blue-400 mr-2 mt-0.5">→</span>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
import { useState } from 'react';
// import { useAuth } from '../../hooks/useAuth';
import { useAuth } from '../../context/AuthContext';
import { aiService } from '../../services/ai';
import API from '../../services/api';
import { useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import { CalendarIcon, ClockIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

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
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex p-3 bg-green-100 rounded-full mb-4">
                    <AcademicCapIcon className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    AI Study Planner
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Create a personalized study plan with AI
                </p>
            </div>

            {/* Input Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="input-label">Select Subject</label>
                        <select
                            value={formData.subject_id}
                            onChange={(e) => setFormData({...formData, subject_id: e.target.value})}
                            className="input-field"
                        >
                            <option value="">Choose a subject</option>
                            {subjects.map(subject => (
                                <option key={subject.id} value={subject.id}>
                                    {subject.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="input-label">Hours per Day</label>
                        <div className="relative">
                            <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="number"
                                min="1"
                                max="8"
                                value={formData.hours_per_day}
                                onChange={(e) => setFormData({...formData, hours_per_day: parseInt(e.target.value)})}
                                className="input-field pl-10"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="input-label">Exam Date</label>
                        <div className="relative">
                            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="date"
                                value={formData.exam_date}
                                onChange={(e) => setFormData({...formData, exam_date: e.target.value})}
                                className="input-field pl-10"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="btn-primary w-full mt-4"
                >
                    {generating ? <LoadingSpinner size="sm" /> : 'Generate Study Plan'}
                </button>
            </div>

            {/* Generated Plan */}
            {plan && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Your Personalized Study Plan
                    </h2>

                    {plan.daily_schedule && (
                        <div className="space-y-4">
                            {Object.entries(plan.daily_schedule).map(([day, topics]) => (
                                <div key={day} className="border-l-4 border-primary-500 pl-4">
                                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                        Day {day}
                                    </h3>
                                    <ul className="space-y-1">
                                        {topics.map((topic, index) => (
                                            <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                                                • {topic}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}

                    {plan.tips && (
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                                Study Tips
                            </h4>
                            <ul className="space-y-1">
                                {plan.tips.map((tip, index) => (
                                    <li key={index} className="text-sm text-blue-700 dark:text-blue-300">
                                        • {tip}
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
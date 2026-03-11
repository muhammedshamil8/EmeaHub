import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/helpers';
import { 
    UserIcon, 
    EnvelopeIcon, 
    AcademicCapIcon,
    IdentificationIcon,
    ChartBarIcon 
} from '@heroicons/react/24/outline';

export default function Profile() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        department: user?.department || '',
        semester: user?.semester || ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        // API call to update profile
        setIsEditing(false);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden relative">
                <div className="bg-gradient-to-br from-primary-600 via-purple-600 to-purple-800 h-48 relative overflow-hidden"></div>
                <div className="px-8 pb-8">
                    <div className="flex justify-end -mt-16 mb-4">
                        <div className="h-32 w-32 rounded-full bg-white dark:bg-gray-800 p-2 shadow-2xl relative z-10">
                            <div className="h-full w-full rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-inner">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {user?.name}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Member since {formatDate(user?.created_at)}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="inline-flex justify-center items-center px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow transition-all duration-300"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Profile Info */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                    Profile Information
                </h2>
                
                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400"
                                disabled
                            />
                        </div>

                        {user?.role === 'student' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Department
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.department}
                                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Semester
                                    </label>
                                    <select
                                        value={formData.semester}
                                        onChange={(e) => setFormData({...formData, semester: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400"
                                    >
                                        {[1,2,3,4,5,6,7,8].map(sem => (
                                            <option key={sem} value={sem}>Semester {sem}</option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        <div className="flex space-x-3 pt-4">
                            <button type="submit" className="inline-flex justify-center items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="inline-flex justify-center items-center px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow transition-all duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Full Name</p>
                                <p className="text-gray-900 dark:text-white">{user?.name}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-gray-900 dark:text-white">{user?.email}</p>
                            </div>
                        </div>

                        {user?.role === 'student' && (
                            <>
                                <div className="flex items-center space-x-3">
                                    <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Department</p>
                                        <p className="text-gray-900 dark:text-white">{user?.department}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <IdentificationIcon className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Enrollment No.</p>
                                        <p className="text-gray-900 dark:text-white">{user?.enrollment_no}</p>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="flex items-center space-x-3">
                            <ChartBarIcon className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Reputation Points</p>
                                <p className="text-gray-900 dark:text-white">{user?.reputation_points}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Account Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                    Account Statistics
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-6 bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                            {user?.total_uploads || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Uploads</div>
                    </div>
                    <div className="text-center p-6 bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                            {user?.total_downloads || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Downloads</div>
                    </div>
                    <div className="text-center p-6 bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                            {user?.total_ratings || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Ratings Given</div>
                    </div>
                    <div className="text-center p-6 bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                            {user?.reputation_points || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Points</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
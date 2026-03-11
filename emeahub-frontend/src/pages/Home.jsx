import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    BookOpenIcon, 
    TrophyIcon, 
    UserGroupIcon, 
    CloudArrowUpIcon,
    AcademicCapIcon,
    ChartBarIcon 
} from '@heroicons/react/24/outline';

export default function Home() {
    const { isAuthenticated } = useAuth();

    const features = [
        {
            name: 'Study Resources',
            description: 'Access notes, PYQs, syllabus and more for all semesters',
            icon: BookOpenIcon,
            color: 'bg-blue-100 text-blue-600'
        },
        {
            name: 'Leaderboard',
            description: 'Compete with peers and earn recognition for contributions',
            icon: TrophyIcon,
            color: 'bg-yellow-100 text-yellow-600'
        },
        {
            name: 'Community Driven',
            description: 'Upload and verify resources to help fellow students',
            icon: UserGroupIcon,
            color: 'bg-green-100 text-green-600'
        },
        {
            name: 'Easy Upload',
            description: 'Share your study materials with just a few clicks',
            icon: CloudArrowUpIcon,
            color: 'bg-purple-100 text-purple-600'
        },
    ];

    const stats = [
        { label: 'Study Resources', value: '1000+' },
        { label: 'Active Students', value: '500+' },
        { label: 'Verified Teachers', value: '50+' },
        { label: 'Daily Downloads', value: '200+' },
    ];

    return (
        <div className="space-y-0">
            {/* Hero Section */}
            <section className="relative py-32 overflow-hidden flex items-center justify-center min-h-[80vh]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-200/40 via-blue-100/20 to-transparent dark:from-primary-900/40 dark:via-gray-900 dark:to-black -z-10"></div>
                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white mb-8 tracking-tight drop-shadow-sm">
                        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400">EMEAHub</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
                        Your one-stop platform for FYUGP study materials. Access, share, and verify academic resources with ease.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <Link
                            to="/resources"
                            className="inline-flex justify-center items-center px-8 py-4 text-lg bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-semibold rounded-2xl shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                        >
                            Browse Resources
                        </Link>
                        {!isAuthenticated && (
                            <Link
                                to="/register"
                                className="inline-flex justify-center items-center px-8 py-4 text-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-900 dark:text-white font-semibold rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                            >
                                Get Started
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="container mx-auto px-4 -mt-16 relative z-20 mb-24">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50 hover:-translate-y-1 transition-transform duration-300">
                            <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 mb-2 drop-shadow-sm">
                                {stat.value}
                            </div>
                            <div className="text-sm md:text-base font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white dark:bg-gray-900/50 relative overflow-hidden">
                <div className="container mx-auto px-4 max-w-6xl">
                    <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
                        Why Choose EMEAHub?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature) => (
                            <div key={feature.name} className="text-center group bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-8 hover:bg-white dark:hover:bg-gray-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 dark:border-gray-700/50">
                                <div className={`inline-flex p-5 rounded-2xl ${feature.color} mb-6 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                    <feature.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                                    {feature.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-gray-50/50 dark:bg-gray-900/30">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
                        How It Works
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                step: '1',
                                title: 'Sign Up',
                                description: 'Create your account as a student or teacher',
                                icon: AcademicCapIcon
                            },
                            {
                                step: '2',
                                title: 'Browse or Upload',
                                description: 'Find resources or share your study materials',
                                icon: BookOpenIcon
                            },
                            {
                                step: '3',
                                title: 'Earn Recognition',
                                description: 'Get points and climb the leaderboard',
                                icon: ChartBarIcon
                            }
                        ].map((item) => (
                            <div key={item.step} className="relative text-center group">
                                <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-primary-500/10 border border-primary-100 dark:border-primary-900/50 flex items-center justify-center mx-auto mb-6 group-hover:-translate-y-2 transition-transform duration-300 rotate-3 group-hover:rotate-6">
                                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 -rotate-3 group-hover:-rotate-6 transition-transform duration-300">
                                        {item.step}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {!isAuthenticated && (
                <section className="py-20 mx-4 md:mx-auto max-w-6xl mb-20 bg-gradient-to-br from-primary-600 via-purple-600 to-primary-800 rounded-[3rem] text-white shadow-2xl shadow-primary-500/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                    <div className="relative z-10 text-center px-4">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Ready to Get Started?</h2>
                        <p className="text-xl mb-10 text-primary-100 font-medium">
                            Join thousands of students already using EMEAHub
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <Link
                                to="/register"
                                className="inline-flex justify-center items-center bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                            >
                                Sign Up Now
                            </Link>
                            <Link
                                to="/register/teacher"
                                className="inline-flex justify-center items-center border-[1.5px] border-white/50 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-gray-900 transition-all duration-300 w-full sm:w-auto"
                            >
                                Register as Teacher
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
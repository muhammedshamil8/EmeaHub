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
        <div className="space-y-20">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 -z-10"></div>
                <div className="relative z-10 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                        Welcome to <span className="text-primary-600 dark:text-primary-400">EMEAHub</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
                        Your one-stop platform for FYUGP study materials. Access, share, and verify academic resources with ease.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link
                            to="/resources"
                            className="btn-primary text-lg px-8 py-3"
                        >
                            Browse Resources
                        </Link>
                        {!isAuthenticated && (
                            <Link
                                to="/register"
                                className="btn-secondary text-lg px-8 py-3"
                            >
                                Get Started
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                                {stat.value}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 bg-gray-50 dark:bg-gray-800 rounded-3xl">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
                        Why Choose EMEAHub?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature) => (
                            <div key={feature.name} className="text-center group">
                                <div className={`inline-flex p-4 rounded-2xl ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                    {feature.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
                        How It Works
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                            <div key={item.step} className="relative text-center">
                                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                        {item.step}
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {!isAuthenticated && (
                <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl text-white">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                        <p className="text-xl mb-8 opacity-90">
                            Join thousands of students already using EMEAHub
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link
                                to="/register"
                                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Sign Up Now
                            </Link>
                            <Link
                                to="/register/teacher"
                                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
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
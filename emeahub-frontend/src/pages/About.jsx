import { Link } from 'react-router-dom';
import { 
    HeartIcon, 
    AcademicCapIcon, 
    GlobeAltIcon,
    UsersIcon 
} from '@heroicons/react/24/outline';

export default function About() {
    const team = [
        {
            name: 'Dr. Sarah Johnson',
            role: 'Project Lead',
            bio: 'Associate Professor with 10+ years of experience in educational technology',
            image: 'https://i.pravatar.cc/150?img=1'
        },
        {
            name: 'Prof. Michael Chen',
            role: 'Technical Advisor',
            bio: 'Expert in full-stack development and cloud architecture',
            image: 'https://i.pravatar.cc/150?img=2'
        },
        {
            name: 'Emily Rodriguez',
            role: 'UI/UX Designer',
            bio: 'Passionate about creating intuitive learning experiences',
            image: 'https://i.pravatar.cc/150?img=3'
        }
    ];

    const values = [
        {
            title: 'Accessibility',
            description: 'Making quality education materials accessible to all students',
            icon: GlobeAltIcon
        },
        {
            title: 'Community',
            description: 'Building a collaborative learning environment',
            icon: UsersIcon
        },
        {
            title: 'Quality',
            description: 'Ensuring verified and reliable academic content',
            icon: HeartIcon
        },
        {
            title: 'Innovation',
            description: 'Leveraging technology to enhance learning',
            icon: AcademicCapIcon
        }
    ];

    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="text-center py-12">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    About <span className="text-primary-600 dark:text-primary-400">EMEAHub</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Empowering FYUGP students with a centralized platform for academic resources
                </p>
            </section>

            {/* Mission Section */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Our Mission
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        EMEAHub was created to solve the problem of scattered academic resources in FYUGP programs. 
                        We provide a structured, role-based platform where students can easily access verified study 
                        materials, teachers can share quality content, and the entire academic community can collaborate 
                        to ensure the best learning resources are available to everyone.
                    </p>
                </div>
            </section>

            {/* Values Section */}
            <section>
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
                    Our Core Values
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((value) => (
                        <div key={value.title} className="text-center">
                            <div className="inline-flex p-4 bg-primary-100 dark:bg-primary-900 rounded-2xl mb-4">
                                <value.icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {value.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Team Section */}
            <section>
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
                    Meet Our Team
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {team.map((member) => (
                        <div key={member.name} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                            <img 
                                src={member.image} 
                                alt={member.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-primary-600 dark:text-primary-400 mb-3">
                                    {member.role}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {member.bio}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white text-center">
                <h2 className="text-2xl font-bold mb-4">Join Our Growing Community</h2>
                <p className="text-lg mb-6 opacity-90">
                    Start accessing quality study materials today
                </p>
                <Link
                    to="/register"
                    className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                    Get Started
                </Link>
            </section>
        </div>
    );
}
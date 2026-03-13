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
        name: 'Shamil',
        role: 'Full Stack Developer',
        bio: 'Worked on backend architecture, API development and system integration for EMEAHub.',
        image: 'https://i.pravatar.cc/150?img=12'
    },
    {
        name: 'Shanil',
        role: 'Frontend Developer',
        bio: 'Focused on building responsive UI components and improving user experience across the platform.',
        image: 'https://i.pravatar.cc/150?img=13'
    },
    {
        name: 'Basil',
        role: 'Backend Developer',
        bio: 'Handled database structure, resource management logic and server-side functionality.',
        image: 'https://i.pravatar.cc/150?img=14'
    },
    {
        name: 'Farha',
        role: 'UI/UX & Documentation',
        bio: 'Worked on interface design, usability improvements and project documentation.',
        image: 'https://i.pravatar.cc/150?img=15'
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
           <div className="max-w-4xl mx-auto space-y-10">
            {/* Hero Section */}
            <section className="text-center py-16">
                <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-6 drop-shadow-sm">
                    About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400">EMEAHub</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light">
                    Empowering FYUGP students with a centralized platform for academic resources
                </p>
            </section>

            {/* Mission Section */}
            <section className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        Our Mission
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mx-auto">
                        EMEAHub was created to solve the problem of scattered academic resources in FYUGP programs. 
                        We provide a structured, role-based platform where students can easily access verified study 
                        materials, teachers can share quality content, and the entire academic community can collaborate 
                        to ensure the best learning resources are available to everyone.
                    </p>
                </div>
            </section>

            {/* Values Section */}
            <section>
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                    Our Core Values
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((value) => (
                        <div key={value.title} className="text-center bg-gray-50/50 dark:bg-gray-800/50 rounded-3xl p-8 hover:bg-white dark:hover:bg-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 dark:border-gray-700/50 group">
                            <div className="inline-flex p-5 bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/50 dark:to-purple-900/50 rounded-2xl mb-6 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                <value.icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                {value.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Team Section */}
            <section>
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                    Meet Our Team
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {team.map((member) => (
                        <div key={member.name} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:-translate-y-2 transition-transform duration-300 group">
                            <img 
                                src={member.image} 
                                alt={member.name}
                                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="p-8">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-primary-600 dark:text-primary-400 mb-4 font-medium">
                                    {member.role}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {member.bio}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-br from-primary-600 via-purple-600 to-primary-800 rounded-[3rem] p-16 text-white text-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl font-extrabold mb-6">Join Our Growing Community</h2>
                    <p className="text-xl mb-10 text-primary-100 font-medium">
                        Start accessing quality study materials today
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex justify-center items-center bg-white text-gray-900 px-10 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    >
                        Get Started
                    </Link>
                </div>
            </section>
        </div>
    );
}
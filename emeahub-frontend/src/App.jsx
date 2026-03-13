import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import { useAuth } from './context/AuthContext';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';
import FloatingAIBot from './components/common/FloatingAIBot';
import Breadcrumbs from './components/common/Breadcrumbs';

function App() {
    const { loading } = useAuth();
    const location = useLocation();

    const ShowFooter = location.pathname === '/' || location.pathname === '/about';

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <ErrorBoundary>
            <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                <Navbar />
                <main className="flex-grow mt-20 container mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full max-w-full overflow-x-hidden">
                    <Breadcrumbs />
                    <Outlet />
                </main>
                {ShowFooter && (
                    <Footer />
                )}
                <FloatingAIBot />
                <Toaster
                    position="top-center"
                    toastOptions={{
                        duration: 4000,
                        className: '!bg-white/90 dark:!bg-gray-800/90 !text-gray-900 dark:!text-white !backdrop-blur-md !border !border-gray-200 dark:!border-gray-700/50 !shadow-xl !rounded-2xl',
                        style: {
                            maxWidth: '500px',
                            padding: '16px 20px',
                            fontWeight: '500',
                            fontSize: '0.95rem'
                        },
                        success: {
                            duration: 3000,
                            iconTheme: {
                                primary: '#10b981', 
                                secondary: '#ffffff',
                            },
                        },
                        error: {
                            duration: 4000,
                            iconTheme: {
                                primary: '#ef4444', 
                                secondary: '#ffffff',
                            },
                        },
                    }}
                />
            </div>
        </ErrorBoundary>
    );
}

export default App;
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import BrowseResources from './pages/BrowseResources';
import ResourceView from './pages/ResourceView';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import About from './pages/About';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import TeacherRegister from './components/auth/TeacherRegister';
import PrivateRoute from './components/auth/PrivateRoute';

// Resource Components
import UploadResource from './components/resources/UploadResource';

// Teacher Components
import TeacherDashboard from './components/teacher/TeacherDashboard';
import PendingVerifications from './components/teacher/PendingVerifications';
import TimetableManager from './components/teacher/TimetableManager';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import ResourceManagement from './components/admin/ResourceManagement';
import DepartmentManager from './components/admin/DepartmentManager';

// Gamification Components
import Leaderboard from './components/gamification/Leaderboard';
import Achievements from './components/gamification/Achievements';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <Home /> },
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
            { path: 'register/teacher', element: <TeacherRegister /> },
            { path: 'about', element: <About /> },
            
            // Public Resource Routes
            { path: 'resources', element: <BrowseResources /> },
            { path: 'resources/:id', element: <ResourceView /> },
            
            // Public Gamification Routes
            { path: 'leaderboard', element: <Leaderboard /> },
            { path: 'achievements', element: <Achievements /> },
            
            // Protected Routes
            {
                element: <PrivateRoute />,
                children: [
                    { path: 'dashboard', element: <Dashboard /> },
                    { path: 'profile', element: <Profile /> },
                ]
            },
            
            // Student/Teacher Routes
            {
                element: <PrivateRoute allowedRoles={['student', 'teacher', 'admin']} />,
                children: [
                    { path: 'upload', element: <UploadResource /> },
                ]
            },
            
            // Teacher Routes
            {
                path: 'teacher',
                element: <PrivateRoute allowedRoles={['teacher', 'admin']} />,
                children: [
                    { path: 'dashboard', element: <TeacherDashboard /> },
                    { path: 'pending', element: <PendingVerifications /> },
                    { path: 'timetable', element: <TimetableManager /> },
                ]
            },
            
            // Admin Routes
            {
                path: 'admin',
                element: <PrivateRoute allowedRoles={['admin']} />,
                children: [
                    { path: 'dashboard', element: <AdminDashboard /> },
                    { path: 'users', element: <UserManagement /> },
                    { path: 'resources', element: <ResourceManagement /> },
                    { path: 'departments', element: <DepartmentManager /> },
                ]
            },
            
            // 404
            { path: '*', element: <Navigate to="/" replace /> }
        ]
    }
]);
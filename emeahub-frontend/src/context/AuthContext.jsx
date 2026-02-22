import { createContext, useState, useContext, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const response = await API.get('/me');
            setUser(response.data.user);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            localStorage.removeItem('token');
            setToken(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await API.post('/login', { email, password });
            const { token, user } = response.data;
            
            localStorage.setItem('token', token);
            setToken(token);
            setUser(user);
            
            toast.success('Login successful!');
            return { success: true, role: user.role };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return { success: false };
        }
    };

    const register = async (userData) => {
        try {
            await API.post('/register', userData);
            toast.success('Registration successful! Please login.');
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            return { success: false, errors: error.response?.data?.errors };
        }
    };

    const registerTeacher = async (teacherData) => {
        try {
            await API.post('/register/teacher', teacherData);
            toast.success('Teacher registration submitted! Awaiting admin approval.');
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            return { success: false };
        }
    };

    const logout = async () => {
        try {
            await API.post('/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            toast.success('Logged out successfully');
        }
    };

    const updateUser = (updatedData) => {
        setUser(prev => ({ ...prev, ...updatedData }));
    };

    const value = {
        user,
        loading,
        login,
        register,
        registerTeacher,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isStudent: user?.role === 'student',
        isTeacher: user?.role === 'teacher',
        isAdmin: user?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
// import { useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// };

// // Convenience hooks for role checking
// export const useIsStudent = () => {
//     const { user } = useAuth();
//     return user?.role === 'student';
// };

// export const useIsTeacher = () => {
//     const { user } = useAuth();
//     return user?.role === 'teacher';
// };

// export const useIsAdmin = () => {
//     const { user } = useAuth();
//     return user?.role === 'admin';
// };

// export const useIsAuthenticated = () => {
//     const { isAuthenticated } = useAuth();
//     return isAuthenticated;
// };
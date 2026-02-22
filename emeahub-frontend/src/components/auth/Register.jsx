import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

const schema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    password_confirmation: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
    department_id: yup.string().when('role', {
        is: 'student',
        then: () => yup.string().required('Department is required'),
        otherwise: () => yup.string().notRequired()
    }),
    enrollment_no: yup.string().when('role', {
        is: 'student',
        then: () => yup.string().required('Enrollment number is required'),
        otherwise: () => yup.string().notRequired()
    }),
    semester: yup.string().when('role', {
        is: 'student',
        then: () => yup.string().required('Semester is required'),
        otherwise: () => yup.string().notRequired()
    }),
    role: yup.string().oneOf(['student', 'public']).default('student')
});

export default function Register() {
    const navigate = useNavigate();
    const { register: registerUser } = useAuth();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showStudentFields, setShowStudentFields] = useState(true);

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            role: 'student'
        }
    });

    const selectedRole = watch('role');

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        setShowStudentFields(selectedRole === 'student');
    }, [selectedRole]);

    const fetchDepartments = async () => {
        try {
            const response = await API.get('/departments');
            setDepartments(response.data.departments);
        } catch (error) {
            console.error('Failed to fetch departments:', error);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        const result = await registerUser(data);
        setLoading(false);
        
        if (result.success) {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <div>
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
                        Create Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Join the EMEAHub community
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                I am a:
                            </label>
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        {...register('role')}
                                        value="student"
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Student</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        {...register('role')}
                                        value="public"
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Public User</span>
                                </label>
                            </div>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Full Name
                            </label>
                            <input
                                {...register('name')}
                                type="text"
                                className="input-field"
                                placeholder="John Doe"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email Address
                            </label>
                            <input
                                {...register('email')}
                                type="email"
                                className="input-field"
                                placeholder="you@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Student Fields */}
                        {showStudentFields && (
                            <>
                                {/* Department */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Department
                                    </label>
                                    <select
                                        {...register('department_id')}
                                        className="input-field"
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept.id} value={dept.id}>
                                                {dept.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.department_id && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.department_id.message}
                                        </p>
                                    )}
                                </div>

                                {/* Enrollment Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Enrollment Number
                                    </label>
                                    <input
                                        {...register('enrollment_no')}
                                        type="text"
                                        className="input-field"
                                        placeholder="CS2024001"
                                    />
                                    {errors.enrollment_no && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.enrollment_no.message}
                                        </p>
                                    )}
                                </div>

                                {/* Semester */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Current Semester
                                    </label>
                                    <select
                                        {...register('semester')}
                                        className="input-field"
                                    >
                                        <option value="">Select Semester</option>
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                            <option key={sem} value={sem}>Semester {sem}</option>
                                        ))}
                                    </select>
                                    {errors.semester && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.semester.message}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Password
                            </label>
                            <input
                                {...register('password')}
                                type="password"
                                className="input-field"
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Confirm Password
                            </label>
                            <input
                                {...register('password_confirmation')}
                                type="password"
                                className="input-field"
                                placeholder="••••••••"
                            />
                            {errors.password_confirmation && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.password_confirmation.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex justify-center items-center"
                    >
                        {loading ? <LoadingSpinner size="sm" /> : 'Create Account'}
                    </button>

                    {/* Login Link */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                                Sign in
                            </Link>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Are you a teacher?{' '}
                            <Link to="/register/teacher" className="font-medium text-primary-600 hover:text-primary-500">
                                Register here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
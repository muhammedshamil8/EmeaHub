import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const schema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    password_confirmation: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
    department_id: yup.string().required('Department is required'),
    qualification: yup.string().required('Qualification is required'),
    experience: yup.number().min(0, 'Experience must be 0 or more').required('Years of experience is required')
});

export default function TeacherRegister() {
    const navigate = useNavigate();
    const { registerTeacher } = useAuth();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const response = await API.get('/departments');
            setDepartments(response.data.departments);
        } catch (error) {
            console.error('Failed to fetch departments:', error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setSubmitting(true);
        const result = await registerTeacher(data);
        setSubmitting(false);
        
        if (result.success) {
            navigate('/login');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <div>
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
                        Teacher Registration
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Join as an educator and share your knowledge
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Full Name
                            </label>
                            <input
                                {...register('name')}
                                type="text"
                                className="input-field"
                                placeholder="Dr. John Doe"
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
                                placeholder="teacher@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                            )}
                        </div>

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

                        {/* Qualification */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Qualification
                            </label>
                            <input
                                {...register('qualification')}
                                type="text"
                                className="input-field"
                                placeholder="M.Tech, Ph.D, etc."
                            />
                            {errors.qualification && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.qualification.message}
                                </p>
                            )}
                        </div>

                        {/* Experience */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Years of Teaching Experience
                            </label>
                            <input
                                {...register('experience')}
                                type="number"
                                min="0"
                                step="1"
                                className="input-field"
                                placeholder="5"
                            />
                            {errors.experience && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.experience.message}
                                </p>
                            )}
                        </div>

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

                    {/* Info Message */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            <strong>Note:</strong> Teacher accounts require admin verification. 
                            You will be able to login only after approval.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary w-full flex justify-center items-center"
                    >
                        {submitting ? <LoadingSpinner size="sm" /> : 'Register as Teacher'}
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
                            Are you a student?{' '}
                            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                                Register here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
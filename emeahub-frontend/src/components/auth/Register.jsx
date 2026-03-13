import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import CustomSelect from '../common/CustomSelect';
import { AcademicCapIcon, UserIcon } from '@heroicons/react/24/outline';

const schema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    password_confirmation: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
    role: yup.string().oneOf(['student', 'teacher']).default('student'),
    
    // Student specific fields
    department_id: yup.string().when('role', {
        is: 'student',
        then: () => yup.string().required('Department is required'),
        otherwise: () => yup.string().when('role', {
            is: 'teacher',
            then: () => yup.string().required('Department is required'),
            otherwise: () => yup.string().notRequired()
        })
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

    // Teacher specific fields
    qualification: yup.string().when('role', {
        is: 'teacher',
        then: () => yup.string().required('Qualification is required'),
        otherwise: () => yup.string().notRequired()
    }),
    experience: yup.number().when('role', {
        is: 'teacher',
        then: () => yup.number().min(0, 'Experience must be 0 or more').required('Years of experience is required'),
        otherwise: () => yup.number().notRequired()
    })
});

export default function Register() {
    const navigate = useNavigate();
    const { register: registerStudent, registerTeacher } = useAuth();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);

    const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            role: 'student'
        }
    });

    const selectedRole = watch('role');

    useEffect(() => {
        fetchDepartments();
    }, []);

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
        let result;
        if (data.role === 'teacher') {
            result = await registerTeacher(data);
        } else {
            result = await registerStudent(data);
        }
        setLoading(false);
        
        if (result.success) {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700/50">
                <div>
                    <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white tracking-tight">
                        Create Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Join the EMEAHub community
                    </p>
                </div>

                <div className="flex p-1 space-x-1 bg-gray-100 dark:bg-gray-900 rounded-xl">
                    <button
                        type="button"
                        onClick={() => setValue('role', 'student')}
                        className={`w-full flex items-center justify-center py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                            selectedRole === 'student'
                                ? 'bg-white dark:bg-gray-800 shadow text-gray-900 dark:text-white'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50'
                        }`}
                    >
                        <UserIcon className="w-4 h-4 mr-2" />
                        Student
                    </button>
                    <button
                        type="button"
                        onClick={() => setValue('role', 'teacher')}
                        className={`w-full flex items-center justify-center py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                            selectedRole === 'teacher'
                                ? 'bg-white dark:bg-gray-800 shadow text-gray-900 dark:text-white'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50'
                        }`}
                    >
                        <AcademicCapIcon className="w-4 h-4 mr-2" />
                        Teacher
                    </button>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Full Name
                            </label>
                            <input
                                {...register('name')}
                                type="text"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400"
                                placeholder={selectedRole === 'teacher' ? "Dr. John Doe" : "John Doe"}
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
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400"
                                placeholder={selectedRole === 'teacher' ? "teacher@example.com" : "student@example.com"}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Common Department for both */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Department
                            </label>
                            <Controller
                                name="department_id"
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect
                                        {...field}
                                        options={departments.map(dept => ({ value: dept.id, label: dept.name }))}
                                        placeholder="Select Department"
                                        error={errors.department_id}
                                    />
                                )}
                            />
                            {errors.department_id && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.department_id.message}
                                </p>
                            )}
                        </div>

                        {/* Student Specific Fields */}
                        {selectedRole === 'student' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Enrollment No
                                    </label>
                                    <input
                                        {...register('enrollment_no')}
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400"
                                        placeholder="CS2024001"
                                    />
                                    {errors.enrollment_no && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.enrollment_no.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Semester
                                    </label>
                                    <Controller
                                        name="semester"
                                        control={control}
                                        render={({ field }) => (
                                            <CustomSelect
                                                {...field}
                                                options={[1, 2, 3, 4, 5, 6, 7, 8].map(sem => ({ value: sem, label: `Sem ${sem}` }))}
                                                placeholder="Select Sem"
                                                error={errors.semester}
                                            />
                                        )}
                                    />
                                    {errors.semester && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.semester.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Teacher Specific Fields */}
                        {selectedRole === 'teacher' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Qualification
                                    </label>
                                    <input
                                        {...register('qualification')}
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400"
                                        placeholder="M.Tech, Ph.D"
                                    />
                                    {errors.qualification && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.qualification.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Experience (Yrs)
                                    </label>
                                    <input
                                        {...register('experience')}
                                        type="number"
                                        min="0"
                                        step="1"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400"
                                        placeholder="5"
                                    />
                                    {errors.experience && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.experience.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Password
                            </label>
                            <input
                                {...register('password')}
                                type="password"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400"
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
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400"
                                placeholder="••••••••"
                            />
                            {errors.password_confirmation && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.password_confirmation.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {selectedRole === 'teacher' && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-sm text-blue-800 dark:text-blue-300">
                            <strong>Note:</strong> Teacher accounts require admin verification before login.
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full inline-flex justify-center items-center px-4 py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? <LoadingSpinner size="sm" /> : (selectedRole === 'teacher' ? 'Register as Teacher' : 'Create Account')}
                    </button>

                    {/* Login Link */}
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
                                Sign in instead
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
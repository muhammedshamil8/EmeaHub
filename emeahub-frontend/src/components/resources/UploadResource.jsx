import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { resourceService } from '../../services/resources';
import API from '../../services/api';
import { useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const schema = yup.object({
    title: yup.string().required('Title is required'),
    description: yup.string(),
    type: yup.string().required('Resource type is required'),
    subject_id: yup.string().required('Subject is required'),
    module_id: yup.string(),
    semester: yup.string().required('Semester is required'),
    file: yup.mixed().required('File is required')
});

export default function UploadResource() {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [modules, setModules] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const watchDepartment = watch('department_id');
    const watchSubject = watch('subject_id');
    const watchSemester = watch('semester');

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        if (watchDepartment && watchSemester) {
            fetchSubjects(watchDepartment, watchSemester);
        }
    }, [watchDepartment, watchSemester]);

    useEffect(() => {
        if (watchSubject) {
            fetchModules(watchSubject);
        }
    }, [watchSubject]);

    const fetchDepartments = async () => {
        try {
            const response = await API.get('/departments');
            setDepartments(response.data.departments);
        } catch (error) {
            toast.error('Failed to fetch departments');
        }
    };

    const fetchSubjects = async (departmentId, semester) => {
        try {
            const response = await API.get('/subjects/by-department', {
                params: { department_id: departmentId, semester }
            });
            setSubjects(response.data.subjects);
        } catch (error) {
            toast.error('Failed to fetch subjects');
        }
    };

    const fetchModules = async (subjectId) => {
        try {
            const response = await API.get(`/subjects/${subjectId}/modules`);
            setModules(response.data.modules);
        } catch (error) {
            console.error('Failed to fetch modules');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setValue('file', file);
        }
    };

    const onSubmit = async (data) => {
        setUploading(true);
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (data[key]) {
                    formData.append(key, data[key]);
                }
            });

            await resourceService.uploadResource(formData);
            toast.success('Resource uploaded successfully! Pending verification.');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Upload Resource
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Title *
                        </label>
                        <input
                            {...register('title')}
                            type="text"
                            className="input-field"
                            placeholder="e.g., Data Structures Complete Notes"
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            {...register('description')}
                            rows="3"
                            className="input-field"
                            placeholder="Brief description of the resource..."
                        />
                    </div>

                    {/* Resource Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Resource Type *
                        </label>
                        <select {...register('type')} className="input-field">
                            <option value="">Select type</option>
                            <option value="note">Notes</option>
                            <option value="pyq">Previous Year Questions</option>
                            <option value="syllabus">Syllabus</option>
                            <option value="timetable">Timetable</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.type && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.type.message}</p>
                        )}
                    </div>

                    {/* Department */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Department *
                        </label>
                        <select {...register('department_id')} className="input-field">
                            <option value="">Select department</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Semester */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Semester *
                        </label>
                        <select {...register('semester')} className="input-field">
                            <option value="">Select semester</option>
                            {[1,2,3,4,5,6,7,8].map(sem => (
                                <option key={sem} value={sem}>Semester {sem}</option>
                            ))}
                        </select>
                        {errors.semester && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.semester.message}</p>
                        )}
                    </div>

                    {/* Subject */}
                    {watchDepartment && watchSemester && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Subject *
                            </label>
                            <select {...register('subject_id')} className="input-field">
                                <option value="">Select subject</option>
                                {subjects.map(subj => (
                                    <option key={subj.id} value={subj.id}>{subj.name}</option>
                                ))}
                            </select>
                            {errors.subject_id && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject_id.message}</p>
                            )}
                        </div>
                    )}

                    {/* Module (Optional) */}
                    {watchSubject && modules.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Module (Optional)
                            </label>
                            <select {...register('module_id')} className="input-field">
                                <option value="">Select module</option>
                                {modules.map(mod => (
                                    <option key={mod.id} value={mod.id}>{mod.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            File *
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-500 transition-colors">
                            <div className="space-y-1 text-center">
                                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                    <label className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500">
                                        <span>Upload a file</span>
                                        <input
                                            type="file"
                                            className="sr-only"
                                            onChange={handleFileChange}
                                            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    PDF, DOC, PPT up to 20MB
                                </p>
                                {selectedFile && (
                                    <p className="text-sm text-gray-900 dark:text-white mt-2">
                                        Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                    </p>
                                )}
                            </div>
                        </div>
                        {errors.file && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.file.message}</p>
                        )}
                    </div>

                    {/* Upload Progress */}
                    {uploading && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Uploading...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                    className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={uploading}
                        className="btn-primary w-full flex justify-center items-center space-x-2"
                    >
                        {uploading ? (
                            <>
                                <LoadingSpinner size="sm" />
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <>
                                <CloudArrowUpIcon className="h-5 w-5" />
                                <span>Upload Resource</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
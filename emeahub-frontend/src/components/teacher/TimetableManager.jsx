import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function TimetableManager() {
    const { user } = useAuth();
    const [departments, setDepartments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedDept, setSelectedDept] = useState('');
    const [selectedSem, setSelectedSem] = useState('');
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const timeSlots = [
        '09:00-10:00', '10:00-11:00', '11:00-12:00',
        '12:00-13:00', '14:00-15:00', '15:00-16:00'
    ];

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        if (selectedDept && selectedSem) {
            fetchSubjects();
            fetchTimetable();
        }
    }, [selectedDept, selectedSem]);

    const fetchDepartments = async () => {
        try {
            const response = await API.get('/departments');
            setDepartments(response.data.departments);
        } catch (error) {
            toast.error('Failed to fetch departments');
        }
    };

    const fetchSubjects = async () => {
        try {
            const response = await API.get('/subjects/by-department', {
                params: { department_id: selectedDept, semester: selectedSem }
            });
            setSubjects(response.data.subjects);
        } catch (error) {
            toast.error('Failed to fetch subjects');
        }
    };

    const fetchTimetable = async () => {
        setLoading(true);
        try {
            const response = await API.get('/timetable', {
                params: { department_id: selectedDept, semester: selectedSem }
            });
            
            // Convert API response to entries format
            const fetchedEntries = [];
            Object.entries(response.data.timetable).forEach(([day, slots]) => {
                slots.forEach(slot => {
                    fetchedEntries.push({
                        day,
                        time_slot: slot.time_slot,
                        subject_id: slot.subject_id || '',
                        teacher_name: slot.teacher_name || user?.name || '',
                        room: slot.room || ''
                    });
                });
            });
            
            if (fetchedEntries.length > 0) {
                setEntries(fetchedEntries);
            } else {
                initializeEmptyTimetable();
            }
        } catch (error) {
            console.error('Failed to fetch timetable:', error);
            initializeEmptyTimetable();
        } finally {
            setLoading(false);
        }
    };

    const initializeEmptyTimetable = () => {
        const newEntries = [];
        days.forEach(day => {
            timeSlots.forEach(slot => {
                newEntries.push({
                    day,
                    time_slot: slot,
                    subject_id: '',
                    teacher_name: user?.name || '',
                    room: ''
                });
            });
        });
        setEntries(newEntries);
    };

    const handleEntryChange = (index, field, value) => {
        const updated = [...entries];
        updated[index][field] = value;
        setEntries(updated);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await API.post('/teacher/timetable', {
                department_id: selectedDept,
                semester: selectedSem,
                entries: entries.filter(e => e.subject_id) // Only save entries with subject selected
            });
            toast.success('Timetable saved successfully');
        } catch (error) {
            toast.error('Failed to save timetable');
        } finally {
            setSaving(false);
        }
    };

    const getEntriesForDay = (day) => {
        return entries.filter(e => e.day === day);
    };

    if (!selectedDept || !selectedSem) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Manage Timetable
                </h1>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Department
                            </label>
                            <select
                                value={selectedDept}
                                onChange={(e) => setSelectedDept(e.target.value)}
                                className="input-field"
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Semester
                            </label>
                            <select
                                value={selectedSem}
                                onChange={(e) => setSelectedSem(e.target.value)}
                                className="input-field"
                            >
                                <option value="">Select Semester</option>
                                {[1,2,3,4,5,6,7,8].map(sem => (
                                    <option key={sem} value={sem}>Semester {sem}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Manage Timetable
                </h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary"
                >
                    {saving ? 'Saving...' : 'Save Timetable'}
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Day / Time
                                </th>
                                {timeSlots.map(slot => (
                                    <th key={slot} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        {slot}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {days.map(day => (
                                <tr key={day}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white capitalize">
                                        {day}
                                    </td>
                                    {timeSlots.map(slot => {
                                        const entry = entries.find(e => e.day === day && e.time_slot === slot);
                                        const index = entries.findIndex(e => e.day === day && e.time_slot === slot);
                                        
                                        return (
                                            <td key={`${day}-${slot}`} className="px-6 py-4">
                                                {entry && (
                                                    <div className="space-y-2">
                                                        <select
                                                            value={entry.subject_id}
                                                            onChange={(e) => handleEntryChange(index, 'subject_id', e.target.value)}
                                                            className="input-field text-sm"
                                                        >
                                                            <option value="">Select Subject</option>
                                                            {subjects.map(subj => (
                                                                <option key={subj.id} value={subj.id}>
                                                                    {subj.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <input
                                                            type="text"
                                                            value={entry.room}
                                                            onChange={(e) => handleEntryChange(index, 'room', e.target.value)}
                                                            placeholder="Room"
                                                            className="input-field text-sm"
                                                        />
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import CustomSelect from '../common/CustomSelect';
import { 
    PlusIcon, 
    TrashIcon, 
    CalendarDaysIcon,
    AcademicCapIcon,
    ClockIcon,
    BuildingOfficeIcon,
    ArrowPathIcon,
    CheckIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { getInitials } from '../../utils/helpers';

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
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 border border-white/10 shadow-2xl p-10 sm:p-12 text-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-600/30 to-indigo-600/30 backdrop-blur-3xl"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <div className="h-20 w-20 bg-primary-500/20 rounded-3xl flex items-center justify-center text-primary-400 mx-auto mb-8 shadow-inner">
                            <CalendarDaysIcon className="h-10 w-10 text-white" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
                            Class Scheduler
                        </h1>
                        <p className="text-gray-300 text-lg font-medium leading-relaxed mb-10">
                            Configure class timings and subjects for the current semester. Select a department to begin.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-2xl">
                                <CustomSelect
                                    value={selectedDept}
                                    onChange={(val) => setSelectedDept(val)}
                                    options={departments.map(dept => ({ value: dept.id, label: dept.name }))}
                                    placeholder="Select Department"
                                />
                            </div>
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-2xl">
                                <CustomSelect
                                    value={selectedSem}
                                    onChange={(val) => setSelectedSem(val)}
                                    options={[1,2,3,4,5,6,7,8].map(sem => ({ value: sem, label: `Semester ${sem}` }))}
                                    placeholder="Select Semester"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-primary-200 dark:border-primary-800/50">
                            Active Session
                        </span>
                        <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                            Semester {selectedSem}
                        </span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                        Timetable Management
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => { setSelectedDept(''); setSelectedSem(''); }}
                        className="p-3 bg-white dark:bg-gray-800 text-gray-500 border border-gray-100 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm"
                        title="Change Department"
                    >
                        <ArrowPathIcon className="h-6 w-6" />
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-3.5 bg-primary-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-primary-500/20 hover:bg-primary-500 hover:-translate-y-1 transition-all disabled:opacity-50"
                    >
                        {saving ? 'Syncing...' : 'Save Configuration'}
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-gray-900/50">
                                <th className="px-8 py-6 text-left border-b border-gray-100 dark:border-gray-700/50">
                                    <div className="flex items-center gap-2">
                                        <ClockIcon className="h-5 w-5 text-gray-400 transition-colors group-hover:text-primary-600" />
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Timeline</span>
                                    </div>
                                </th>
                                {timeSlots.map(slot => (
                                    <th key={slot} className="px-8 py-6 text-left border-b border-gray-100 dark:border-gray-700/50 min-w-[240px]">
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{slot}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                            {days.map(day => (
                                <tr key={day} className="hover:bg-gray-50/30 dark:hover:bg-gray-700/20 transition-colors group">
                                    <td className="px-8 py-8 whitespace-nowrap bg-gray-50/20 dark:bg-gray-900/20 border-r border-gray-100 dark:border-gray-700/50">
                                        <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                                            {day}
                                        </span>
                                    </td>
                                    {timeSlots.map(slot => {
                                        const entry = entries.find(e => e.day === day && e.time_slot === slot);
                                        const index = entries.findIndex(e => e.day === day && e.time_slot === slot);
                                        
                                        return (
                                            <td key={`${day}-${slot}`} className="px-4 py-4 xl:px-6">
                                                {entry && (
                                                    <div className="space-y-3 bg-white dark:bg-gray-900/50 p-4 rounded-[1.5rem] border border-gray-100 dark:border-gray-700 group-hover:border-primary-500/30 transition-all shadow-sm">
                                                        <CustomSelect
                                                            value={entry.subject_id}
                                                            onChange={(val) => handleEntryChange(index, 'subject_id', val)}
                                                            options={subjects.map(subj => ({ value: subj.id, label: subj.name }))}
                                                            placeholder="Select Subject"
                                                        />
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <BuildingOfficeIcon className="h-3.5 w-3.5 text-gray-400" />
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={entry.room}
                                                                onChange={(e) => handleEntryChange(index, 'room', e.target.value)}
                                                                placeholder="Room"
                                                                className="w-full pl-9 pr-4 py-2 text-[11px] font-bold bg-gray-50/50 dark:bg-gray-800/50 border-none rounded-xl focus:ring-1 focus:ring-primary-500 transition-all text-gray-700 dark:text-gray-300 placeholder-gray-400"
                                                            />
                                                        </div>
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
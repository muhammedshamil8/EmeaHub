import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import API from "../services/api";
import CustomSelect from "../components/common/CustomSelect";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { BookOpenIcon, QueueListIcon, ChevronRightIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000';

export default function SyllabusViewer() {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDept && selectedSemester) {
      fetchSyllabus();
    } else {
      setSubjects([]);
    }
  }, [selectedDept, selectedSemester]);

  const fetchDepartments = async () => {
    try {
      const response = await API.get("/departments");
      setDepartments(response.data.departments || []);
    } catch (error) {
      console.error("Failed to fetch departments", error);
      toast.error("Failed to load departments");
    }
  };

  const fetchSyllabus = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/subjects/by-department`, {
        params: {
          department_id: selectedDept,
          semester: selectedSemester,
        },
      });

      if (response.data.success) {
        setSubjects(response.data.subjects);
      } else {
        setSubjects([]);
      }
    } catch (error) {
      console.error("Failed to fetch syllabus", error);
      toast.error("Failed to load syllabus");
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const groupSubjectsByType = () => {
    const grouped = {
      major: [],
      minor: [],
      mdc: [],
      sec: [],
      vac: [],
      lab: []
    };
    
    subjects.forEach(sub => {
      const type = (sub.type || 'major').toLowerCase();
      if (grouped[type]) {
        grouped[type].push(sub);
      } else if (sub.name.toLowerCase().includes('lab') || sub.name.toLowerCase().includes('practical')) {
        grouped.lab.push(sub);
      } else {
        grouped.major.push(sub);
      }
    });
    
    return grouped;
  };

  const groupedSubjects = groupSubjectsByType();

  const typeLabels = {
    major: { title: "Major Core Courses", color: "from-blue-600 to-indigo-600", badge: "bg-blue-100 text-blue-700" },
    minor: { title: "Minor Courses", color: "from-purple-600 to-pink-600", badge: "bg-purple-100 text-purple-700" },
    mdc: { title: "Multidisciplinary Courses (MDC)", color: "from-emerald-500 to-teal-600", badge: "bg-emerald-100 text-emerald-700" },
    aec: { title: "Ability Enhancement (AEC)", color: "from-amber-500 to-orange-600", badge: "bg-amber-100 text-amber-700" },
    sec: { title: "Skill Enhancement (SEC)", color: "from-cyan-500 to-blue-500", badge: "bg-cyan-100 text-cyan-700" },
    vac: { title: "Value Added Courses (VAC)", color: "from-rose-500 to-red-600", badge: "bg-rose-100 text-rose-700" },
    lab: { title: "Practical & Lab Sessions", color: "from-orange-500 to-yellow-600", badge: "bg-orange-100 text-orange-700" },
  };

  const renderSubjectGroup = (typeKey) => {
    const group = groupedSubjects[typeKey];
    if (!group || group.length === 0) return null;

    const { title, color, badge } = typeLabels[typeKey];

    return (
      <div key={typeKey} className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-0.5 w-8 bg-gray-200 dark:bg-gray-700"></div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
          <div className="h-0.5 flex-1 bg-gray-200 dark:bg-gray-700"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {group.map(subject => (
            <div 
              key={subject.id} 
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${color} group-hover:w-2 transition-all duration-300`}></div>
              
              <div className="pl-3">
                <div className="flex justify-between items-start mb-2">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${badge} uppercase tracking-wider`}>
                    {subject.code}
                  </span>
                </div>
                
                <h4 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-4">
                  {subject.name}
                </h4>

                <div className="flex items-center justify-between mt-auto">
                    {subject.syllabus_path ? (
                        <button 
                            onClick={() => window.open(`${STORAGE_URL}${subject.syllabus_path}`, '_blank')}
                            className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline flex items-center group/link"
                        >
                            View Syllabus PDF
                            <ChevronRightIcon className="h-3 w-3 ml-1 group-hover/link:translate-x-0.5 transition-transform" />
                        </button>
                    ) : (
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center">
                            <ExclamationCircleIcon className="h-3 w-3 mr-1" />
                            Syllabus Not Available
                        </span>
                    )}
                    <div className="h-8 w-8 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                        <BookOpenIcon className="h-4 w-4 text-gray-400" />
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl mb-4">
          <BookOpenIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
          FYUGP Syllabus Explorer
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover your structured Major, Minor, and supplementary courses per semester under the Calicut University FYUGP format.
        </p>
      </div>

      {/* Filters Form */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Department
            </label>
            <CustomSelect
              value={selectedDept}
              onChange={setSelectedDept}
              options={[
                { value: "", label: "Select Department" },
                ...departments.map((d) => ({ value: d.id, label: d.name })),
              ]}
              placeholder="Select Department"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Semester (Level)
            </label>
            <CustomSelect
              value={selectedSemester}
              onChange={setSelectedSemester}
              options={[
                { value: "", label: "Select Semester" },
                ...[1, 2, 3, 4, 5, 6, 7, 8].map((s) => ({ value: s, label: `Semester ${s}` })),
              ]}
              placeholder="Select Semester"
              disabled={!selectedDept}
            />
          </div>
        </div>
      </div>

      {/* Syllabus Display */}
      {loading ? (
        <LoadingSpinner />
      ) : !selectedDept || !selectedSemester ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
          <QueueListIcon className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Please select a department and semester to explore the syllabus structure.
          </p>
        </div>
      ) : subjects.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
          <BookOpenIcon className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No syllabus structure found for this selection yet.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 mt-8">
          {Object.keys(typeLabels).map(typeKey => renderSubjectGroup(typeKey))}
        </div>
      )}
    </div>
  );
}

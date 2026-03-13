import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import API from "../services/api";
import CustomSelect from "../components/common/CustomSelect";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { CalendarDaysIcon, ClockIcon, LightBulbIcon, SparklesIcon } from "@heroicons/react/24/outline";

export default function StudyPlannerPage() {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    subject_id: "",
    hours_per_day: "2",
    exam_date: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDept && selectedSemester) {
      fetchSubjects();
    } else {
      setSubjects([]);
      setFormData(prev => ({ ...prev, subject_id: "" }));
    }
  }, [selectedDept, selectedSemester]);

  const fetchDepartments = async () => {
    try {
      const response = await API.get("/departments");
      setDepartments(response.data.data || response.data.departments || []);
    } catch (error) {
      console.error("Failed to fetch departments", error);
      toast.error("Failed to load departments");
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await API.get(`/subjects/by-department`, {
        params: {
          department_id: selectedDept,
          semester: selectedSemester,
        },
      });
      if (response.data.success) {
        setSubjects(response.data.subjects);
      }
    } catch (error) {
      console.error("Failed to fetch subjects", error);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.subject_id || !formData.exam_date) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    setPlan(null);
    try {
      const response = await API.post("/ai/study-plan", formData);
      if (response.data.success) {
        setPlan(response.data.plan);
        toast.success("Study plan generated successfully!");
      } else {
        throw new Error(response.data.message || "Failed to generate plan");
      }
    } catch (error) {
      console.error("AI Plan Error", error);
      toast.error(error.response?.data?.message || "Something went wrong generating the plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4">
          <SparklesIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
          AI Study Planner
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Generate a personalized daily study schedule based on your syllabus, available time, and remaining days until exams.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form */}
        <div className="lg:col-span-1 border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl h-fit">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <CalendarDaysIcon className="w-6 h-6 mr-2 text-primary-500" />
            Plan Details
          </h2>
          
          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Department
              </label>
              <CustomSelect
                value={selectedDept}
                onChange={setSelectedDept}
                options={[
                  { value: "", label: "Select Department" },
                  ...(departments || []).map((d) => ({ value: d.id, label: d.name })),
                ]}
                placeholder="Select Department"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Semester
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

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </label>
              <CustomSelect
                value={formData.subject_id}
                onChange={(val) => setFormData({ ...formData, subject_id: val })}
                options={[
                  { value: "", label: "Select Subject" },
                  ...(subjects || []).map((s) => ({ value: s.id, label: s.name })),
                ]}
                placeholder="Select Subject"
                disabled={!selectedSemester || subjects.length === 0}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Study Hours Per Day
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={formData.hours_per_day}
                onChange={(e) => setFormData({ ...formData, hours_per_day: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Exam Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.exam_date}
                onChange={(e) => setFormData({ ...formData, exam_date: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-gray-900 dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !formData.subject_id || !formData.exam_date}
              className="w-full inline-flex justify-center items-center px-4 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 shadow-lg shadow-indigo-500/30 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating Plan...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Generate Study Plan
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center h-full min-h-[400px]">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                <SparklesIcon className="w-16 h-16 text-primary-500 dark:text-primary-400 relative z-10 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Analyzing Syllabus...
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
                Our AI is currently breaking down your subject modules and distributing them evenly across your available study days.
              </p>
            </div>
          ) : plan ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 h-full">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <LightBulbIcon className="w-7 h-7 mr-3 text-amber-500" />
                Your Custom Study Plan
              </h2>
              <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
                {Array.isArray(plan) ? (
                  <div className="space-y-4">
                    {plan.map((day, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-inner">
                        <h3 className="text-lg font-bold text-primary-600 dark:text-primary-400 mb-2">
                          Day {day.day || idx + 1}: {day.topic || day.focus}
                        </h3>
                        <p className="text-sm opacity-80 mb-3">{day.description || day.tasks}</p>
                        {day.schedule && (
                          <ul className="text-sm space-y-1 list-disc list-inside opacity-70">
                            {Array.isArray(day.schedule) ? day.schedule.map((s, i) => <li key={i}>{s}</li>) : <li>{day.schedule}</li>}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap font-sans bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-inner overflow-auto h-[600px] text-sm leading-relaxed">
                    {typeof plan === 'string' ? plan : JSON.stringify(plan, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-12 border border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center h-full min-h-[400px]">
              <CalendarDaysIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-1">
                No Plan Generated Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
                Fill out the form on the left specifying your exam date and subject to let our AI generate a step-by-step revision strategy.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
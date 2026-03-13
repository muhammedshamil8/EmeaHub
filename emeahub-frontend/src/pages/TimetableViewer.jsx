import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import API from "../services/api";
import CustomSelect from "../components/common/CustomSelect";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { CalendarDaysIcon, ClockIcon, MapPinIcon, UserIcon } from "@heroicons/react/24/outline";

export default function TimetableViewer() {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDept && selectedSemester) {
      fetchTimetable();
    } else {
      setTimetable(null);
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

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const response = await API.get("/timetable", {
        params: {
          department_id: selectedDept,
          semester: selectedSemester,
        },
      });

      if (response.data.success) {
        setTimetable(response.data.timetable);
      } else {
        setTimetable(null);
      }
    } catch (error) {
      console.error("Failed to fetch timetable", error);
      toast.error("Failed to load timetable");
      setTimetable(null);
    } finally {
      setLoading(false);
    }
  };

  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday"];

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl mb-4">
          <CalendarDaysIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
          Class Timetables
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Select your department and semester to view the scheduled classes for the week.
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
        </div>
      </div>

      {/* Timetable Display */}
      {loading ? (
        <LoadingSpinner />
      ) : !selectedDept || !selectedSemester ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
          <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Please select a department and semester to view the timetable.
          </p>
        </div>
      ) : !timetable || Object.keys(timetable).length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
          <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No timetable found for this selection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {daysOfWeek.map((day) => (
            <div key={day} className="flex flex-col space-y-4">
              <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-4 text-center shadow-lg">
                <h3 className="text-white font-bold uppercase tracking-wider text-sm">
                  {day}
                </h3>
              </div>

              <div className="space-y-4">
                {timetable[day] ? (
                  timetable[day].map((session, idx) => (
                    <div
                      key={idx}
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl border border-gray-100 dark:border-gray-700/50 hover:shadow-2xl hover:-translate-y-1 transition-all relative overflow-hidden group"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary-500 to-purple-600 group-hover:w-2 transition-all"></div>
                      
                      <div className="flex items-center text-primary-600 dark:text-primary-400 font-black mb-4 bg-primary-50 dark:bg-primary-900/30 w-fit px-3 py-1 rounded-xl text-[10px] uppercase tracking-widest">
                        <ClockIcon className="w-3 h-3 mr-1.5" />
                        <span>{session.time_slot}</span>
                      </div>
                      
                      <h4 className="font-black text-gray-900 dark:text-white mb-3 leading-tight uppercase tracking-tight text-sm">
                        {session.subject?.name || 'Self Study / Free Period'}
                      </h4>

                      <div className="space-y-2 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                        {session.teacher_name && (
                          <div className="flex items-center">
                            <UserIcon className="w-3.5 h-3.5 mr-2 text-gray-400" />
                            <span className="truncate">{session.teacher_name}</span>
                          </div>
                        )}
                        {session.room && (
                          <div className="flex items-center">
                            <MapPinIcon className="w-3.5 h-3.5 mr-2 text-gray-400" />
                            <span className="truncate">Room: {session.room}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-800/30 rounded-2xl p-4 border border-dashed border-gray-200 dark:border-gray-700 text-center text-sm text-gray-400">
                    No classes
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

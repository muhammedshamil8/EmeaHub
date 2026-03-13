import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../../services/api";
import {
  BuildingOfficeIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ChevronRightIcon,
  FolderIcon,
  FolderOpenIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "../common/LoadingSpinner";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function ResourceHierarchy() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);

  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  const currentDept = searchParams.get("department_id");
  const currentSem = searchParams.get("semester");
  const currentSubject = searchParams.get("subject_id");

  useEffect(() => {
    if (currentSubject) {
      fetchResources(currentSubject);
    }
  }, [currentSubject]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (currentDept && currentSem) {
      setSubjects([]);
      fetchSubjects(currentDept, currentSem);
    }
  }, [currentDept, currentSem]);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await API.get("/departments");
      setDepartments(res.data.departments || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async (dept, sem) => {
    setSubLoading(true);

    try {
      const res = await API.get("/subjects/by-department", {
        params: {
          department_id: dept,
          semester: sem,
        },
      });

      setSubjects(res.data.subjects || []);
    } catch (error) {
      console.error(error);
    } finally {
      setSubLoading(false);
    }
  };

  const handleSelectDept = (id) => {
    const params = new URLSearchParams(searchParams);
    params.set("department_id", id);
    params.delete("semester");
    params.delete("subject_id");
    setSearchParams(params);
  };

  const handleSelectSem = (sem) => {
    const params = new URLSearchParams(searchParams);
    params.set("semester", sem);
    params.delete("subject_id");
    setSearchParams(params);
  };

  const handleSelectSubject = (id) => {
    const params = new URLSearchParams(searchParams);
    params.set("subject_id", id);
    setSearchParams(params);
  };

  const fetchResources = async (subjectId) => {
    setLoading(true);
    try {
      const response = await API.get("/resources", {
        params: {
          subject_id: subjectId,
          status: "verified",
          visibility: "visible",
        },
      });
      setResources(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    const params = new URLSearchParams(searchParams);
    if (currentSubject) {
      params.delete("subject_id");
    } else if (currentSem) {
      params.delete("semester");
    } else if (currentDept) {
      params.delete("department_id");
    }
    setSearchParams(params);
  };

  if (loading && departments.length === 0) return <LoadingSpinner />;

  const deptName = departments.find((d) => String(d.id) === currentDept)?.name;

  return (
    <div className="space-y-8">
      {/* Breadcrumb / Back Button */}
      {(currentDept || currentSem) && (
        <button
          onClick={goBack}
          className="flex items-center text-xs font-black text-gray-400 uppercase tracking-[0.2em] hover:text-primary-600 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back
        </button>
      )}

      <AnimatePresence mode="wait">
        {/* Step 1: Departments */}
        {!currentDept && (
          <motion.div
            key="depts"
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {departments.map((dept) => (
              <motion.button
                key={dept.id}
                variants={item}
                onClick={() => handleSelectDept(dept.id)}
                className="group relative bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700/50 hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col items-center text-center overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-100 dark:bg-primary-900/10 rounded-full blur-3xl -mt-12 -mr-12 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10 p-5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-3xl mb-6 group-hover:scale-110 transition-transform">
                  <BuildingOfficeIcon className="h-10 w-10" />
                </div>
                <h3 className="relative z-10 text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                  {dept.name}
                </h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
                  {dept.code}
                </p>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Step 2: Semesters */}
        {currentDept && !currentSem && (
          <motion.div
            key={currentDept}
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <motion.button
                key={sem}
                variants={item}
                onClick={() => handleSelectSem(sem)}
                className="group bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 hover:bg-primary-600 hover:text-white transition-all flex flex-col items-center text-center"
              >
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 text-primary-500 group-hover:bg-white/20 group-hover:text-white rounded-xl mb-4 transition-colors">
                  <AcademicCapIcon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest">
                  Semester {sem}
                </h3>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Step 3: Subjects */}
        {currentDept && currentSem && !currentSubject && (
          <motion.div
            key={`${currentDept}-${currentSem}`}
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <div className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-[2rem] border border-primary-100 dark:border-primary-800/50 mb-8 flex justify-between items-center">
              <h2 className="text-sm font-black text-primary-700 dark:text-primary-400 uppercase tracking-widest flex items-center">
                <FolderOpenIcon className="h-5 w-5 mr-3" />
                Exploring {deptName} • Semester {currentSem}
              </h2>
            </div>
            {subLoading ? (
              <LoadingSpinner />
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {subjects.length > 0 ? (
                  subjects.map((sub) => (
                    <motion.div
                      key={sub.id}
                      variants={item}
                      onClick={() => handleSelectSubject(sub.id)}
                      className="group flex items-center p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-lg hover:border-primary-400 cursor-pointer transition-all text-left"
                    >
                      <div className="h-12 w-12 bg-gray-50 dark:bg-gray-900 text-primary-500 rounded-2xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform">
                        <BookOpenIcon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                          {sub.code}
                        </p>
                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase leading-tight">
                          {sub.name}
                        </h3>
                      </div>
                      <ChevronRightIcon className="h-5 w-5 text-gray-300 group-hover:text-primary-500 translate-x-0 group-hover:translate-x-1 transition-all" />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-gray-400 font-black uppercase tracking-widest border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl">
                    No subjects found in this semester
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Step 4: Resources */}
        {currentSubject && (
          <motion.div
            key={`resources-${currentSubject}`}
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            <div className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-[2rem] border border-primary-100 dark:border-primary-800/50 mb-8 flex justify-between items-center">
              <h2 className="text-sm font-black text-primary-700 dark:text-primary-400 uppercase tracking-widest flex items-center">
                <BookOpenIcon className="h-5 w-5 mr-3" />
                {subjects.find((s) => String(s.id) === currentSubject)?.name ||
                  "Resources"}
              </h2>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : resources.length > 0 ? (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {resources.map((res) => (
                  <motion.div
                    key={res.id}
                    variants={item}
                    onClick={() => navigate(`/resources/${res.id}`)}
                    className="group bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary-100 dark:bg-primary-900/10 rounded-full blur-2xl -mt-8 -mr-8"></div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="inline-flex items-center px-2.5 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-primary-100 dark:border-primary-800/30">
                        {res.type}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase leading-tight mb-2 group-hover:text-primary-600 transition-colors">
                      {res.title}
                    </h4>
                    <p className="text-[10px] font-bold text-gray-400 line-clamp-2 mb-4">
                      {res.description || "No description provided."}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700/50">
                      <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        {res.uploaded_by}
                      </div>
                      <div className="flex items-center text-primary-600 font-bold text-[10px] uppercase tracking-widest group-hover:gap-2 transition-all">
                        View Now
                        <ChevronRightIcon className="h-3 w-3" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20 bg-gray-50/50 dark:bg-gray-900/30 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                <FolderIcon className="h-16 w-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                <p className="text-gray-400 font-black uppercase tracking-widest">
                  No resources found for this subject
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

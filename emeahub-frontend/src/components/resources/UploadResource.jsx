import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { resourceService } from "../../services/resources";
import API from "../../services/api";
import CustomSelect from "../common/CustomSelect";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const schema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string(),
  type: yup.string().required("Resource type is required"),
  subject_id: yup.string().required("Subject is required"),
  module_id: yup.string(),
  semester: yup.string().required("Semester is required"),
  file: yup.mixed().required("File is required"),
});

export default function UploadResource() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const watchDepartment = watch("department_id");
  const watchSubject = watch("subject_id");
  const watchSemester = watch("semester");

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
      const response = await API.get("/departments");
      setDepartments(response.data.departments);
    } catch {
      toast.error("Failed to fetch departments");
    }
  };

  const fetchSubjects = async (departmentId, semester) => {
    try {
      const response = await API.get("/subjects/by-department", {
        params: { department_id: departmentId, semester },
      });
      setSubjects(response.data.subjects);
    } catch {
      toast.error("Failed to fetch subjects");
    }
  };

  const fetchModules = async (subjectId) => {
    try {
      const response = await API.get(`/subjects/${subjectId}/modules`);
      setModules(response.data.modules);
    } catch {
      console.error("Failed to fetch modules");
    }
  };

  const onSubmit = async (data) => {
    setUploading(true);
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (data[key]) {
          formData.append(key, data[key]);
        }
      });
      await resourceService.uploadResource(formData, (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        setUploadProgress(percent);
      });
      toast.success("Resource uploaded successfully! Pending verification.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 animate-in fade-in duration-700">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-3xl mb-6 shadow-inner">
          <CloudArrowUpIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-3 uppercase">
          Share Your Knowledge
        </h1>
        <p className="text-gray-500 font-medium max-w-lg mx-auto uppercase text-[10px] tracking-[0.2em] leading-relaxed">
          Upload your notes, pyqs or study materials to help the community and
          earn reputation points.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700/50 p-8 sm:p-12 space-y-8">
            <div className="space-y-6">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 pb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                Content Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                    Resource Title *
                  </label>
                  <input
                    {...register("title")}
                    className="w-full px-6 py-4 bg-gray-50/50 dark:bg-gray-900/50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                    placeholder="e.g. Module 3 Notes - Discrete Mathematics"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-[10px] font-bold mt-2 ml-1 uppercase">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                    Description (Optional)
                  </label>
                  <textarea
                    {...register("description")}
                    rows="4"
                    className="w-full px-6 py-4 bg-gray-50/50 dark:bg-gray-900/50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 transition-all resize-none"
                    placeholder="Add some details about this resource..."
                  />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 pb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                Classification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                    Resource Type *
                  </label>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        options={[
                          { value: "note", label: "Notes" },
                          { value: "pyq", label: "PYQ" },
                          { value: "syllabus", label: "Syllabus" },
                          { value: "timetable", label: "Timetable" },
                          { value: "other", label: "Other" },
                        ]}
                      />
                    )}
                  />
                  {errors.type && (
                    <p className="text-red-500 text-[10px] font-bold mt-2 ml-1 uppercase">
                      {errors.type.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                    Course Category (FYUGP)
                  </label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        options={[
                          { value: "major", label: "Major" },
                          { value: "minor", label: "Minor" },
                          { value: "mdc", label: "MDC" },
                          { value: "vac", label: "VAC" },
                          { value: "sec", label: "SEC" },
                          { value: "aec", label: "AEC" },
                          { value: "other", label: "Other" },
                        ]}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 pb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Academic Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                    Department *
                  </label>
                  <Controller
                    name="department_id"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        options={departments.map((d) => ({
                          value: d.id,
                          label: d.name,
                        }))}
                      />
                    )}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                    Semester *
                  </label>
                  <Controller
                    name="semester"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        options={[1, 2, 3, 4, 5, 6, 7, 8].map((s) => ({
                          value: s,
                          label: `Semester ${s}`,
                        }))}
                      />
                    )}
                  />
                </div>
                {watchDepartment && watchSemester && (
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                      Subject *
                    </label>
                    <Controller
                      name="subject_id"
                      control={control}
                      render={({ field }) => (
                        <CustomSelect
                          {...field}
                          options={subjects.map((s) => ({
                            value: s.id,
                            label: s.name,
                          }))}
                        />
                      )}
                    />
                    {errors.subject_id && (
                      <p className="text-red-500 text-[10px] font-bold mt-2 ml-1 uppercase">
                        {errors.subject_id.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700/50 p-8 space-y-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-1">
              Attach File *
            </h3>
            <div
              className={`relative group border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300 ${selectedFile ? "border-emerald-500 bg-emerald-50/10" : "border-gray-200 dark:border-gray-700 hover:border-primary-500"}`}
            >
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setSelectedFile(file);
                    setValue("file", file);
                  }
                }}
              />
              <div className="space-y-4">
                <div
                  className={`h-16 w-16 mx-auto rounded-2xl flex items-center justify-center transition-all duration-500 ${selectedFile ? "bg-emerald-100 text-emerald-600 scale-110" : "bg-gray-50 dark:bg-gray-900 text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-500"}`}
                >
                  <CloudArrowUpIcon className="h-8 w-8" />
                </div>
                {selectedFile ? (
                  <div className="space-y-1">
                    <p className="text-sm font-black text-gray-900 dark:text-white line-clamp-1">
                      {selectedFile.name}
                    </p>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">
                      Click or Drop
                    </p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                      PDF, DOCX, PPTX (MAX 20MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
            {errors.file && (
              <p className="text-red-500 text-[10px] font-bold mt-2 ml-1 text-center uppercase">
                {errors.file.message}
              </p>
            )}
            {uploading && (
              <div className="space-y-2 py-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
                  <span className="text-gray-400">Uploading</span>
                  <span className="text-primary-600">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-primary-500 h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-5 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {uploading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Syncing...
                </>
              ) : (
                "Confirm & Upload"
              )}
            </button>
          </div>
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-indigo-500/20">
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <h4 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              Guidelines
            </h4>
            <ul className="space-y-3">
              {[
                "Clear title strictly required",
                "Accurate categorization",
                "High quality readable files",
                "No advertisements/promos",
              ].map((rule, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-[10px] font-bold uppercase tracking-widest text-indigo-100"
                >
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-300 flex-shrink-0"></div>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
}

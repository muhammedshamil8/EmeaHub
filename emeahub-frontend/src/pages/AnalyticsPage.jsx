import { useState, useEffect } from "react";
import API from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { ChartBarIcon, BookOpenIcon, AcademicCapIcon, DocumentTextIcon, FunnelIcon } from "@heroicons/react/24/outline";

const TYPE_COLORS = {
  note:     { bar: "bg-blue-500",    badge: "bg-blue-100 text-blue-700",    label: "Notes" },
  pyq:      { bar: "bg-amber-500",   badge: "bg-amber-100 text-amber-700",  label: "PYQs" },
  syllabus: { bar: "bg-purple-500",  badge: "bg-purple-100 text-purple-700", label: "Syllabus" },
  other:    { bar: "bg-gray-400",    badge: "bg-gray-100 text-gray-700",    label: "Other" },
};

function SemesterBar({ data, maxTotal }) {
  const width = maxTotal > 0 ? (data.total / maxTotal) * 100 : 0;
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="w-12 text-xs font-bold text-gray-500 dark:text-gray-400 shrink-0">Sem {data.semester}</span>
      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-5 overflow-hidden relative">
        <div className="flex h-full" style={{ width: `${Math.max(width, data.total > 0 ? 4 : 0)}%` }}>
          {data.by_type.note > 0    && <div className={`${TYPE_COLORS.note.bar} h-full`}    style={{ width: `${(data.by_type.note / data.total) * 100}%` }} title={`${data.by_type.note} Notes`} />}
          {data.by_type.pyq > 0     && <div className={`${TYPE_COLORS.pyq.bar} h-full`}     style={{ width: `${(data.by_type.pyq / data.total) * 100}%` }} title={`${data.by_type.pyq} PYQs`} />}
          {data.by_type.syllabus > 0 && <div className={`${TYPE_COLORS.syllabus.bar} h-full`} style={{ width: `${(data.by_type.syllabus / data.total) * 100}%` }} title={`${data.by_type.syllabus} Syllabus`} />}
          {data.by_type.other > 0   && <div className={`${TYPE_COLORS.other.bar} h-full`}   style={{ width: `${(data.by_type.other / data.total) * 100}%` }} title={`${data.by_type.other} Other`} />}
        </div>
      </div>
      <span className="w-8 text-xs font-bold text-gray-700 dark:text-gray-300 text-right shrink-0">
        {data.total}
      </span>
    </div>
  );
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await API.get("/analytics");
      if (res.data.success) {
        setAnalytics(res.data.analytics);
        if (res.data.analytics.length > 0) setSelected(res.data.analytics[0]);
      }
    } catch (e) {
      console.error("Failed to load analytics", e);
    } finally {
      setLoading(false);
    }
  };

  const maxTotal = selected
    ? Math.max(...selected.semesters.map((s) => s.total), 1)
    : 1;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="h-16 w-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Processing insights...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 px-6 py-12 animate-in fade-in duration-700">
      {/* Premium Header */}
      <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 shadow-2xl p-10 sm:p-20 text-center">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          
          <div className="relative z-10">
              <div className="inline-flex items-center justify-center p-5 bg-white/10 backdrop-blur-xl rounded-[2rem] mb-8 border border-white/20 shadow-2xl">
                  <ChartBarIcon className="h-12 w-12 text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]" />
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 drop-shadow-2xl">
                  Insight Hub
              </h1>
              <p className="text-indigo-100/80 text-lg font-bold max-w-2xl mx-auto uppercase tracking-widest leading-relaxed">
                  Real-time resource distribution and coverage metrics
              </p>
          </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="group bg-white dark:bg-gray-800 rounded-[2rem] p-8 shadow-xl border border-gray-100 dark:border-gray-700/50 hover:-translate-y-2 transition-all duration-300">
          <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <AcademicCapIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-4xl font-black text-gray-900 dark:text-white mb-2">{analytics.length}</p>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Departments</p>
        </div>
        
        <div className="group bg-white dark:bg-gray-800 rounded-[2rem] p-8 shadow-xl border border-gray-100 dark:border-gray-700/50 hover:-translate-y-2 transition-all duration-300">
          <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <BookOpenIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-4xl font-black text-gray-900 dark:text-white mb-2">
            {analytics.reduce((sum, d) => sum + d.total, 0)}
          </p>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Resources</p>
        </div>

        {Object.entries(TYPE_COLORS).slice(0, 2).map(([type, { label, bar }]) => (
          <div key={type} className="group bg-white dark:bg-gray-800 rounded-[2rem] p-8 shadow-xl border border-gray-100 dark:border-gray-700/50 hover:-translate-y-2 transition-all duration-300">
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${bar.replace('bg-', 'bg-').replace('500', '50')} dark:${bar.replace('bg-', 'bg-').replace('500', '900/30')}`}>
              <DocumentTextIcon className={`w-6 h-6 ${bar.replace('bg-', 'text-')}`} />
            </div>
            <p className="text-4xl font-black text-gray-900 dark:text-white mb-2">
              {analytics.reduce((sum, d) => sum + d.semesters.reduce((s, sem) => s + (sem.by_type[type] || 0), 0), 0)}
            </p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Department List */}
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
          <div className="p-8 border-b border-gray-50 dark:border-gray-700">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Select Department</h2>
          </div>
          <div className="max-h-[600px] overflow-y-auto overflow-x-hidden">
            {analytics.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelected(dept)}
                className={`w-full flex items-center justify-between px-8 py-6 text-left transition-all ${
                  selected?.id === dept.id
                    ? "bg-indigo-50 dark:bg-indigo-900/20"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                <div>
                  <p className={`text-sm font-black uppercase tracking-tight ${selected?.id === dept.id ? "text-indigo-600 dark:text-indigo-400" : "text-gray-900 dark:text-white"}`}>{dept.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{dept.code}</p>
                </div>
                <div className={`flex items-center justify-center h-10 w-10 rounded-xl font-black text-xs ${
                  selected?.id === dept.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/40"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500"
                }`}>
                  {dept.total}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Semester Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-700/50 p-10">
          {selected ? (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2 underline decoration-indigo-500 decoration-4 underline-offset-8 transition-all hover:decoration-indigo-400 uppercase">
                    {selected.name}
                  </h2>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em]">{selected.total} Total Verified Assets</p>
                </div>
                <div className="flex gap-4 flex-wrap">
                  {Object.entries(TYPE_COLORS).map(([type, { bar, label }]) => (
                    <span key={type} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700/50 text-[10px] font-black uppercase tracking-widest text-gray-500">
                      <span className={`w-2 h-2 rounded-full ${bar}`} />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="space-y-6">
                {selected.semesters.map((sem) => (
                  <SemesterBar key={sem.semester} data={sem} maxTotal={maxTotal} />
                ))}
              </div>

              {/* Advanced Detailed Breakdown */}
              <div className="mt-16 pt-10 border-t border-gray-50 dark:border-gray-700">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8 text-center italic">Category Breakdown</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {Object.entries(TYPE_COLORS).map(([type, { badge, label }]) => {
                      const total = selected.semesters.reduce((s, sem) => s + (sem.by_type[type] || 0), 0);
                      const percentage = selected.total > 0 ? Math.round((total / selected.total) * 100) : 0;
                      
                      return (
                        <div key={type} className="relative group bg-gray-50/50 dark:bg-gray-900/40 rounded-[2rem] p-6 text-center border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-all">
                            <span className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] mb-4 ${badge.replace('bg-', 'bg-').replace('text-', 'text-')}`}>
                                {label}
                            </span>
                            <p className="text-3xl font-black text-gray-900 dark:text-white mb-1 leading-none">{total}</p>
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{percentage}% coverage</p>
                        </div>
                      );
                    })}
                  </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400 space-y-4">
                <div className="h-20 w-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center animate-bounce">
                    <FunnelIcon className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Select a department to view distribution</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

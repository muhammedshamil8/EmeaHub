import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ResourceGrid from "../components/resources/ResourceGrid";
import ResourceFilters from "../components/resources/ResourceFilters";
import { resourceService } from "../services/resources";
import { useDebounce } from "../hooks/useDebounce";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  FadeIn,
} from "../components/common/MotionContainer";
import ResourceHierarchy from "../components/resources/ResourceHierarchy";
import {
  Squares2X2Icon,
  FolderIcon,
} from "@heroicons/react/24/outline";

export default function BrowseResources() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [viewMode, setViewMode] = useState("hierarchy");
  const searchQuery = searchParams.get("search") || "";
  const type = searchParams.get("type") || "";
  const semester = searchParams.get("semester") || "";
  const department = searchParams.get("department") || "";
  const subject = searchParams.get("subject") || "";
  const sort = searchParams.get("sort") || "popular";
  const page = parseInt(searchParams.get("page")) || 1;
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    fetchResources();
  }, [debouncedSearch, type, semester, department, subject, sort, page]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = {
        search: debouncedSearch,
        type,
        semester,
        department_id: department,
        subject_id: subject,
        sort,
        page,
      };
      Object.keys(params).forEach((key) => !params[key] && delete params[key]);
      const response = await resourceService.getResources(params);
      setResources(response.data.data);
      setPagination({
        currentPage: response.data.pagination.current_page,
        lastPage: response.data.pagination.last_page,
        total: response.data.pagination.total,
      });
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams(searchParams);
    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key]) {
        params.set(key, newFilters[key]);
      } else {
        params.delete(key);
      }
    });
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    setSearchParams(params);
  };

  const getPageTitle = () => {
    const types = {
      note: "Notes",
      pyq: "PYQs",
      syllabus: "Syllabus",
      timetable: "Timetable",
      other: "Other",
    };
    if (!type || !types[type]) return "EMEA Resources";
    return `EMEA ${types[type]}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 px-4 sm:px-0">
      <FadeIn>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700/50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 dark:bg-primary-900/10 rounded-full blur-3xl -mt-16 -mr-16 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10 space-y-2">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">
              {getPageTitle()}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs">
              Academic repository for emea college students
            </p>
          </div>
          <div className="relative z-10 inline-flex flex-col items-center md:items-end px-6 py-3 bg-gray-50 dark:bg-gray-900/50 text-primary-600 dark:text-primary-400 rounded-2xl border border-primary-100 dark:border-primary-800/50 shadow-inner">
            <span className="text-3xl font-black italic tracking-tighter leading-none">
              {pagination.total}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest mt-1">
              Materials Found
            </span>
          </div>
        </div>
      </FadeIn>
      <FadeIn delay={0.1}>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setViewMode("hierarchy")}
            className={`p-3 rounded-2xl border transition-all ${viewMode === "hierarchy" ? "bg-primary-600 text-white border-primary-600" : "bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-700"}`}
            title="Folder View"
          >
            <FolderIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-3 rounded-2xl border transition-all ${viewMode === "grid" ? "bg-primary-600 text-white border-primary-600" : "bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-700"}`}
            title="Grid View"
          >
            <Squares2X2Icon className="h-5 w-5" />
          </button>
        </div>
      </FadeIn>
      {viewMode === "hierarchy" ? (
        <FadeIn delay={0.2}>
          <ResourceHierarchy />
        </FadeIn>
      ) : (
        <>
          <FadeIn delay={0.2}>
            <ResourceFilters
              filters={{
                search: searchQuery,
                type,
                semester,
                department,
                subject,
                sort,
              }}
              onFilterChange={handleFilterChange}
            />
          </FadeIn>

          {loading ? (
            <div className="py-24 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <FadeIn delay={0.3}>
              <ResourceGrid resources={resources} />

              {pagination.lastPage > 1 && (
                <div className="flex justify-center flex-wrap gap-3 mt-16">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-600 dark:text-gray-400 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-lg"
                  >
                    Previous
                  </button>
                  <div className="flex gap-2">
                    {[...Array(pagination.lastPage)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-sm transition-all shadow-lg ${
                          page === i + 1
                            ? "bg-primary-600 text-white border-transparent"
                            : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === pagination.lastPage}
                    className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-600 dark:text-gray-400 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-lg"
                  >
                    Next
                  </button>
                </div>
              )}
            </FadeIn>
          )}
        </>
      )}
    </div>
  );
}

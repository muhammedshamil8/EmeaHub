import { Link, useLocation } from "react-router-dom";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/20/solid";

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (location.pathname === "/" || pathnames.length === 0) return null;

  return (
    <nav
      className="max-w-5xl mx-auto flex mb-6 animate-in fade-in slide-in-from-top-4 duration-500 overflow-x-auto no-scrollbar py-2"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        <li>
          <div>
            <Link
              to="/"
              className="text-gray-400 hover:text-primary-600 transition-colors"
            >
              <HomeIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          // Skip numeric IDs to keep it clean
          if (/^\d+$/.test(value)) return null;

          return (
            <li key={to}>
              <div className="flex items-center">
                <ChevronRightIcon
                  className="h-4 w-4 flex-shrink-0 text-gray-300 dark:text-gray-600"
                  aria-hidden="true"
                />
                <Link
                  to={to}
                  className={`ml-2 text-[10px] font-black uppercase tracking-widest transition-colors ${
                    last
                      ? "text-primary-600 dark:text-primary-400 cursor-default"
                      : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  }`}
                  aria-current={last ? "page" : undefined}
                >
                  {value.replace(/-/g, " ")}
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

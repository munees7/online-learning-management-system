import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchCourses } from "../redux/slices/courseSlice";
import CourseCard from "../components/common/CourseCard";
import { CourseSkeleton } from "../components/common/Skeleton";
import Navbar from "../components/layout/Navbar";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";

const categories = ["All", "Web Development", "Backend", "Full Stack", "Data Science", "DevOps", "Mobile"];
const levels = ["All", "Beginner", "Intermediate", "Advanced"];

export default function Courses() {
  const dispatch = useDispatch();
  const { courses, loading, total, pages } = useSelector((s) => s.courses);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    level: "",
    isFree: "",
    sort: "newest",
    page: 1,
  });

  useEffect(() => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.category && filters.category !== "All") params.category = filters.category;
    if (filters.level && filters.level !== "All") params.level = filters.level;
    if (filters.isFree !== "") params.isFree = filters.isFree;
    params.sort = filters.sort;
    params.page = filters.page;
    dispatch(fetchCourses(params));
  }, [filters, dispatch]);

  const updateFilter = (key, val) => setFilters((f) => ({ ...f, [key]: val, page: 1 }));

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Courses</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{total} courses available</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text" value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            placeholder="Search courses..."
            className="input pl-12 text-base h-12"
          />
          {filters.search && (
            <button onClick={() => updateFilter("search", "")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <FiX />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {/* Free/Paid */}
          <div className="flex gap-2">
            {[{ label: "All", val: "" }, { label: "🟢 Free", val: "true" }, { label: "💰 Paid", val: "false" }].map(({ label, val }) => (
              <button key={val} onClick={() => updateFilter("isFree", val)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${filters.isFree === val ? "bg-blue-600 text-white border-blue-600" : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-400"}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Level */}
          <select value={filters.level} onChange={(e) => updateFilter("level", e.target.value)}
            className="input w-auto px-4 py-2 text-sm">
            {levels.map((l) => <option key={l} value={l === "All" ? "" : l}>{l}</option>)}
          </select>

          {/* Sort */}
          <select value={filters.sort} onChange={(e) => updateFilter("sort", e.target.value)}
            className="input w-auto px-4 py-2 text-sm">
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Top Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {categories.map((cat) => (
            <button key={cat} onClick={() => updateFilter("category", cat === "All" ? "" : cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all border flex-shrink-0 ${(filters.category === cat || (cat === "All" && !filters.category)) ? "bg-blue-600 text-white border-blue-600" : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-400"}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? Array(8).fill(0).map((_, i) => <CourseSkeleton key={i} />) :
            courses.length === 0 ? (
              <div className="col-span-full text-center py-20 text-gray-400">
                <FiSearch className="text-5xl mx-auto mb-4 opacity-30" />
                <p className="text-lg">No courses found</p>
              </div>
            ) : courses.map((c) => <CourseCard key={c._id} course={c} />)}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setFilters((f) => ({ ...f, page: p }))}
                className={`w-10 h-10 rounded-xl font-semibold text-sm transition-all ${filters.page === p ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-400"}`}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

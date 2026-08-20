import { useEffect, useState } from "react";
import { getAdminCourses } from "../../services/api";
import { FiUsers, FiStar, FiDollarSign } from "react-icons/fi";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminCourses().then((r) => { setCourses(r.data.courses); setLoading(false); });
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">All Courses ({courses.length})</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {["Course", "Instructor", "Price", "Students", "Rating", "Status"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 dark:text-gray-400 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c._id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={c.thumbnail} alt={c.title} className="w-12 h-12 object-cover rounded-lg" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{c.title}</p>
                        <p className="text-xs text-gray-500">{c.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{c.instructor?.name}</td>
                  <td className="px-4 py-3">
                    {c.isFree ? (
                      <span className="text-green-600 dark:text-green-400 font-semibold">Free</span>
                    ) : (
                      <span className="text-gray-900 dark:text-white font-semibold">₹{c.price}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400"><FiUsers className="inline mr-1" />{c.totalStudents}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400"><FiStar className="inline mr-1 text-amber-400" />{c.ratings}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.isPublished ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>
                      {c.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

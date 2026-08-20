import { useEffect, useState } from "react";
import { getAnalytics } from "../../services/api";
import { motion } from "framer-motion";
import { FiUsers, FiBookOpen, FiTrendingUp, FiStar, FiDollarSign } from "react-icons/fi";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics().then((r) => { setData(r.data.analytics); setLoading(false); });
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  const stats = [
    { icon: FiUsers, label: "Total Users", value: data.totalUsers, sub: `${data.students} students, ${data.instructors} instructors`, color: "blue" },
    { icon: FiBookOpen, label: "Total Courses", value: data.totalCourses, sub: `${data.freeCourses} free, ${data.paidCourses} paid`, color: "purple" },
    { icon: FiTrendingUp, label: "Enrollments", value: data.totalEnrollments, sub: `${data.freeEnrollments} free, ${data.paidEnrollments} paid`, color: "green" },
    { icon: FiStar, label: "Reviews", value: data.totalReviews, sub: "Total reviews", color: "amber" },
  ];

  const colorMap = { blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600", purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600", green: "bg-green-100 dark:bg-green-900/30 text-green-600", amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-600" };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Admin Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, sub, color }, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[color]}`}>
              <Icon className="text-lg" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Free vs Paid chart */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Enrollment Breakdown</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">🟢 Free Enrollments</span>
                <span className="font-semibold">{data.freeEnrollments}</span>
              </div>
              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${data.totalEnrollments ? (data.freeEnrollments / data.totalEnrollments) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">💰 Paid Enrollments</span>
                <span className="font-semibold">{data.paidEnrollments}</span>
              </div>
              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${data.totalEnrollments ? (data.paidEnrollments / data.totalEnrollments) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Course Breakdown</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">🟢 Free Courses</span>
                <span className="font-semibold">{data.freeCourses}</span>
              </div>
              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${data.totalCourses ? (data.freeCourses / data.totalCourses) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">💰 Paid Courses</span>
                <span className="font-semibold">{data.paidCourses}</span>
              </div>
              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${data.totalCourses ? (data.paidCourses / data.totalCourses) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent enrollments */}
      <div className="card p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Enrollments</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left py-2 text-gray-500 dark:text-gray-400 font-medium">Student</th>
                <th className="text-left py-2 text-gray-500 dark:text-gray-400 font-medium">Course</th>
                <th className="text-left py-2 text-gray-500 dark:text-gray-400 font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              {data.recentEnrollments?.map((e) => (
                <tr key={e._id} className="border-b border-gray-50 dark:border-gray-900">
                  <td className="py-3 text-gray-900 dark:text-white">{e.userId?.name}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400 truncate max-w-xs">{e.courseId?.title}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${e.paymentStatus === "free" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}`}>
                      {e.paymentStatus === "free" ? "🟢 Free" : "💰 Paid"}
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

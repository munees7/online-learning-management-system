import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchEnrollments } from "../../redux/slices/enrollSlice";
import { motion } from "framer-motion";
import { FiBookOpen, FiAward, FiTrendingUp, FiPlay } from "react-icons/fi";

export default function StudentDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { enrollments, loading } = useSelector((s) => s.enroll);

  useEffect(() => { dispatch(fetchEnrollments()); }, [dispatch]);

  const completed = enrollments.filter((e) => e.completed).length;
  const inProgress = enrollments.filter((e) => !e.completed && e.progress > 0).length;
  const avgProgress = enrollments.length ? Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / enrollments.length) : 0;

  const stats = [
    { icon: FiBookOpen, label: "Enrolled Courses", value: enrollments.length, color: "blue" },
    { icon: FiAward, label: "Completed", value: completed, color: "green" },
    { icon: FiTrendingUp, label: "In Progress", value: inProgress, color: "purple" },
    { icon: FiPlay, label: "Avg Progress", value: `${avgProgress}%`, color: "amber" },
  ];

  const colorMap = { blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400", green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400", purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400", amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name} 👋</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Continue your learning journey</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, color }, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[color]}`}>
              <Icon className="text-lg" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          </motion.div>
        ))}
      </div>

      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Continue Learning</h2>
      {loading ? (
        <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : enrollments.length === 0 ? (
        <div className="card p-10 text-center">
          <FiBookOpen className="text-5xl text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't enrolled in any courses yet</p>
          <Link to="/courses" className="btn-primary inline-flex">Browse Courses</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrollments.map((e) => {
            const course = e.courseId;
            if (!course) return null;
            return (
              <div key={e._id} className="card p-4">
                <img src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400"} alt={course.title} className="w-full h-32 object-cover rounded-xl mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">{course.title}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${e.progress}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{e.progress}%</span>
                </div>
                <Link to={`/learn/${course._id}`} className="btn-primary w-full text-center text-sm py-2 flex items-center justify-center gap-2">
                  <FiPlay className="text-xs" /> {e.progress > 0 ? "Continue" : "Start"}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

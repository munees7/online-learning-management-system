import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchInstructorCourses } from "../../redux/slices/courseSlice";
import { motion } from "framer-motion";
import { FiBookOpen, FiUsers, FiStar, FiPlusCircle, FiEdit } from "react-icons/fi";

export default function InstructorDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { instructorCourses: courses } = useSelector((s) => s.courses);

  useEffect(() => { dispatch(fetchInstructorCourses()); }, [dispatch]);

  const totalStudents = courses.reduce((s, c) => s + (c.totalStudents || 0), 0);
  const avgRating = courses.length ? (courses.reduce((s, c) => s + (c.ratings || 0), 0) / courses.length).toFixed(1) : 0;

  const stats = [
    { icon: FiBookOpen, label: "Total Courses", value: courses.length, color: "blue" },
    { icon: FiUsers, label: "Total Students", value: totalStudents, color: "green" },
    { icon: FiStar, label: "Avg Rating", value: avgRating, color: "amber" },
  ];

  const colorMap = { blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600", green: "bg-green-100 dark:bg-green-900/30 text-green-600", amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-600" };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Instructor Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome, {user?.name}</p>
        </div>
        <Link to="/instructor/create" className="btn-primary flex items-center gap-2">
          <FiPlusCircle /> New Course
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
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

      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Your Courses</h2>
      {courses.length === 0 ? (
        <div className="card p-10 text-center">
          <FiBookOpen className="text-5xl text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">No courses yet</p>
          <Link to="/instructor/create" className="btn-primary inline-flex items-center gap-2"><FiPlusCircle /> Create Course</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((course) => (
            <div key={course._id} className="card p-4 flex items-center gap-4">
              <img src={course.thumbnail} alt={course.title} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{course.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>{course.isFree ? "🟢 Free" : `💰 ₹${course.price}`}</span>
                  <span><FiUsers className="inline mr-1" />{course.totalStudents} students</span>
                  <span><FiStar className="inline mr-1 text-amber-400" />{course.ratings}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${course.isPublished ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
              <Link to={`/instructor/edit/${course._id}`} className="btn-secondary flex items-center gap-2 text-sm py-2">
                <FiEdit /> Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

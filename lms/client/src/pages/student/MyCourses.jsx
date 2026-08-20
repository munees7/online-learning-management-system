import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchEnrollments } from "../../redux/slices/enrollSlice";
import { FiBookOpen, FiPlay } from "react-icons/fi";

export default function MyCourses() {
  const dispatch = useDispatch();
  const { enrollments, loading } = useSelector((s) => s.enroll);

  useEffect(() => { dispatch(fetchEnrollments()); }, [dispatch]);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Courses</h1>
      {enrollments.length === 0 ? (
        <div className="card p-10 text-center">
          <FiBookOpen className="text-5xl text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">No courses yet</p>
          <Link to="/courses" className="btn-primary inline-flex">Browse Courses</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {enrollments.map((e) => {
            const course = e.courseId;
            if (!course) return null;
            return (
              <div key={e._id} className="card p-4">
                <img src={course.thumbnail} alt={course.title} className="w-full h-36 object-cover rounded-xl mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{course.title}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${e.progress}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{e.progress}%</span>
                </div>
                <Link to={`/learn/${course._id}`} className="btn-primary w-full text-center text-sm py-2 flex items-center justify-center gap-2">
                  <FiPlay /> {e.progress > 0 ? "Continue" : "Start"}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

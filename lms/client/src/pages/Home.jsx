import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchFeatured } from "../redux/slices/courseSlice";
import CourseCard from "../components/common/CourseCard";
import { CourseSkeleton } from "../components/common/Skeleton";
import Navbar from "../components/layout/Navbar";
import { FiArrowRight, FiBookOpen, FiUsers, FiAward, FiPlay } from "react-icons/fi";

const stats = [
  { icon: FiBookOpen, value: "500+", label: "Courses" },
  { icon: FiUsers, value: "10K+", label: "Students" },
  { icon: FiAward, value: "50+", label: "Instructors" },
  { icon: FiPlay, value: "2000+", label: "Video Lessons" },
];

const categories = ["Web Development", "Data Science", "Backend", "Full Stack", "DevOps", "Mobile"];

export default function Home() {
  const dispatch = useDispatch();
  const { featured, loading } = useSelector((s) => s.courses);

  useEffect(() => { dispatch(fetchFeatured()); }, [dispatch]);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-24 px-4">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
              🎓 Learn from the best instructors
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Unlock Your <span className="text-yellow-300">Potential</span><br />with Expert Courses
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Access hundreds of free and premium courses. Learn at your own pace, earn certificates, and advance your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/courses" className="bg-white text-blue-700 font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 justify-center">
                Explore Courses <FiArrowRight />
              </Link>
              <Link to="/register" className="bg-white/20 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/30 transition-all border border-white/30 flex items-center gap-2 justify-center">
                Start for Free
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white dark:bg-gray-900 py-12 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Icon className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{value}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Browse by Category</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <Link key={cat} to={`/courses?category=${cat}`}
              className="px-5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm hover:shadow-md">
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Courses</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Handpicked courses for you</p>
          </div>
          <Link to="/courses" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:gap-3 transition-all">
            View all <FiArrowRight />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? Array(8).fill(0).map((_, i) => <CourseSkeleton key={i} />) :
            featured.map((course) => <CourseCard key={course._id} course={course} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
        <p className="text-blue-100 text-lg mb-8">Join thousands of students already learning on LearnHub</p>
        <Link to="/register" className="bg-white text-blue-700 font-bold px-10 py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-lg inline-flex items-center gap-2">
          Get Started Free <FiArrowRight />
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <p>© 2024 LearnHub. Built with ❤️ using MERN Stack</p>
      </footer>
    </div>
  );
}

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiHeart, FiStar, FiUsers, FiClock } from "react-icons/fi";
import { toggleWishlistItem, fetchWishlist } from "../../redux/slices/wishlistSlice";
import toast from "react-hot-toast";

export default function CourseCard({ course }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items: wishlist } = useSelector((s) => s.wishlist);
  const isWishlisted = wishlist?.some((w) => w._id === course._id || w === course._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Login to add to wishlist");
    await dispatch(toggleWishlistItem(course._id));
    dispatch(fetchWishlist());
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <Link to={`/courses/${course._id}`} className="card group block">
      {/* Thumbnail */}
      <div className="relative overflow-hidden h-44">
        <img
          src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badge */}
        <div className="absolute top-3 left-3">
          {course.isFree ? (
            <span className="badge-free">🟢 Free</span>
          ) : (
            <span className="badge-paid">💰 ₹{course.price}</span>
          )}
        </div>
        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${
            isWishlisted ? "bg-red-500 text-white" : "bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500"
          }`}
        >
          <FiHeart className={isWishlisted ? "fill-current" : ""} />
        </button>
        {/* Level */}
        <div className="absolute bottom-3 right-3">
          <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-lg">{course.level}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">{course.category}</p>
        <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {course.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{course.description}</p>

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
            {course.instructor?.name?.charAt(0) || "I"}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">{course.instructor?.name || "Instructor"}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-3">
          <div className="flex items-center gap-1">
            <FiStar className="text-amber-400 fill-amber-400" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">{course.ratings || "0"}</span>
            <span>({course.totalRatings || 0})</span>
          </div>
          <div className="flex items-center gap-1">
            <FiUsers className="text-blue-400" />
            <span>{course.totalStudents || 0} students</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourse } from "../redux/slices/courseSlice";
import { enrollInCourse, fetchEnrollments } from "../redux/slices/enrollSlice";
import { toggleWishlistItem, fetchWishlist } from "../redux/slices/wishlistSlice";
import { getReviews, addReview } from "../services/api";
import Navbar from "../components/layout/Navbar";
import StarRating from "../components/common/StarRating";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiPlay, FiClock, FiUsers, FiStar, FiHeart, FiCheck, FiLock, FiBookOpen } from "react-icons/fi";

export default function CourseDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current: data, loading } = useSelector((s) => s.courses);
  const { user } = useSelector((s) => s.auth);
  const { enrollments } = useSelector((s) => s.enroll);
  const { items: wishlist } = useSelector((s) => s.wishlist);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [enrolling, setEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const isEnrolled = enrollments?.some((e) => e.courseId?._id === id || e.courseId === id);
  const isWishlisted = wishlist?.some((w) => w._id === id || w === id);

  useEffect(() => {
    dispatch(fetchCourse(id));
    if (user) { dispatch(fetchEnrollments()); dispatch(fetchWishlist()); }
    getReviews(id).then((r) => setReviews(r.data.reviews));
  }, [id, dispatch, user]);

  const handleEnroll = async () => {
    if (!user) return navigate("/login");
    setEnrolling(true);
    try {
      const res = await dispatch(enrollInCourse(id)).unwrap();
      if (res.clientSecret) {
        // Paid course - simulate payment for demo
        toast.success("Demo: Payment simulated! Enrolling...");
        const { confirmPayment } = await import("../services/api");
        await confirmPayment({ courseId: id, paymentIntentId: "demo_" + Date.now() });
        dispatch(fetchEnrollments());
        toast.success("Enrolled successfully!");
      } else {
        toast.success(res.message || "Enrolled!");
      }
    } catch (err) {
      toast.error(err || "Enrollment failed");
    }
    setEnrolling(false);
  };

  const handleWishlist = async () => {
    if (!user) return navigate("/login");
    await dispatch(toggleWishlistItem(id));
    dispatch(fetchWishlist());
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      const res = await addReview({ courseId: id, ...reviewForm });
      setReviews([res.data.review, ...reviews]);
      toast.success("Review added!");
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add review");
    }
  };

  if (loading || !data) return (
    <div className="min-h-screen"><Navbar />
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  const { course, lessons } = data;
  const totalDuration = lessons?.reduce((s, l) => s + (l.duration || 0), 0);

  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Hero */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex gap-2 mb-3">
              <span className="text-xs bg-blue-600 px-3 py-1 rounded-full">{course.category}</span>
              <span className="text-xs bg-gray-700 px-3 py-1 rounded-full">{course.level}</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-gray-300 mb-4">{course.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-1"><FiStar className="text-amber-400 fill-amber-400" /><span className="font-bold text-white">{course.ratings}</span><span>({course.totalRatings} reviews)</span></div>
              <div className="flex items-center gap-1"><FiUsers /><span>{course.totalStudents} students</span></div>
              <div className="flex items-center gap-1"><FiClock /><span>{totalDuration} min total</span></div>
              <div className="flex items-center gap-1"><FiBookOpen /><span>{lessons?.length} lessons</span></div>
            </div>
            <p className="text-sm text-gray-400 mt-3">By <span className="text-blue-400 font-medium">{course.instructor?.name}</span></p>
          </div>

          {/* Enroll Card */}
          <div className="card p-6 text-gray-900 dark:text-white self-start">
            <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover rounded-xl mb-4" />
            <div className="mb-4">
              {course.isFree ? (
                <span className="text-3xl font-extrabold text-green-600">Free</span>
              ) : (
                <span className="text-3xl font-extrabold text-gray-900 dark:text-white">₹{course.price}</span>
              )}
            </div>
            {isEnrolled ? (
              <button onClick={() => navigate(`/learn/${id}`)} className="btn-primary w-full flex items-center justify-center gap-2">
                <FiPlay /> Continue Learning
              </button>
            ) : (
              <button onClick={handleEnroll} disabled={enrolling} className="btn-primary w-full flex items-center justify-center gap-2">
                {enrolling ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :
                  course.isFree ? "Enroll Now" : `Buy Now — ₹${course.price}`}
              </button>
            )}
            <button onClick={handleWishlist} className={`w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all ${isWishlisted ? "border-red-400 text-red-500 bg-red-50 dark:bg-red-900/10" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-red-300"}`}>
              <FiHeart className={isWishlisted ? "fill-current" : ""} />
              {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-800 mb-8">
          {["overview", "lessons", "reviews"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold text-sm capitalize transition-all border-b-2 -mb-px ${activeTab === tab ? "border-blue-600 text-blue-600 dark:text-blue-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid md:grid-cols-2 gap-8">
            {course.whatYouLearn?.length > 0 && (
              <div className="card p-6">
                <h3 className="font-bold text-lg mb-4">What you'll learn</h3>
                <ul className="space-y-2">
                  {course.whatYouLearn.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <FiCheck className="text-green-500 mt-0.5 flex-shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {course.requirements?.length > 0 && (
              <div className="card p-6">
                <h3 className="font-bold text-lg mb-4">Requirements</h3>
                <ul className="space-y-2">
                  {course.requirements.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-blue-500 mt-0.5">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === "lessons" && (
          <div className="space-y-3">
            {lessons?.map((lesson, i) => (
              <div key={lesson._id} className="card p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{lesson.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{lesson.duration} min</p>
                </div>
                {lesson.isPreview || isEnrolled ? (
                  <button onClick={() => isEnrolled ? navigate(`/learn/${id}?lesson=${lesson._id}`) : null}
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                    <FiPlay className="text-xs" /> {lesson.isPreview ? "Preview" : "Watch"}
                  </button>
                ) : (
                  <FiLock className="text-gray-400" />
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            {isEnrolled && (
              <div className="card p-6">
                <h3 className="font-bold text-lg mb-4">Write a Review</h3>
                <form onSubmit={handleReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    <StarRating rating={reviewForm.rating} onRate={(r) => setReviewForm({ ...reviewForm, rating: r })} size="text-2xl" />
                  </div>
                  <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="input" rows={3} placeholder="Share your experience..." required />
                  <button type="submit" className="btn-primary">Submit Review</button>
                </form>
              </div>
            )}
            {reviews.map((r) => (
              <div key={r._id} className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {r.userId?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{r.userId?.name}</p>
                    <StarRating rating={r.rating} size="text-sm" />
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{r.comment}</p>
              </div>
            ))}
            {reviews.length === 0 && <p className="text-center text-gray-400 py-10">No reviews yet. Be the first!</p>}
          </div>
        )}
      </div>
    </div>
  );
}

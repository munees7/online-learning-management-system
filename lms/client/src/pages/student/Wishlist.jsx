import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "../../redux/slices/wishlistSlice";
import CourseCard from "../../components/common/CourseCard";
import { FiHeart } from "react-icons/fi";

export default function Wishlist() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.wishlist);

  useEffect(() => { dispatch(fetchWishlist()); }, [dispatch]);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Wishlist</h1>
      {items.length === 0 ? (
        <div className="card p-10 text-center">
          <FiHeart className="text-5xl text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Your wishlist is empty</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((course) => <CourseCard key={course._id} course={course} />)}
        </div>
      )}
    </div>
  );
}

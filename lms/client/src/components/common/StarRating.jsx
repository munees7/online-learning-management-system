import { FiStar } from "react-icons/fi";

export default function StarRating({ rating, onRate, size = "text-lg" }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} onClick={() => onRate && onRate(star)} className={`${size} transition-colors ${star <= rating ? "text-amber-400" : "text-gray-300 dark:text-gray-600"} ${onRate ? "hover:text-amber-400 cursor-pointer" : "cursor-default"}`}>
          <FiStar className={star <= rating ? "fill-current" : ""} />
        </button>
      ))}
    </div>
  );
}

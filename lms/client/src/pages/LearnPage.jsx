import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourse } from "../redux/slices/courseSlice";
import { fetchEnrollments, markProgress } from "../redux/slices/enrollSlice";
import { getLessons } from "../services/api";
import toast from "react-hot-toast";

export default function LearnPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current } = useSelector((s) => s.courses);
  const { enrollments } = useSelector((s) => s.enroll);
  const { user } = useSelector((s) => s.auth);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const enrollment = enrollments?.find((e) => e.courseId?._id === id || e.courseId === id);
  const completedIds = enrollment?.completedLessons || [];
  const progress = enrollment?.progress || 0;

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    dispatch(fetchCourse(id));
    dispatch(fetchEnrollments());
    getLessons(id).then((r) => {
      const list = r.data.lessons || [];
      setLessons(list);
      setActiveLesson(list[0]);
    });
  }, [id]);

  const handleComplete = async () => {
    if (!activeLesson) return;
    await dispatch(markProgress({ courseId: id, lessonId: activeLesson._id }));
    dispatch(fetchEnrollments());
    toast.success("Lesson marked complete!");
  };

  const currentIndex = lessons.findIndex((l) => l._id === activeLesson?._id);

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
        <button onClick={() => navigate("/courses/" + id)} className="text-gray-400 hover:text-white px-3 py-1 rounded">Back</button>
        <span className="font-semibold text-sm">{current?.course?.title}</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="px-3 py-1 rounded bg-gray-800 text-sm">Menu</button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col">
          <div className="bg-black w-full" style={{ aspectRatio: "16/9" }}>
            {activeLesson?.videoUrl ? (
              <iframe src={activeLesson.videoUrl} className="w-full h-full" allowFullScreen title={activeLesson.title} />
            ) : (
              <div className="w-full h-64 flex items-center justify-center text-gray-500">No video</div>
            )}
          </div>
          <div className="p-6 bg-gray-900 flex-1">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold">{activeLesson?.title}</h2>
                <p className="text-gray-400 text-sm mt-1">{activeLesson?.duration} min</p>
              </div>
              <button onClick={handleComplete} className="px-4 py-2 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white">
                {completedIds.includes(activeLesson?._id) ? "Completed" : "Mark Complete"}
              </button>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => currentIndex > 0 && setActiveLesson(lessons[currentIndex - 1])} disabled={currentIndex <= 0} className="px-4 py-2 rounded-xl bg-gray-800 text-sm disabled:opacity-40">Previous</button>
              <button onClick={() => currentIndex < lessons.length - 1 && setActiveLesson(lessons[currentIndex + 1])} disabled={currentIndex >= lessons.length - 1} className="px-4 py-2 rounded-xl bg-blue-600 text-sm disabled:opacity-40">Next</button>
            </div>
          </div>
        </div>
        {sidebarOpen && (
          <div className="w-80 bg-gray-900 border-l border-gray-800 overflow-y-auto">
            <div className="p-4 border-b border-gray-800">
              <p className="font-semibold text-sm">Course Content</p>
              <p className="text-xs text-gray-400 mt-1">{lessons.length} lessons - {progress}% complete</p>
            </div>
            <div className="p-2">
              {lessons.map((lesson, i) => {
                const done = completedIds.includes(lesson._id);
                const isActive = activeLesson?._id === lesson._id;
                return (
                  <button key={lesson._id} onClick={() => setActiveLesson(lesson)} className={"w-full flex items-center gap-3 p-3 rounded-xl text-left mb-1 " + (isActive ? "bg-blue-600/20" : "hover:bg-gray-800")}>
                    <div className={"w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold " + (done ? "bg-green-600" : isActive ? "bg-blue-600" : "bg-gray-700")}>
                      {done ? "v" : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={"text-sm font-medium truncate " + (isActive ? "text-blue-400" : "text-gray-300")}>{lesson.title}</p>
                      <p className="text-xs text-gray-500">{lesson.duration} min</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

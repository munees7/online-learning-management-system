import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourse, updateCourse, createLesson, deleteLesson } from "../../services/api";
import toast from "react-hot-toast";
import { FiSave, FiPlus, FiTrash2 } from "react-icons/fi";

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});
  const [lessonForm, setLessonForm] = useState({ title: "", videoUrl: "", duration: 0, order: 1, isPreview: false });
  const [addingLesson, setAddingLesson] = useState(false);

  useEffect(() => {
    getCourse(id).then((r) => {
      setCourse(r.data.course);
      setLessons(r.data.lessons);
      const c = r.data.course;
      setForm({ title: c.title, description: c.description, price: c.price, category: c.category, level: c.level, thumbnail: c.thumbnail, isPublished: c.isPublished });
      setLessonForm((f) => ({ ...f, order: r.data.lessons.length + 1 }));
    });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateCourse(id, { ...form, price: Number(form.price) });
      toast.success("Course updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
    setLoading(false);
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    setAddingLesson(true);
    try {
      const res = await createLesson({ ...lessonForm, courseId: id, duration: Number(lessonForm.duration) });
      setLessons([...lessons, res.data.lesson]);
      setLessonForm({ title: "", videoUrl: "", duration: 0, order: lessons.length + 2, isPreview: false });
      toast.success("Lesson added!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add lesson");
    }
    setAddingLesson(false);
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm("Delete this lesson?")) return;
    await deleteLesson(lessonId);
    setLessons(lessons.filter((l) => l._id !== lessonId));
    toast.success("Lesson deleted");
  };

  if (!course) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Course</h1>
      <div className="max-w-3xl space-y-6">
        {/* Course form */}
        <form onSubmit={handleUpdate} className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-900 dark:text-white">Course Details</h2>
          <input type="text" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" placeholder="Title" required />
          <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" rows={3} placeholder="Description" required />
          <div className="grid grid-cols-2 gap-4">
            <input type="number" value={form.price || 0} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input" placeholder="Price (0 = free)" min={0} />
            <input type="url" value={form.thumbnail || ""} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} className="input" placeholder="Thumbnail URL" />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isPublished || false} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="w-4 h-4 rounded text-blue-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Published</span>
            </label>
          </div>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave />} Save Changes
          </button>
        </form>

        {/* Lessons */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Lessons ({lessons.length})</h2>
          <div className="space-y-2 mb-6">
            {lessons.map((l, i) => (
              <div key={l._id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <span className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{l.title}</p>
                  <p className="text-xs text-gray-500">{l.duration} min {l.isPreview && "• Preview"}</p>
                </div>
                <button onClick={() => handleDeleteLesson(l._id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddLesson} className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Add New Lesson</h3>
            <input type="text" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} className="input" placeholder="Lesson title" required />
            <input type="url" value={lessonForm.videoUrl} onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })} className="input" placeholder="Video URL (YouTube embed)" />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" value={lessonForm.duration} onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })} className="input" placeholder="Duration (min)" min={0} />
              <input type="number" value={lessonForm.order} onChange={(e) => setLessonForm({ ...lessonForm, order: e.target.value })} className="input" placeholder="Order" min={1} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={lessonForm.isPreview} onChange={(e) => setLessonForm({ ...lessonForm, isPreview: e.target.checked })} className="w-4 h-4 rounded text-blue-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Free preview</span>
            </label>
            <button type="submit" disabled={addingLesson} className="btn-primary flex items-center gap-2 text-sm py-2">
              {addingLesson ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiPlus />} Add Lesson
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

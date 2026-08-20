import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCourse } from "../../services/api";
import toast from "react-hot-toast";
import { FiSave, FiDollarSign } from "react-icons/fi";

const categories = ["Web Development", "Backend", "Full Stack", "Data Science", "DevOps", "Mobile", "Design", "Other"];

export default function CreateCourse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", price: 0, category: "Web Development",
    level: "Beginner", thumbnail: "", language: "English",
    requirements: "", whatYouLearn: "", isPublished: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        requirements: form.requirements.split("\n").filter(Boolean),
        whatYouLearn: form.whatYouLearn.split("\n").filter(Boolean),
      };
      const res = await createCourse(payload);
      toast.success("Course created!");
      navigate(`/instructor/edit/${res.data.course._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create course");
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create New Course</h1>
      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card p-6 space-y-5">
            <h2 className="font-bold text-gray-900 dark:text-white">Basic Info</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Course Title *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input" placeholder="e.g. Complete React.js Bootcamp" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description *</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input" rows={4} placeholder="Describe your course..." required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Level</label>
                <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="input">
                  {["Beginner", "Intermediate", "Advanced"].map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Thumbnail URL</label>
              <input type="url" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                className="input" placeholder="https://..." />
            </div>
          </div>

          <div className="card p-6 space-y-5">
            <h2 className="font-bold text-gray-900 dark:text-white">Pricing</h2>
            <div className="flex gap-4">
              {[{ label: "🟢 Free", val: 0 }, { label: "💰 Paid", val: null }].map(({ label, val }) => (
                <button key={label} type="button"
                  onClick={() => setForm({ ...form, price: val === 0 ? 0 : 499 })}
                  className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${(val === 0 ? form.price === 0 : form.price > 0) ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"}`}>
                  {label}
                </button>
              ))}
            </div>
            {form.price > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Price (₹)</label>
                <div className="relative">
                  <FiDollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="input pl-10" min={1} />
                </div>
              </div>
            )}
          </div>

          <div className="card p-6 space-y-5">
            <h2 className="font-bold text-gray-900 dark:text-white">Course Content</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">What students will learn (one per line)</label>
              <textarea value={form.whatYouLearn} onChange={(e) => setForm({ ...form, whatYouLearn: e.target.value })}
                className="input" rows={4} placeholder="React Hooks&#10;Redux Toolkit&#10;REST APIs" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Requirements (one per line)</label>
              <textarea value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                className="input" rows={3} placeholder="Basic JavaScript&#10;HTML/CSS knowledge" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Publish immediately</span>
            </label>
          </div>

          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave />}
            Create Course
          </button>
        </form>
      </div>
    </div>
  );
}

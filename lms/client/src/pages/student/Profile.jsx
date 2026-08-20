import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiSave } from "react-icons/fi";

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: user?.name || "", bio: user?.bio || "", avatar: user?.avatar || "" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dispatch(updateUserProfile(form)).unwrap();
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err || "Update failed");
    }
    setSaving(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Profile</h1>
      <div className="max-w-2xl">
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input pl-10" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={user?.email} className="input pl-10 bg-gray-50 dark:bg-gray-800 cursor-not-allowed" disabled />
              </div>
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="input" rows={3} placeholder="Tell us about yourself..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Avatar URL</label>
              <input type="url" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                className="input" placeholder="https://..." />
            </div>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave />}
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

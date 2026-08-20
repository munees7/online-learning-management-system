import { useEffect, useState } from "react";
import { getAdminUsers, updateAdminUser, deleteAdminUser } from "../../services/api";
import toast from "react-hot-toast";
import { FiTrash2, FiEdit2, FiCheck, FiX } from "react-icons/fi";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editRole, setEditRole] = useState("");

  useEffect(() => {
    getAdminUsers().then((r) => { setUsers(r.data.users); setLoading(false); });
  }, []);

  const handleRoleUpdate = async (id) => {
    try {
      const res = await updateAdminUser(id, { role: editRole });
      setUsers(users.map((u) => (u._id === id ? res.data.user : u)));
      setEditId(null);
      toast.success("Role updated");
    } catch { toast.error("Update failed"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    await deleteAdminUser(id);
    setUsers(users.filter((u) => u._id !== id));
    toast.success("User deleted");
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Users ({users.length})</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {["Name", "Email", "Role", "Joined", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 dark:text-gray-400 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {user.name?.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{user.email}</td>
                  <td className="px-4 py-3">
                    {editId === user._id ? (
                      <div className="flex items-center gap-2">
                        <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="input py-1 px-2 text-xs w-28">
                          {["student", "instructor", "admin"].map((r) => <option key={r}>{r}</option>)}
                        </select>
                        <button onClick={() => handleRoleUpdate(user._id)} className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"><FiCheck /></button>
                        <button onClick={() => setEditId(null)} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><FiX /></button>
                      </div>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === "admin" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : user.role === "instructor" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}`}>
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditId(user._id); setEditRole(user.role); }} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => handleDelete(user._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

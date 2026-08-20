import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiHome, FiBookOpen, FiHeart, FiUser, FiPlusCircle,
  FiList, FiUsers, FiBarChart2, FiSettings
} from "react-icons/fi";

const studentLinks = [
  { to: "/student", icon: FiHome, label: "Dashboard" },
  { to: "/student/courses", icon: FiBookOpen, label: "My Courses" },
  { to: "/student/wishlist", icon: FiHeart, label: "Wishlist" },
  { to: "/student/profile", icon: FiUser, label: "Profile" },
];

const instructorLinks = [
  { to: "/instructor", icon: FiHome, label: "Dashboard" },
  { to: "/instructor/courses", icon: FiList, label: "My Courses" },
  { to: "/instructor/create", icon: FiPlusCircle, label: "Create Course" },
  { to: "/instructor/profile", icon: FiUser, label: "Profile" },
];

const adminLinks = [
  { to: "/admin", icon: FiBarChart2, label: "Analytics" },
  { to: "/admin/users", icon: FiUsers, label: "Users" },
  { to: "/admin/courses", icon: FiBookOpen, label: "Courses" },
];

export default function Sidebar() {
  const { user } = useSelector((s) => s.auth);
  const links = user?.role === "admin" ? adminLinks : user?.role === "instructor" ? instructorLinks : studentLinks;

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 p-4 flex flex-col gap-1">
      <div className="mb-4 px-4 py-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {user?.role === "admin" ? "Admin Panel" : user?.role === "instructor" ? "Instructor" : "Student"}
        </p>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-1">{user?.name}</p>
      </div>
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} end={to.split("/").length === 2}
          className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          <Icon className="text-lg" />
          <span>{label}</span>
        </NavLink>
      ))}
    </aside>
  );
}

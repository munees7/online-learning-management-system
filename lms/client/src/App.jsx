import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./redux/slices/authSlice";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/common/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminRegister from "./pages/AdminRegister";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import LearnPage from "./pages/LearnPage";

// Student
import StudentDashboard from "./pages/student/StudentDashboard";
import MyCourses from "./pages/student/MyCourses";
import Wishlist from "./pages/student/Wishlist";
import Profile from "./pages/student/Profile";

// Instructor
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import CreateCourse from "./pages/instructor/CreateCourse";
import EditCourse from "./pages/instructor/EditCourse";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCourses from "./pages/admin/AdminCourses";

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);
  const { darkMode } = useSelector((s) => s.ui);

  useEffect(() => { if (token) dispatch(loadUser()); }, [token, dispatch]);
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { background: darkMode ? "#1f2937" : "#fff", color: darkMode ? "#fff" : "#000" } }} />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-admin" element={<AdminRegister />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/learn/:id" element={<ProtectedRoute><LearnPage /></ProtectedRoute>} />

        {/* Student */}
        <Route path="/student" element={<ProtectedRoute roles={["student"]}><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<StudentDashboard />} />
          <Route path="courses" element={<MyCourses />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Instructor */}
        <Route path="/instructor" element={<ProtectedRoute roles={["instructor", "admin"]}><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<InstructorDashboard />} />
          <Route path="courses" element={<InstructorDashboard />} />
          <Route path="create" element={<CreateCourse />} />
          <Route path="edit/:id" element={<EditCourse />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="courses" element={<AdminCourses />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadUser } from "../redux/slices/authSlice";
import toast from "react-hot-toast";

// This page handles the redirect from backend after Google OAuth success.
// URL: /auth/google/success?token=<jwt>
export default function GoogleAuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = params.get("token");
    const error = params.get("error");

    if (error || !token) {
      toast.error("Google sign-in failed. Please try again.");
      navigate("/login");
      return;
    }

    // Store token the same way the existing login does
    localStorage.setItem("lms_token", token);

    // Load user profile to populate Redux state, then redirect
    dispatch(loadUser()).then((action) => {
      if (action.payload?.user) {
        const role = action.payload.user.role;
        const path = role === "admin" ? "/admin" : role === "instructor" ? "/instructor" : "/student";
        navigate(path, { replace: true });
      } else {
        navigate("/student", { replace: true });
      }
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-950 dark:to-gray-900">
      <div className="flex flex-col items-center gap-4">
        <span className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-gray-600 dark:text-gray-400 text-sm">Signing you in...</p>
      </div>
    </div>
  );
}

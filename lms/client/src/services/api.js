import axios from "axios";

const API = axios.create({
  baseURL: "https://online-learning-management-system-1-i2ks.onrender.com/api",
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("lms_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const registerAdmin = (data) => API.post("/auth/register-admin", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");
export const updateProfile = (data) => API.put("/auth/profile", data);

// Courses
export const getCourses = (params) => API.get("/courses", { params });
export const getFeaturedCourses = () => API.get("/courses/featured");
export const getCourse = (id) => API.get(`/courses/${id}`);
export const createCourse = (data) => API.post("/courses", data);
export const updateCourse = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);
export const getInstructorCourses = () => API.get("/courses/instructor/my");

// Lessons
export const getLessons = (courseId) => API.get(`/lessons/${courseId}`);
export const createLesson = (data) => API.post("/lessons", data);
export const updateLesson = (id, data) => API.put(`/lessons/${id}`, data);
export const deleteLesson = (id) => API.delete(`/lessons/${id}`);

// Enrollment
export const enrollCourse = (courseId) => API.post("/enroll", { courseId });
export const confirmPayment = (data) => API.post("/enroll/confirm", data);
export const getEnrollments = () => API.get("/enroll");
export const checkEnrollment = (courseId) => API.get(`/enroll/check/${courseId}`);
export const updateProgress = (data) => API.put("/enroll/progress", data);

// Reviews
export const getReviews = (courseId) => API.get(`/reviews/${courseId}`);
export const addReview = (data) => API.post("/reviews", data);

// Wishlist
export const getWishlist = () => API.get("/wishlist");
export const toggleWishlist = (courseId) => API.post(`/wishlist/${courseId}`);

// Quiz & Certificates
export const getQuiz = (courseId) => API.get(`/quiz/${courseId}`);
export const submitQuiz = (data) => API.post("/quiz/submit", data);
export const getCertificate = (courseId) => API.get(`/quiz/certificate/${courseId}`);
export const getMyCertificates = () => API.get("/quiz/certificates/my");
export const getMyAttempt = (courseId) => API.get(`/quiz/attempt/${courseId}`);
export const createQuiz = (data) => API.post("/quiz", data);

// Admin
export const getAnalytics = () => API.get("/admin/analytics");
export const getAdminUsers = () => API.get("/admin/users");
export const updateAdminUser = (id, data) => API.put(`/admin/users/${id}`, data);
export const deleteAdminUser = (id) => API.delete(`/admin/users/${id}`);
export const getAdminCourses = () => API.get("/admin/courses");

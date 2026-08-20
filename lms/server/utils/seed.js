require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const Quiz = require("../models/Quiz");
const Certificate = require("../models/Certificate");
const QuizAttempt = require("../models/QuizAttempt");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  await User.deleteMany();
  await Course.deleteMany();
  await Lesson.deleteMany();
  await Quiz.deleteMany();
  await Certificate.deleteMany();
  await QuizAttempt.deleteMany();

  const adminPass = await bcrypt.hash("admin123", 12);
  await User.create({ name: "Admin User", email: "admin@lms.com", password: adminPass, role: "admin" });
  const instrPass = await bcrypt.hash("instr123", 12);
  const instructor = await User.create({ name: "John Instructor", email: "john@lms.com", password: instrPass, role: "instructor", bio: "Senior developer with 10 years experience" });
  const stuPass = await bcrypt.hash("student123", 12);
  await User.create({ name: "Jane Student", email: "jane@lms.com", password: stuPass, role: "student" });

  const courses = await Course.insertMany([
    { title: "Complete React.js Bootcamp", description: "Master React from scratch with hooks, Redux, and real projects.", price: 0, isFree: true, instructor: instructor._id, category: "Web Development", level: "Beginner", thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600", isPublished: true, totalStudents: 245, ratings: 4.8, totalRatings: 32, whatYouLearn: ["React Hooks", "Redux Toolkit", "REST APIs", "Deployment"], requirements: ["Basic HTML/CSS", "JavaScript fundamentals"] },
    { title: "Node.js & Express Masterclass", description: "Build scalable REST APIs with Node.js, Express, and MongoDB.", price: 999, isFree: false, instructor: instructor._id, category: "Backend", level: "Intermediate", thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600", isPublished: true, totalStudents: 189, ratings: 4.7, totalRatings: 28, whatYouLearn: ["REST APIs", "Authentication", "MongoDB", "Deployment"], requirements: ["JavaScript", "Basic Node.js"] },
    { title: "Python for Data Science", description: "Learn Python, Pandas, NumPy, and Machine Learning basics.", price: 1499, isFree: false, instructor: instructor._id, category: "Data Science", level: "Beginner", thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600", isPublished: true, totalStudents: 312, ratings: 4.9, totalRatings: 45, whatYouLearn: ["Python basics", "Pandas", "NumPy", "ML intro"], requirements: ["No prior experience needed"] },
    { title: "CSS & Tailwind Mastery", description: "Build beautiful responsive UIs with modern CSS and Tailwind.", price: 0, isFree: true, instructor: instructor._id, category: "Web Development", level: "Beginner", thumbnail: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600", isPublished: true, totalStudents: 178, ratings: 4.6, totalRatings: 22, whatYouLearn: ["Flexbox", "Grid", "Tailwind CSS", "Animations"], requirements: ["Basic HTML"] },
    { title: "Full Stack MERN Development", description: "Build complete web apps with MongoDB, Express, React, and Node.", price: 1999, isFree: false, instructor: instructor._id, category: "Full Stack", level: "Advanced", thumbnail: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=600", isPublished: true, totalStudents: 421, ratings: 4.9, totalRatings: 67, whatYouLearn: ["MERN Stack", "JWT Auth", "Deployment", "Real projects"], requirements: ["HTML/CSS/JS", "Basic React"] },
    { title: "Git & GitHub for Beginners", description: "Version control essentials every developer must know.", price: 0, isFree: true, instructor: instructor._id, category: "DevOps", level: "Beginner", thumbnail: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600", isPublished: true, totalStudents: 534, ratings: 4.7, totalRatings: 89, whatYouLearn: ["Git basics", "Branching", "Pull Requests", "GitHub Actions"], requirements: ["Basic command line"] },
    { title: "TypeScript Deep Dive", description: "Master TypeScript for large-scale JavaScript applications.", price: 799, isFree: false, instructor: instructor._id, category: "Web Development", level: "Intermediate", thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600", isPublished: true, totalStudents: 156, ratings: 4.8, totalRatings: 19, whatYouLearn: ["Types", "Interfaces", "Generics", "Decorators"], requirements: ["JavaScript ES6+"] },
    { title: "Docker & Kubernetes Basics", description: "Containerize and orchestrate your applications like a pro.", price: 1299, isFree: false, instructor: instructor._id, category: "DevOps", level: "Intermediate", thumbnail: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=600", isPublished: true, totalStudents: 98, ratings: 4.5, totalRatings: 14, whatYouLearn: ["Docker", "Kubernetes", "CI/CD", "Cloud deploy"], requirements: ["Linux basics", "Basic programming"] },
  ]);

  // Lessons with real YouTube embeds for every course
  await Lesson.insertMany([
    { courseId: courses[0]._id, title: "Introduction to React", videoUrl: "https://www.youtube.com/embed/Ke90Tje7VS0", duration: 15, order: 1, isPreview: true },
    { courseId: courses[0]._id, title: "JSX and Components", videoUrl: "https://www.youtube.com/embed/Ke90Tje7VS0", duration: 20, order: 2, isPreview: true },
    { courseId: courses[0]._id, title: "State and Props", videoUrl: "https://www.youtube.com/embed/Ke90Tje7VS0", duration: 25, order: 3, isPreview: false },
    { courseId: courses[0]._id, title: "React Hooks - useState & useEffect", videoUrl: "https://www.youtube.com/embed/Ke90Tje7VS0", duration: 30, order: 4, isPreview: false },
    { courseId: courses[0]._id, title: "Redux Toolkit Basics", videoUrl: "https://www.youtube.com/embed/Ke90Tje7VS0", duration: 28, order: 5, isPreview: false },
    { courseId: courses[1]._id, title: "Node.js Fundamentals", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4", duration: 20, order: 1, isPreview: true },
    { courseId: courses[1]._id, title: "Express Setup & Routing", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4", duration: 18, order: 2, isPreview: true },
    { courseId: courses[1]._id, title: "REST API Design", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4", duration: 35, order: 3, isPreview: false },
    { courseId: courses[1]._id, title: "JWT Authentication", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4", duration: 25, order: 4, isPreview: false },
    { courseId: courses[2]._id, title: "Python Basics", videoUrl: "https://www.youtube.com/embed/_uQrJ0TkZlc", duration: 22, order: 1, isPreview: true },
    { courseId: courses[2]._id, title: "Data Structures in Python", videoUrl: "https://www.youtube.com/embed/_uQrJ0TkZlc", duration: 30, order: 2, isPreview: false },
    { courseId: courses[2]._id, title: "Pandas & NumPy", videoUrl: "https://www.youtube.com/embed/_uQrJ0TkZlc", duration: 35, order: 3, isPreview: false },
    { courseId: courses[3]._id, title: "CSS Fundamentals", videoUrl: "https://www.youtube.com/embed/1Rs2ND1ryYc", duration: 18, order: 1, isPreview: true },
    { courseId: courses[3]._id, title: "Flexbox & Grid", videoUrl: "https://www.youtube.com/embed/1Rs2ND1ryYc", duration: 25, order: 2, isPreview: false },
    { courseId: courses[3]._id, title: "Tailwind CSS Setup", videoUrl: "https://www.youtube.com/embed/1Rs2ND1ryYc", duration: 20, order: 3, isPreview: false },
    { courseId: courses[4]._id, title: "MERN Stack Overview", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8", duration: 15, order: 1, isPreview: true },
    { courseId: courses[4]._id, title: "Building the Backend", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4", duration: 40, order: 2, isPreview: false },
    { courseId: courses[4]._id, title: "Building the Frontend", videoUrl: "https://www.youtube.com/embed/Ke90Tje7VS0", duration: 45, order: 3, isPreview: false },
    { courseId: courses[5]._id, title: "Git Init & Commits", videoUrl: "https://www.youtube.com/embed/RGOj5yH7evk", duration: 15, order: 1, isPreview: true },
    { courseId: courses[5]._id, title: "Branching & Merging", videoUrl: "https://www.youtube.com/embed/RGOj5yH7evk", duration: 20, order: 2, isPreview: false },
    { courseId: courses[5]._id, title: "GitHub Pull Requests", videoUrl: "https://www.youtube.com/embed/RGOj5yH7evk", duration: 18, order: 3, isPreview: false },
    { courseId: courses[6]._id, title: "TypeScript Basics", videoUrl: "https://www.youtube.com/embed/BwuLxPH8IDs", duration: 20, order: 1, isPreview: true },
    { courseId: courses[6]._id, title: "Interfaces & Types", videoUrl: "https://www.youtube.com/embed/BwuLxPH8IDs", duration: 25, order: 2, isPreview: false },
    { courseId: courses[6]._id, title: "Generics in TypeScript", videoUrl: "https://www.youtube.com/embed/BwuLxPH8IDs", duration: 30, order: 3, isPreview: false },
    { courseId: courses[7]._id, title: "Docker Introduction", videoUrl: "https://www.youtube.com/embed/3c-iBn73dDE", duration: 20, order: 1, isPreview: true },
    { courseId: courses[7]._id, title: "Docker Compose", videoUrl: "https://www.youtube.com/embed/3c-iBn73dDE", duration: 25, order: 2, isPreview: false },
    { courseId: courses[7]._id, title: "Kubernetes Basics", videoUrl: "https://www.youtube.com/embed/3c-iBn73dDE", duration: 35, order: 3, isPreview: false },
  ]);

  // Quizzes for every course (5 questions each, 80% passing)
  await Quiz.insertMany([
    {
      courseId: courses[0]._id, title: "React.js Final Quiz", passingScore: 80,
      questions: [
        { question: "What hook is used to manage state in React?", options: ["useEffect", "useState", "useContext", "useRef"], correctAnswer: 1 },
        { question: "What does JSX stand for?", options: ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Extension"], correctAnswer: 0 },
        { question: "Which method is used to render a React component to the DOM?", options: ["React.render()", "ReactDOM.render()", "React.mount()", "ReactDOM.mount()"], correctAnswer: 1 },
        { question: "What is the correct way to pass data to a child component?", options: ["state", "props", "context", "refs"], correctAnswer: 1 },
        { question: "Which hook runs after every render by default?", options: ["useState", "useCallback", "useEffect", "useMemo"], correctAnswer: 2 },
      ],
    },
    {
      courseId: courses[1]._id, title: "Node.js & Express Final Quiz", passingScore: 80,
      questions: [
        { question: "What is Node.js?", options: ["A browser", "A JavaScript runtime", "A database", "A framework"], correctAnswer: 1 },
        { question: "Which method handles GET requests in Express?", options: ["app.post()", "app.get()", "app.put()", "app.fetch()"], correctAnswer: 1 },
        { question: "What does REST stand for?", options: ["Remote Execution State Transfer", "Representational State Transfer", "Resource State Transfer", "Remote State Transfer"], correctAnswer: 1 },
        { question: "Which package is used for JWT in Node.js?", options: ["bcryptjs", "jsonwebtoken", "passport", "crypto"], correctAnswer: 1 },
        { question: "What status code means 'Created'?", options: ["200", "201", "204", "400"], correctAnswer: 1 },
      ],
    },
    {
      courseId: courses[2]._id, title: "Python for Data Science Quiz", passingScore: 80,
      questions: [
        { question: "Which library is used for data manipulation in Python?", options: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"], correctAnswer: 1 },
        { question: "What is a Python list?", options: ["Immutable sequence", "Mutable ordered collection", "Key-value pairs", "Unordered set"], correctAnswer: 1 },
        { question: "Which function creates a DataFrame in Pandas?", options: ["pd.Array()", "pd.DataFrame()", "pd.Table()", "pd.Matrix()"], correctAnswer: 1 },
        { question: "What does NumPy stand for?", options: ["Numerical Python", "New Python", "Number Python", "Numeric Package"], correctAnswer: 0 },
        { question: "Which method shows first 5 rows of a DataFrame?", options: ["df.top()", "df.first()", "df.head()", "df.show()"], correctAnswer: 2 },
      ],
    },
    {
      courseId: courses[3]._id, title: "CSS & Tailwind Quiz", passingScore: 80,
      questions: [
        { question: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"], correctAnswer: 1 },
        { question: "Which Tailwind class adds padding on all sides?", options: ["m-4", "p-4", "px-4", "py-4"], correctAnswer: 1 },
        { question: "What is Flexbox used for?", options: ["3D transforms", "One-dimensional layouts", "Two-dimensional layouts", "Animations"], correctAnswer: 1 },
        { question: "Which CSS property controls text color?", options: ["font-color", "text-color", "color", "foreground"], correctAnswer: 2 },
        { question: "What does 'responsive design' mean?", options: ["Fast loading", "Adapts to screen sizes", "Dark mode support", "Animated UI"], correctAnswer: 1 },
      ],
    },
    {
      courseId: courses[4]._id, title: "MERN Stack Final Quiz", passingScore: 80,
      questions: [
        { question: "What does MERN stand for?", options: ["MySQL Express React Node", "MongoDB Express React Node", "MongoDB Express Redux Node", "MongoDB Ember React Node"], correctAnswer: 1 },
        { question: "Which database does MERN use?", options: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"], correctAnswer: 2 },
        { question: "What is the role of Express in MERN?", options: ["Frontend framework", "Database ORM", "Backend web framework", "State manager"], correctAnswer: 2 },
        { question: "What is Mongoose?", options: ["A React library", "A MongoDB ODM", "An Express plugin", "A Node package manager"], correctAnswer: 1 },
        { question: "Which Redux Toolkit function creates a slice?", options: ["createStore()", "createSlice()", "createReducer()", "createAction()"], correctAnswer: 1 },
      ],
    },
    {
      courseId: courses[5]._id, title: "Git & GitHub Quiz", passingScore: 80,
      questions: [
        { question: "What command initializes a Git repository?", options: ["git start", "git init", "git create", "git new"], correctAnswer: 1 },
        { question: "What does 'git commit' do?", options: ["Uploads to GitHub", "Saves changes to history", "Creates a branch", "Merges branches"], correctAnswer: 1 },
        { question: "What is a Pull Request?", options: ["Downloading code", "Proposing changes for review", "Deleting a branch", "Cloning a repo"], correctAnswer: 1 },
        { question: "Which command creates a new branch?", options: ["git new branch", "git branch -n", "git checkout -b", "git create branch"], correctAnswer: 2 },
        { question: "What does 'git clone' do?", options: ["Creates a new repo", "Copies a remote repo locally", "Merges branches", "Deletes a repo"], correctAnswer: 1 },
      ],
    },
    {
      courseId: courses[6]._id, title: "TypeScript Final Quiz", passingScore: 80,
      questions: [
        { question: "TypeScript is a superset of which language?", options: ["Java", "Python", "JavaScript", "C#"], correctAnswer: 2 },
        { question: "What keyword defines a TypeScript interface?", options: ["type", "interface", "class", "struct"], correctAnswer: 1 },
        { question: "What is a generic in TypeScript?", options: ["A default value", "A reusable type parameter", "An any type", "A null check"], correctAnswer: 1 },
        { question: "Which type represents absence of value?", options: ["null", "undefined", "void", "never"], correctAnswer: 2 },
        { question: "What does the '?' operator mean in TypeScript?", options: ["Required property", "Optional property", "Nullable type", "Default value"], correctAnswer: 1 },
      ],
    },
    {
      courseId: courses[7]._id, title: "Docker & Kubernetes Quiz", passingScore: 80,
      questions: [
        { question: "What is a Docker container?", options: ["A virtual machine", "A lightweight isolated environment", "A cloud server", "A database"], correctAnswer: 1 },
        { question: "What file defines a Docker image?", options: ["docker.yml", "Dockerfile", "container.json", "image.conf"], correctAnswer: 1 },
        { question: "What does Kubernetes do?", options: ["Builds Docker images", "Orchestrates containers", "Stores data", "Monitors servers"], correctAnswer: 1 },
        { question: "What command runs a Docker container?", options: ["docker start", "docker run", "docker exec", "docker launch"], correctAnswer: 1 },
        { question: "What is a Kubernetes Pod?", options: ["A Docker image", "The smallest deployable unit", "A cluster node", "A service mesh"], correctAnswer: 1 },
      ],
    },
  ]);

  console.log("Seed data inserted!");
  console.log("Admin: admin@lms.com / admin123");
  console.log("Instructor: john@lms.com / instr123");
  console.log("Student: jane@lms.com / student123");
  process.exit();
};

seed().catch((err) => { console.error(err); process.exit(1); });

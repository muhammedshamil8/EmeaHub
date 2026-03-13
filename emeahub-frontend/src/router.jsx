import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import BrowseResources from "./pages/BrowseResources";
import ResourceView from "./pages/ResourceView";
import TimetableViewer from "./pages/TimetableViewer";
import SyllabusViewer from "./pages/SyllabusViewer";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import MyUploads from "./pages/MyUploads";
import About from "./pages/About";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PrivateRoute from "./components/auth/PrivateRoute";
import UploadResource from "./components/resources/UploadResource";
import TeacherDashboard from "./components/teacher/TeacherDashboard";
import PendingVerifications from "./components/teacher/PendingVerifications";
import TimetableManager from "./components/teacher/TimetableManager";
import AdminDashboard from "./components/admin/AdminDashboard";
import UserManagement from "./components/admin/UserManagement";
import ResourceManagement from "./components/admin/ResourceManagement";
import DepartmentManager from "./components/admin/DepartmentManager";
import SubjectManager from "./components/admin/SubjectManager";
import Leaderboard from "./components/gamification/Leaderboard";
import Achievements from "./components/gamification/Achievements";
import AIHub from "./pages/AIHub";
import AIChatPage from "./pages/AIChat";
import AISearchPage from "./pages/AISearchPage";
import StudyPlannerPage from "./pages/StudyPlannerPage";
import AISummarizePage from "./pages/AISummarizePage";
import AIRecommendPage from "./pages/AIRecommendPage";
import AIHistoryPage from "./pages/AIHistoryPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import BookmarksPage from "./pages/BookmarksPage";
import DashboardLayout from "./components/common/DashboardLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "about", element: <About /> },

      { path: "resources", element: <BrowseResources /> },
      { path: "resources/:id", element: <ResourceView /> },
      { path: "timetable", element: <TimetableViewer /> },
      { path: "syllabus", element: <SyllabusViewer /> },
      { path: "analytics", element: <AnalyticsPage /> },

      { path: "leaderboard", element: <Leaderboard /> },
      { path: "achievements", element: <Achievements /> },
      { path: "profile/:id", element: <PublicProfile /> },

      {
        element: <PrivateRoute />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "profile", element: <Profile /> },
          { path: "bookmarks", element: <BookmarksPage /> },
          { path: "my-uploads", element: <MyUploads /> },
          { path: "upload", element: <UploadResource /> },
        ],
      },
      {
        path: "teacher",
        element: <PrivateRoute allowedRoles={["teacher", "admin"]} />,
        children: [
          {
            element: <DashboardLayout role="teacher" />,
            children: [
              { path: "dashboard", element: <TeacherDashboard /> },
              { path: "pending", element: <PendingVerifications /> },
              { path: "timetable", element: <TimetableManager /> },
              { path: "upload", element: <UploadResource /> }, 
            ]
          }
        ],
      },
      {
        path: "admin",
        element: <PrivateRoute allowedRoles={["admin"]} />,
        children: [
          {
            element: <DashboardLayout role="admin" />,
            children: [
              { path: "dashboard", element: <AdminDashboard /> },
              { path: "users", element: <UserManagement /> },
              { path: "resources", element: <ResourceManagement /> },
              { path: "departments", element: <DepartmentManager /> },
              { path: "subjects", element: <SubjectManager /> },
              { path: "upload", element: <UploadResource /> }, 
            ]
          }
        ],
      },
      {
        path: "/ai",
        children: [
          { index: true, element: <AIHub /> }, 
          { path: "chat", element: <AIChatPage /> },
          { path: "search", element: <AISearchPage /> },
          { path: "planner", element: <StudyPlannerPage /> },
          { path: "summarize", element: <AISummarizePage /> },
          { path: "recommend", element: <AIRecommendPage /> },
          { path: "history", element: <AIHistoryPage /> },
        ],
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);


import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import SavedJobs from "./pages/SavedJobs";
import About from "./pages/About";
import Contact from "./pages/Contact";
import JobDetails from "./pages/JobDetails";
import Apply from "./pages/Apply";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Applications from "./pages/Applications";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/apply/:id" element={<ProtectedRoute><Apply /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><SavedJobs /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import StudentGroups from './pages/StudentGroups';
import StudentAssignments from './pages/StudentAssignments';
import Notes from './pages/Notes';
import StudentSubmit from './pages/StudentSubmit';
import FacultyDashboard from './pages/FacultyDashboard';
import ManageAssignments from './pages/ManageAssignments';
import Submissions from './pages/Submissions';
import FacultyGroups from './pages/FacultyGroups';
import ManageSchedule from './pages/ManageSchedule';
import Classrooms from './pages/Classrooms';
import Landing from './pages/Landing';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import { ThemeProvider } from './context/ThemeContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-primary flex items-center justify-center font-black text-accent animate-pulse tracking-widest uppercase">
      Initialising Secure Protocol...
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'faculty' ? '/faculty/dashboard' : '/student/dashboard'} replace />;

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Student Routes */}
            <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/group" element={<ProtectedRoute role="student"><StudentGroups /></ProtectedRoute>} />
            <Route path="/student/assignments" element={<ProtectedRoute role="student"><StudentAssignments /></ProtectedRoute>} />
            <Route path="/student/submit/:taskId" element={<ProtectedRoute role="student"><StudentSubmit /></ProtectedRoute>} />
            <Route path="/student/notes" element={<ProtectedRoute role="student"><Notes role="student" /></ProtectedRoute>} />

            {/* Faculty Routes */}
            <Route path="/faculty/dashboard" element={<ProtectedRoute role="faculty"><FacultyDashboard /></ProtectedRoute>} />
            <Route path="/faculty/assignments" element={<ProtectedRoute role="faculty"><ManageAssignments /></ProtectedRoute>} />
            {/* /faculty/submissions without an id = all submissions */}
            <Route path="/faculty/submissions" element={<ProtectedRoute role="faculty"><Submissions /></ProtectedRoute>} />
            {/* /faculty/submissions/:assignmentId = filtered to one assignment */}
            <Route path="/faculty/submissions/:assignmentId" element={<ProtectedRoute role="faculty"><Submissions /></ProtectedRoute>} />
            <Route path="/faculty/groups" element={<ProtectedRoute role="faculty"><FacultyGroups /></ProtectedRoute>} />
            <Route path="/faculty/schedule" element={<ProtectedRoute role="faculty"><ManageSchedule /></ProtectedRoute>} />
            <Route path="/faculty/notes" element={<ProtectedRoute role="faculty"><Notes role="faculty" /></ProtectedRoute>} />
            <Route path="/faculty/classrooms" element={<ProtectedRoute role="faculty"><Classrooms /></ProtectedRoute>} />

            {/* Default Route */}
            <Route path="/" element={<Landing />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

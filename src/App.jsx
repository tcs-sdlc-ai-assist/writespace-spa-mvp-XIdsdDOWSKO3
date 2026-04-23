import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import WriteBlog from './pages/WriteBlog';
import ReadBlog from './pages/ReadBlog';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import PublicNavbar from './components/PublicNavbar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <LandingPage />
            </>
          }
        />
        <Route
          path="/dashboard"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <PublicNavbar />
              <LoginPage />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <PublicNavbar />
              <RegisterPage />
            </>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <Navbar />
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/write"
          element={
            <>
              <Navbar />
              <WriteBlog />
            </>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <>
              <Navbar />
              <WriteBlog />
            </>
          }
        />
        <Route
          path="/blog/:id"
          element={
            <>
              <Navbar />
              <ReadBlog />
            </>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
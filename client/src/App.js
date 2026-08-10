import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookDetailPage from './pages/BookDetailPage';
import AddBookPage from './pages/AddBookPage';
import EditBookPage from './pages/EditBookPage';
import DashboardPage from './pages/DashboardPage';
import ExchangesPage from './pages/ExchangesPage';
import ExchangeDetailPage from './pages/ExchangeDetailPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
      <div className="spinner-gold"></div>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <>
    <Navbar />
    <main style={{ minHeight: 'calc(100vh - 140px)' }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/add-book" element={<PrivateRoute><AddBookPage /></PrivateRoute>} />
        <Route path="/edit-book/:id" element={<PrivateRoute><EditBookPage /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/exchanges" element={<PrivateRoute><ExchangesPage /></PrivateRoute>} />
        <Route path="/exchanges/:id" element={<PrivateRoute><ExchangeDetailPage /></PrivateRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
    <Footer />
  </>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#16213e', color: '#fffffe', border: '1px solid #2a2a4a' },
            success: { iconTheme: { primary: '#e8c547', secondary: '#0f0e17' } },
            error: { iconTheme: { primary: '#ff6b6b', secondary: '#0f0e17' } }
          }}
        />
      </Router>
    </AuthProvider>
  );
}

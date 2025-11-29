import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import ChatWidget from './components/chat/ChatWidget';
import Chatbot from './components/chatbot/Chatbot';

// Public Pages
import Home from './pages/Home';
import Browse from './pages/Browse';
import MovieDetailsPage from './pages/MovieDetailsPage';
import Login from './pages/Login';
import Register from './pages/Register';
import DiscoverWatchlists from './pages/DiscoverWatchlists';

// Protected Pages
import Profile from './pages/Profile';
import Watchlists from './pages/Watchlists';
import WatchlistDetails from './components/watchlist/WatchlistDetails';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminMovies from './pages/admin/AdminMovies';
import AdminImport from './pages/admin/AdminImport';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Create a wrapper component that has access to useAuth
function AppContent() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-dark">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/discover/watchlists" element={<DiscoverWatchlists />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watchlists"
            element={
              <ProtectedRoute>
                <Watchlists />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watchlist/:id"
            element={
              <ProtectedRoute>
                <WatchlistDetails />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/movies"
            element={
              <AdminRoute>
                <AdminMovies />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/import"
            element={
              <AdminRoute>
                <AdminImport />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      {/* <ChatWidget /> */}
      {user && <Chatbot />}  {/* ← ONLY SHOW IF LOGGED IN */}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppContent />  {/* ← MOVED CONTENT TO SEPARATE COMPONENT */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

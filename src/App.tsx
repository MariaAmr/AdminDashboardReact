import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { validateToken, scheduleTokenRefresh } from "./auth/auth";
import Loader from "./Loader/Loader";
import { AuthProvider } from "./auth/AuthProvider";
import { useAuth } from "./auth/userAuth";

// Import your page components
import Login from "./LoginPage/LoginPage";
import RegisterPage from "./RegisterPage/RegisterPage";

import ForgotPassword from "./forgot-password-page/forgot-password-page";
import NotFoundPage from "./error/error";
import { AuthRoute, ProtectedRoute } from "./ProtectedRoute";
import Dashboard from "./dashboard/dashboard";






function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const { isAuthenticated, setAuthenticated } = useAuth();
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUsername = localStorage.getItem("username");

        if (storedToken) {
          const token = JSON.parse(storedToken);

          if (validateToken(token)) {
            // Set both authenticated state and username
            setAuthenticated(true, storedUsername || token.username || "");
            scheduleTokenRefresh(token);
          } else {
            // Clear invalid auth data
            localStorage.removeItem("token");
            localStorage.removeItem("username");
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Clear corrupted auth data
        localStorage.removeItem("token");
        localStorage.removeItem("username");
      } finally {
        setInitialLoad(false);
      }
    };

    checkAuth();
  }, [setAuthenticated]);


  if (initialLoad) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes location={location}>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Public routes */}
        <Route element={<AuthRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
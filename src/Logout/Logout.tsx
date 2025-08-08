// components/Logout.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/userAuth";
import { logout } from "../auth/auth";

export function Logout() {
  const { setAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        setAuthenticated(false, ""); // Explicitly clear username
        navigate("/login", { replace: true });
      } catch (err) {
        setError("Failed to logout properly");
        console.error("Logout error:", err);
        // Still update UI state even if server logout failed
        setAuthenticated(false, "");
        navigate("/login", { replace: true });
      }
    };

    performLogout();
  }, [navigate, setAuthenticated]);

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error} - You have been redirected to login
      </div>
    );
  }

  return <div className="p-4">Logging out...</div>;
}

import { useState, useEffect, type ReactNode, useCallback } from "react";
import { AuthContext } from "./auth-context";
import { logout, validateToken } from "./auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage only once
  const [authState, setAuthState] = useState(() => {
    const token = JSON.parse(localStorage.getItem("token") || "null");
    const username = localStorage.getItem("username") || "";
    return {
      isAuthenticated: validateToken(token),
      username: validateToken(token) ? username : "",
    };
  });

  // Stable callback for storage events
  const handleStorageChange = useCallback(() => {
    const token = JSON.parse(localStorage.getItem("token") || "null");
    const username = localStorage.getItem("username") || "";
    setAuthState({
      isAuthenticated: validateToken(token),
      username: validateToken(token) ? username : "",
    });
  }, []);

  // Setup storage event listener (only once)
  useEffect(() => {
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [handleStorageChange]);

  // Stable setAuthenticated function
  const setAuthenticated = useCallback(
    (auth: boolean, username: string = "") => {
      if (auth) {
        if (!username) {
          console.error("Username must be provided when authenticating");
          return;
        }
        localStorage.setItem("username", username);
      } else {
        localStorage.removeItem("username");
      }

      setAuthState({
        isAuthenticated: auth,
        username: auth ? username : "",
      });
    },
    []
  );

  // Stable logout function
  const handleLogout = useCallback(async () => {
    await logout();
    setAuthenticated(false);
  }, [setAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        username: authState.username,
        setAuthenticated,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

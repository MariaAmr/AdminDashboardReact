import { createContext } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  username: string;
  setAuthenticated: (auth: boolean, username: string) => void; 
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  username: "",
  setAuthenticated: () => {
    throw new Error("setAuthenticated must be implemented");
  },
  logout: async () => {
    throw new Error("logout must be implemented");
  },
});

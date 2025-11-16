import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("auction_token") || "");

  useEffect(() => {
    if (!token) {
      setUser(null);
    }
  }, [token]);

  const login = (userData, tok) => {
    setUser(userData);
    setToken(tok);
    localStorage.setItem("auction_token", tok);
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("auction_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

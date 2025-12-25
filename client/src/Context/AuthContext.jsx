import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [tokens, setTokens] = useState({
    accessToken: null,
    refreshToken: null,
  });
  const [userDetails, setUserDetails] = useState(null);

  // Load from localStorage on first render
  useEffect(() => {
    const savedAccess = localStorage.getItem("accessToken");
    const savedRefresh = localStorage.getItem("refreshToken");
    const userDetails = localStorage.getItem("userDetails");

    if (userDetails) {
      setUserDetails(JSON.parse(userDetails));
    }

    if (savedAccess && savedRefresh) {
      setTokens({
        accessToken: savedAccess,
        refreshToken: savedRefresh,
      });
    }
  }, []);

  // Save tokens to localStorage when updated
  const saveTokens = (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    setTokens({ accessToken, refreshToken });
  };

  const saveUserDetails = (details) => {
    localStorage.setItem("userDetails", JSON.stringify(details));
    setUserDetails(details);
  };

  const login = (data, userData) => {
    saveTokens(data.token, data.refreshToken);
    saveUserDetails(userData);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userDetails");

    setTokens({ accessToken: null, refreshToken: null });
    setUserDetails(null);
  };

  const isAuthenticated = Boolean(tokens.accessToken);

  return (
    <AuthContext.Provider
      value={{
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        login,
        logout,
        isAuthenticated,
        userDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

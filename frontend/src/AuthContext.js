import React, { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem("userRole") || null;
  });
  const [walletAddress, setWalletAddress] = useState(() => {
    return localStorage.getItem("walletAddress") || null;
  });


  // Login function
  const login = (role, address) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setWalletAddress(address);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userRole", role);
    localStorage.setItem("walletAddress", address);
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setWalletAddress(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("walletAddress");
  };

  useEffect(() => {
    if (window.ethereum) {
      // Listen for wallet account changes
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          console.log("Wallet disconnected");
          logout();
        } else if (accounts[0] !== walletAddress) {
          console.log("Wallet address changed");
          logout();
        }
      });

      // Cleanup listeners on unmount
      return () => {
        window.ethereum.removeListener("accountsChanged", () => {});
      };
    }
  }, [walletAddress]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout, walletAddress }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

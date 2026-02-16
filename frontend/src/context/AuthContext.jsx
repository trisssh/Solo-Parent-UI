import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();
export default AuthContext;

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [authTokens, setAuthTokens] = useState(() => {
    return localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null;
  });

  const [user, setUser] = useState(() => {
    return localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null;
  });

  const loginUser = async (loginData) => {
    try {
      const res = await fetch("/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: loginData.identifier,
          password: loginData.password,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
        navigate("/dashboard");
      } else {
        alert("Login Unsuccessful");
      }
    } catch (err) {
      console.error(err);
    }
  }

  const logoutUser = async () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login");
  };

      // console.log(authTokens);

  const updateToken = async () => {
    try {
      const res = await fetch("/api/token/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: authTokens?.refresh,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
      } else {
        logoutUser();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
  }

  const isTokenExpired = (token) => {
    if (!token) return true;
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  }

  useEffect(() => {
    if (authTokens && isTokenExpired(authTokens.access)) {
      updateToken();
    } 

    const interval = setInterval(() => {
      if (isTokenExpired(authTokens.access)) {
        updateToken();
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [authTokens]);

  useEffect(() => {
    const syncAuth = () => {
      const tokens = localStorage.getItem("authTokens");

      if (tokens) {
        setAuthTokens(JSON.parse(tokens));
      } else {
        loginUser();
      }
    }

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
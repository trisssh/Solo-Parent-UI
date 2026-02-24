import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const AuthContext = createContext();
export default AuthContext;

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [authTokens, setAuthTokens] = useState(() => {
    return localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null;
  });

  // const [user, setUser] = useState(() => {
  //   return localStorage.getItem("authTokens")
  //     ? jwtDecode(localStorage.getItem("authTokens"))
  //     : null;
  // });
  const [user, setUser] = useState(() => {
    const storedTokens = localStorage.getItem("authTokens");

    if (storedTokens) {
      const parsedTokens = JSON.parse(storedTokens);
      return jwtDecode(parsedTokens.access);
    }

    return null;
  });

  // const loginUser = async (loginData) => {
  //   try {
  //     const res = await fetch("http://127.0.0.1:8000/api/token", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(loginData),
  //     });

  //     const data = await res.json();
  //     console.log("LOGIN RESPONSE:", data);

  //     if (res.ok) {
  //       setAuthTokens(data);
  //       setUser(jwtDecode(data.access));
  //       localStorage.setItem("authTokens", JSON.stringify(data));
  //       navigate("/dashboard");
  //     } else {
  //       alert("Login Unsuccessful");
  //     }
  //   } catch (err) {
  //     console.error("LOGIN ERROR:", err);
  //   }
  // };
  const loginUser = async (loginData) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (res.ok) {
        // successful login
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
        navigate("/dashboard");
      } else if (res.status === 401) {
        // wrong credentials
        showAlert({
          title: "Login Failed",
          message: "Incorrect email or password. Please try again.",
          icon: "error",
        });
      } else {
        // other errors (500, 400, etc.)
        showAlert({
          icon: "error",
          title: "Login Error",
          message: "Something went wrong. Please try again later.",
        });
      }
    } catch (err) {
      console.error("Network error during login:", err);
      // Swal.fire({
      //   icon: "error",
      //   title: "Network Error",
      //   text: "Cannot connect to server. Please check your internet.",
      // });
      showAlert({
        icon: "error",
        title: "Network Error",
        message: "Cannot connect to server. Please check your internet.",
      });
    }
  };

  const logoutUser = async () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login");
  };

  const updateToken = async () => {
    try {
      // const res = await fetch("/api/token/refresh", {
      const res = await fetch("http://127.0.0.1:8000/api/token/refresh", {
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
    user: user,  //to know which role
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  const isTokenExpired = (token) => {
    if (!token) return true;
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  };

  useEffect(() => {
    if (authTokens && isTokenExpired(authTokens.access)) {
      updateToken();
    }

    const interval = setInterval(() => {
      if (authTokens?.access && isTokenExpired(authTokens.access)) {
        updateToken();
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [authTokens]);

  useEffect(() => {
    const syncAuth = () => {
      const tokens = localStorage.getItem("authTokens");

      if (tokens) {
        const parsed = JSON.parse(tokens);
        setAuthTokens(parsed);
        setUser(jwtDecode(parsed.access));
      } else {
        setAuthTokens(null);
        setUser(null);
      }
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  // SWEET ALERT
  const showAlert = ({ title, message, icon = "error" }) => {
    Swal.fire({
      title: `<p class="text-2xl font-semibold text-gray-800">${title}</p>`,
      html: `<p class="text-xl text-gray-600 mt-1">${message}</p>`,
      icon,
      iconColor: "#DC2626",
      background: "#ffffff",
      showConfirmButton: true,
      confirmButtonText: "Okay",
      buttonsStyling: false,
      customClass: {
        popup: "rounded-xl px-6 py-4",
        confirmButton:
          "mt-4 bg-red-600 text-white px-6 py-2 rounded text-xl hover:bg-red-700",
      },
    });
  };
  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
}


import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log("handleLogin called");
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      console.log("About to call API");

     const response = await api.post("/login", {
  email,
  password,
});

localStorage.setItem(
  "access_token",
  response.data.access_token
);


      navigate("/dashboard");

      // Dashboard navigation (we'll implement later)
      // window.location.href = "/dashboard";

    } catch (error) {
      console.error("Login Error:", error);

      if (error.response) {
        console.log(error.response.data);
        alert(error.response.data.detail);
      } else if (error.request) {
        console.log(error.request);
        alert("Network Error");
      } else {
        console.log(error.message);
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#1d1d2e",
      }}
    >
      <div
        style={{
          width: "420px",
          padding: "40px",
          background: "#2b2b3d",
          borderRadius: "10px",
          textAlign: "center",
          color: "white",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
        }}
      >
        <h1 style={{ marginBottom: "10px" }}>
          Smart Inventory Management
        </h1>

        <h2 style={{ marginBottom: "30px" }}>
          Login
        </h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid gray",
          }}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "25px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid gray",
          }}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

export default Login;
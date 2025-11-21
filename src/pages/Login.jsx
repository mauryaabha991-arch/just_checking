import React, { useState } from "react";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import HomePage from "./HomePage"; // Import HomePage

export default function Login() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      await setDoc(
        doc(db, "users", userCredential.user.uid),
        { lastLogin: new Date() },
        { merge: true }
      );

      localStorage.setItem("username", userCredential.user.email);
      alert("Login Successful!");
      navigate("/");
    } catch (err) {
      alert("Login Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Show HomePage in background */}
      <HomePage />
      
      {/* Login Overlay */}
      <div className="auth-overlay">
        <div className="auth-modal">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <h2>Login</h2>
              <button 
                onClick={() => navigate("/")} 
                className="close-btn"
              >
                ×
              </button>
            </div>
            
            <form className="auth-form" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border rounded-2xl p-2 w-full mb-3"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border rounded-2xl p-2 w-full mb-3"
              />

              <button
                type="submit"
                className="btn btn-primary w-full bg-blue-950 text-white py-2 rounded hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <p className="mt-4 text-sm text-black text-center">
                New user?{" "}
                <Link
                  to="/signup"
                  className="text-blue font-semibold underline hover:text-blue-800"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
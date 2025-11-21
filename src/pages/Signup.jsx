import React, { useState } from "react";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { app } from "../firebase";
import HomePage from "./HomePage"; // Import HomePage

export default function Signup() {
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email,
        createdAt: new Date(),
      });
      alert("Signup Successful!");
      navigate("/");
    } catch (err) {
      alert("Signup Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Show HomePage in background */}
      <HomePage />
      
      {/* Signup Overlay */}
      <div className="auth-overlay">
        <div className="auth-modal">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <h2>Sign Up</h2>
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
                {loading ? "Signing up..." : "Sign Up"}
              </button>

              <p className="mt-4 text-sm text-gray text-center">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue font-semibold underline hover:text-blue-800"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
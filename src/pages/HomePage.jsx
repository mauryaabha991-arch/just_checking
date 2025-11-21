import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import "../App.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStartDetection = () => {
    if (loading) return;
    if (user) navigate("/input");
    else {
      alert("Please login first to start detection.");
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <h1 className="logo">CardioPredict</h1>
          <nav className="nav-buttons">
            <button 
              onClick={() => navigate("/login")} 
              className="btn btn-login"
            >
              Login
            </button>
            <button 
              onClick={() => navigate("/signup")} 
              className="btn btn-signup"
            >
              Sign Up
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
             
              <span className="highlight"> Cardiovascular Disease Detection</span>
            </h1>
            <p className="hero-description">
              Our AI-powered system helps detect cardiovascular risks early using 
              simple health parameters. Monitor your heart health, track progress, 
              and receive personalized suggestions for a healthier life.
            </p>
            
          </div>
          <div className="hero-visual">
           <img 
               src="https://dvl2h13awlxkt.cloudfront.net/assets/general-images/Knowledge/_1200x630_crop_center-center_82_none/CVD-iStock-1266230179.jpg?mtime=1653282867"
               className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="features-grid">
          <div 
            className="feature-card card-detection" 
            onClick={handleStartDetection}
          >
            <div className="card-icon">
              <div className="icon-heart"></div>
            </div>
            <h2>Start Detection</h2>
            <p>Enter your health details to begin the AI-powered cardiovascular risk assessment process.</p>
            <div className="card-arrow">→</div>
          </div>

          <div 
            className="feature-card card-history" 
            onClick={() => navigate("/history")}
          >
            <div className="card-icon">
              <div className="icon-history"></div>
            </div>
            <h2>Detection History</h2>
            <p>View your past detection results, track progress over time, and monitor your health journey.</p>
            <div className="card-arrow">→</div>
          </div>

          <div 
            className="feature-card card-suggestions" 
            onClick={() => navigate("/suggestions")}
          >
            <div className="card-icon">
              <div className="icon-ai"></div>
            </div>
            <h2>AI Suggestions</h2>
            <p>Get personalized health tips and recommendations based on your detection results and profile.</p>
            <div className="card-arrow">→</div>
          </div>
        </div>
      </section>

     
    </div>
  );
}
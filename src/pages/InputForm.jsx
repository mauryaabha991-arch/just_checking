import React, { useState, useEffect } from "react";
import axios from "axios";

const RegisterForm = () => {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    const storedPass = localStorage.getItem("password");
    if (storedUser) setUsername(storedUser);
    if (storedPass) setPassword(storedPass);
  }, []);

  const [healthFeatures, setHealthFeatures] = useState({
    age_years: "",
    gender: "",
    height: "",
    weight: "",
    ap_hi: "",
    ap_lo: "",
    cholesterol: "",
    gluc: "",
    smoke: false,
    alco: false,
    ACTIVE: false
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const ranges = {
    age_years: { min: 20, max: 80 },
    height: { min: 120, max: 220 },
    weight: { min: 30, max: 200 },
    ap_hi: { min: 50, max: 250 },
    ap_lo: { min: 30, max: 150 },
    cholesterol: { min: 1, max: 3 },
    gluc: { min: 1, max: 3 }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setHealthFeatures(prev => ({ ...prev, [name]: val }));

    let newErrors = { ...errors };

    if (ranges[name]) {
      const { min, max } = ranges[name];
      if (val !== "" && (Number(val) < min || Number(val) > max)) {
        newErrors[name] = `Value must be between ${min} and ${max}`;
      } else {
        newErrors[name] = null;
      }
    }

    const ap_hiVal = name === "ap_hi" ? Number(val) : Number(healthFeatures.ap_hi);
    const ap_loVal = name === "ap_lo" ? Number(val) : Number(healthFeatures.ap_lo);

    if (!isNaN(ap_hiVal) && !isNaN(ap_loVal)) {
      if (ap_loVal > ap_hiVal) {
        newErrors["ap_lo"] = "Diastolic BP cannot be greater than Systolic BP";
        newErrors["ap_hi"] = "Systolic BP must be higher than Diastolic BP";
      } else {
        if (newErrors["ap_lo"] === "Diastolic BP cannot be greater than Systolic BP") newErrors["ap_lo"] = null;
        if (newErrors["ap_hi"] === "Systolic BP must be higher than Diastolic BP") newErrors["ap_hi"] = null;
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let key in ranges) {
      const val = Number(healthFeatures[key]);
      const { min, max } = ranges[key];
      if (val < min || val > max || isNaN(val)) {
        setErrors(prev => ({ ...prev, [key]: `Value must be between ${min} and ${max}` }));
        return;
      }
    }

    if (Number(healthFeatures.ap_lo) > Number(healthFeatures.ap_hi)) {
      setErrors(prev => ({
        ...prev,
        ap_lo: "Diastolic BP cannot be greater than Systolic BP",
        ap_hi: "Systolic BP must be higher than Diastolic BP"
      }));
      return;
    }

    try {
      const payload = {
        username,
        password,
        healthFeatures: {
          age_years: Number(healthFeatures.age_years),
          gender: Number(healthFeatures.gender),
          height: Number(healthFeatures.height),
          weight: Number(healthFeatures.weight),
          ap_hi: Number(healthFeatures.ap_hi),
          ap_lo: Number(healthFeatures.ap_lo),
          cholesterol: Number(healthFeatures.cholesterol),
          gluc: Number(healthFeatures.gluc),
          smoke: healthFeatures.smoke ? 1 : 0,
          alco: healthFeatures.alco ? 1 : 0,
          ACTIVE: healthFeatures.ACTIVE ? 1 : 0
        }
      };

      const response = await axios.post("http://localhost:5000/api/register", payload, {
        headers: { "Content-Type": "application/json" }
      });

      setMessage(response.data.message);
    } catch (err) {
      console.error("Axios error:", err.response ? err.response.data : err.message);
      setMessage("Error submitting form");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-600">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">CardioPredict</h1>
          {username && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold border border-white/30">
                {username.charAt(0).toUpperCase()}
              </div>
              <span className="text-white font-semibold">Welcome, {username}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Form Container */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mt-6 border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-3">
              Cardiovascular Risk Assessment
            </h2>
            <p className="text-gray-600 text-lg">
              Enter your health details for AI-powered cardiovascular disease detection
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Password Input */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <label className="block text-lg font-semibold text-gray-800 mb-3">Account Verification</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your account password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 text-lg bg-white"
              />
            </div>

            {/* Health Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { name: "age_years", label: "Age", range: "20-80 years" },
                { name: "height", label: "Height", range: "120-220 cm" },
                { name: "weight", label: "Weight", range: "30-200 kg" },
                { name: "ap_hi", label: "Systolic BP", range: "50-250 mmHg" },
                { name: "ap_lo", label: "Diastolic BP", range: "30-150 mmHg" },
                { name: "cholesterol", label: "Cholesterol Level", range: "1-3 scale" },
                { name: "gluc", label: "Glucose Level", range: "1-3 scale" }
              ].map((field) => (
                <div key={field.name} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <label className="block text-lg font-semibold text-gray-800">
                      {field.label}
                    </label>
                    <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded">
                      {field.range}
                    </span>
                  </div>
                  <input
                    type="number"
                    name={field.name}
                    min={ranges[field.name].min}
                    max={ranges[field.name].max}
                    value={healthFeatures[field.name]}
                    onChange={handleChange}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 text-lg bg-white"
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-2 font-medium bg-red-50 px-3 py-1 rounded">{errors[field.name]}</p>
                  )}
                </div>
              ))}

              {/* Gender Select */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition duration-300">
                <label className="block text-lg font-semibold text-gray-800 mb-3">Gender</label>
                <select
                  name="gender"
                  value={healthFeatures.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 text-lg bg-white"
                >
                  <option value="">Select Gender</option>
                  <option value="1">Male</option>
                  <option value="0">Female</option>
                </select>
              </div>
            </div>

            {/* Checkboxes Section */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Lifestyle Factors</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: "smoke", label: "Smoking Habit", description: "Do you smoke regularly?" },
                  { name: "alco", label: "Alcohol Consumption", description: "Do you consume alcohol?" },
                  { name: "ACTIVE", label: "Physical Activity", description: "Are you physically active?" }
                ].map((field) => (
                  <div key={field.name} className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition duration-300">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        name={field.name}
                        checked={healthFeatures[field.name]}
                        onChange={handleChange}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div>
                        <label className="text-lg font-semibold text-gray-800 block">
                          {field.label}
                        </label>
                        <p className="text-gray-600 text-sm mt-1">
                          {field.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="w-full max-w-md mx-auto bg-blue-800 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl"
              >
                Analyze Cardiovascular Risk
              </button>
              
            </div>
          </form>

          {message && (
            <div className={`mt-8 p-6 rounded-xl text-center font-semibold text-lg border ${
              message.includes("Error") 
                ? "bg-red-50 text-red-700 border-red-200" 
                : "bg-green-50 text-green-700 border-green-200"
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
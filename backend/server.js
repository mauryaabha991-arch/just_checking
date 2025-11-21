const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dibs"
});

db.connect((err) => {
  if (err) return console.error(" DB connection failed:", err);
  console.log("Connected to MySQL 'dibs'");
});

// Main Register Endpoint
app.post("/api/register", (req, res) => {
  const { username, password, healthFeatures } = req.body;

  if (!username || !password || !healthFeatures) {
    return res.status(400).json({
      success: false,
      message: "Missing username, password, or health data",
    });
  }

  const checkQuery = "SELECT user_cd FROM users WHERE username = ?";
  db.query(checkQuery, [username], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "DB check error" });

    let user_cd;

    if (result.length > 0) {
      user_cd = result[0].user_cd;
      saveHealthRecord();
    } else {
      const insertUserQuery = "INSERT INTO users (username, password) VALUES (?, ?)";
      db.query(insertUserQuery, [username, password], (err, userResult) => {
        if (err) return res.status(500).json({ success: false, message: "User insert error" });

        user_cd = userResult.insertId;
        saveHealthRecord();
      });
    }

    // Insert Health Record
    function saveHealthRecord() {
      const h = healthFeatures;

      // numeric conversion
      const age = Number(h.age_years);
      const height = Number(h.height);
      const weight = Number(h.weight);
      const ap_hi = Number(h.ap_hi);
      const ap_lo = Number(h.ap_lo);
      const cholesterol = Number(h.cholesterol);
      const gluc = Number(h.gluc);

      // gender encode
      let gender = 0;
      if (String(h.gender).toLowerCase() === "female") gender = 1;

      // boolean encode
      const smoke = h.smoke ? 1 : 0;
      const alco = h.alco ? 1 : 0;
      const active = h.active ? 1 : 0;

      // engineered features
      const bmi = weight / ((height / 100) ** 2);
      const pulse_pressure = ap_hi - ap_lo;

      let age_group = 
        age < 30 ? 0 :
        age < 40 ? 1 :
        age < 50 ? 2 :
        age < 60 ? 3 :
        age < 70 ? 4 : 5;

      let bmi_group =
        bmi < 18.5 ? 1 :
        bmi < 25 ? 0 :
        bmi < 30 ? 2 : 3;

      const smoke_age = smoke * age;
      const chol_bmi = cholesterol * bmi;

      const healthQuery = `
        INSERT INTO health_features
        (user_cd, age_years, gender, height, weight, ap_hi, ap_lo, cholesterol, gluc,
         smoke, alco, ACTIVE, bmi, pulse_pressure, age_group, bmi_group, smoke_age, chol_bmi)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        user_cd,
        age,
        gender,
        height,
        weight,
        ap_hi,
        ap_lo,
        cholesterol,
        gluc,
        smoke,
        alco,
        active,
        bmi,
        pulse_pressure,
        age_group,
        bmi_group,
        smoke_age,
        chol_bmi
      ];

      db.query(healthQuery, values, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Health insert error", error: err });

        return res.json({
          success: true,
          message: "User & numeric health features stored ✔",
          user_cd,
          record_id: result.insertId,
        });
      });
    }
  });
});

// Start Server
app.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);

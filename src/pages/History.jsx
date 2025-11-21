import React, { useEffect, useState } from "react";
import { auth } from "../firebase";

export default function History() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setLoading(false);
      return;
    }

    // IMPORTANT: Encode email so '@' does not break URL
    const encodedEmail = encodeURIComponent(user.email);

    // Step 1: Get user_cd using encoded email
    fetch(`http://localhost:5000/api/getUserCd/${encodedEmail}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user_cd");
        return res.json();
      })
      .then((data) => {
        if (!data.success) {
          setLoading(false);
          return;
        }

        const user_cd = data.user_cd;

        // Step 2: Fetch history using user_cd
        return fetch(`http://localhost:5000/api/history/${user_cd}`);
      })
      .then((res) => (res ? res.json() : null))
      .then((history) => {
        if (history && history.success) {
          setRecords(history.records);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("ERROR:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Loading history...</h2>;
  if (records.length === 0) return <h2>No history found.</h2>;

  return (
    <div className="container">
      <h1>Your Complete Health History</h1>

      <div style={{ overflowX: "auto" }}>
        <table className="history-table">
          <thead>
            <tr>
              <th>Record ID</th>
              <th>User CD</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Height</th>
              <th>Weight</th>
              <th>AP_HI</th>
              <th>AP_LO</th>
              <th>Cholesterol</th>
              <th>Gluc</th>
              <th>Smoke</th>
              <th>Alcohol</th>
              <th>Active</th>
              <th>BMI</th>
              <th>Pulse Pressure</th>
              <th>Age Group</th>
              <th>BMI Group</th>
              <th>Smoke Age</th>
              <th>Chol_BMI</th>
              <th>Probability</th>
              <th>Risk Label</th>
              <th>Risk Color</th>
              <th>Advice</th>
              <th>Recorded At</th>
            </tr>
          </thead>

          <tbody>
            {records.map((rec) => (
              <tr key={rec.record_id}>
                <td>{rec.record_id}</td>
                <td>{rec.user_cd}</td>
                <td>{rec.age_years}</td>
                <td>{rec.gender === 1 ? "Male" : "Female"}</td>
                <td>{rec.height}</td>
                <td>{rec.weight}</td>
                <td>{rec.ap_hi}</td>
                <td>{rec.ap_lo}</td>
                <td>{rec.cholesterol}</td>
                <td>{rec.gluc}</td>
                <td>{rec.smoke}</td>
                <td>{rec.alco}</td>
                <td>{rec.ACTIVE}</td>
                <td>{rec.bmi?.toFixed(2)}</td>
                <td>{rec.pulse_pressure}</td>
                <td>{rec.age_group}</td>
                <td>{rec.bmi_group}</td>
                <td>{rec.smoke_age}</td>
                <td>{rec.chol_bmi?.toFixed(2)}</td>
                <td>{rec.probability ?? "—"}</td>
                <td>{rec.risk_label ?? "—"}</td>
                <td>{rec.risk_color ?? "—"}</td>
                <td>{rec.advice ?? "—"}</td>
                <td>{new Date(rec.recorded_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .history-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .history-table th,
        .history-table td {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: center;
        }
        .history-table th {
          background-color: #f4f4f4;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}

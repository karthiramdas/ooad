import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Admin.css";

const Admin = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "Male",
    diagnostics: "",
    doctorId: "",
    familyMemberName: "",
    familyMemberPhone: "",
  });

  // Fetch patients from the database
  useEffect(() => {
    console.log("refresh trigredd...");
  }, []);

  const handleLogout = () => {
    navigate("/login"); // Redirect to the login page after logout
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.post(
        "http://localhost:5000/api/patients",
        newPatient
      );
      console.log(res);
      // setPatients(prevPatients => [...prevPatients, res.data.patient]);
      setNewPatient({
        name: "",
        age: "",
        gender: "Male",
        diagnostics: "",
        doctorId: "",
        familyMemberName: "",
        familyMemberPhone: "",
      });
    } catch (err) {
      console.log("err:", err);
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="admin-body">
        <nav className="admin-nav">
          <ul>
            <li onClick={() => navigate("/admin/patients")}>Manage Patients</li>
            <li onClick={() => navigate("/admin/doctors")}>Manage Doctors</li>
            {/* <li onClick={() => navigate("/admin/settings")}>System Settings</li> */}
          </ul>
        </nav>

        <main className="admin-content">
          <h2>Welcome, Admin!</h2>
          <p>Select an option from the left menu to manage the system.</p>

          <section className="patient-form-section">
            <h3>Add New Patient</h3>
            <form onSubmit={handleAddPatient} className="patient-form">
              <input
                type="text"
                name="name"
                value={newPatient.name}
                onChange={handleInputChange}
                placeholder="Name"
                required
              />
              <input
                type="number"
                name="age"
                value={newPatient.age}
                onChange={handleInputChange}
                placeholder="Age"
                required
              />
              <select
                name="gender"
                value={newPatient.gender}
                onChange={handleInputChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <textarea
                name="diagnostics"
                value={newPatient.diagnostics}
                onChange={handleInputChange}
                placeholder="Diagnostics"
                required
              />
              <input
                type="number"
                name="doctorId"
                value={newPatient.doctorId}
                onChange={handleInputChange}
                placeholder="Doctor ID"
                required
              />
              <input
                type="text"
                name="familyMemberName"
                value={newPatient.familyMemberName}
                onChange={handleInputChange}
                placeholder="Family Member Name"
              />
              <input
                type="text"
                name="familyMemberPhone"
                value={newPatient.familyMemberPhone}
                onChange={handleInputChange}
                placeholder="Family Member Phone"
              />
              <button type="submit">Add Patient</button>
            </form>
          </section>

          <section className="patient-list-section">
            <h3>Patient List</h3>
            <table className="patient-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Diagnostics</th>
                  <th>Doctor ID</th>
                  <th>Family Member</th>
                  <th>Family Phone</th>
                </tr>
              </thead>
              <tbody>
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan="7">No patients found.</td>
                  </tr>
                ) : (
                  patients.map((patient) => (
                    <tr key={patient.patient_id}>
                      <td>{patient.name}</td>
                      <td>{patient.age}</td>
                      <td>{patient.gender}</td>
                      <td>{patient.diagnostics}</td>
                      <td>{patient.doctor_id}</td>
                      <td>{patient.family_member_name}</td>
                      <td>{patient.family_member_phone}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Admin;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManagePatients.css'; // Import your CSS file for styling

const ManagePatients = () => {
  const navigate = useNavigate();
  
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    // Fetch patients from the API
    const fetchPatients = async () => {
      const response = await fetch('http://localhost:5000/api/patients');
      const data = await response.json();
      console.log("refreshhh...");
      setPatients(data);
    };

    fetchPatients();
  }, []);

  const handleRemovePatient = async (patient_id) => {
    // Remove the patient from the database
    const response = await fetch(`http://localhost:5000/api/patients/${patient_id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Filter out the deleted patient from the local state
      setPatients(patients.filter(patient => patient.patient_id !== patient_id));
    } else {
      alert("Failed to remove patient.");
    }
  };

  const handleEditPatient = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/api/patients/${selectedPatient.patient_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedPatient),
    });
    const updatedPatient = await response.json();
    setPatients(patients.map(p => (p.patient_id === updatedPatient.patient_id ? updatedPatient : p)));
    setSelectedPatient(null);
  };

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patient_id.toString().includes(searchTerm)
  );

  return (
    <div className="manage-patients-container">
      <header className="admin-header">
        <h1 className="admin-title">Manage Patients</h1>
        <button className="logout-button" onClick={() => navigate('/login')}>Logout</button>
      </header>

      <div className="admin-body">
        <nav className="admin-nav">
          <ul>
            <li onClick={() => navigate('/admin/patients')}>Manage Patients</li>
            <li onClick={() => navigate('/admin/doctors')}>Manage Doctors</li>
            <li onClick={() => navigate('/admin/settings')}>System Settings</li>
          </ul>
        </nav>

        <main className="admin-content">
          <h2>Patients List</h2>
          
          {/* Search Bar */}
          <input 
            type="text" 
            placeholder="Search by Name or ID" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />

          {/* Patients Table */}
          <table className="patients-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Diagnostics</th>
                <th>Doctor ID</th>
                <th>Family Member</th>
                <th>Phone Number</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map(patient => (
                <React.Fragment key={patient.patient_id}>
                  <tr>
                    <td>{patient.patient_id}</td>
                    <td>{patient.name}</td>
                    <td>{patient.age}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.diagnostics}</td>
                    <td>{patient.doctor_id}</td>
                    <td>{patient.family_member_name}</td>
                    <td>{patient.family_member_phone}</td>
                    <td>
                      <button 
                        className="remove-button" 
                        onClick={() => handleRemovePatient(patient.patient_id)}
                      >
                        Remove
                      </button>
                      <button 
                        className="edit-button" 
                        onClick={() => setSelectedPatient(patient)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>

                  {/* Edit Patient Form (appears below the row being edited) */}
                  {selectedPatient && selectedPatient.patient_id === patient.patient_id && (
                    <tr>
                      <td colSpan="9">
                        <form className="edit-patient-form" onSubmit={handleEditPatient}>
                          <h3>Edit Patient</h3>
                          <input
                            type="text"
                            placeholder="Name"
                            value={selectedPatient.name}
                            onChange={(e) => setSelectedPatient({ ...selectedPatient, name: e.target.value })}
                            required
                          />
                          <input
                            type="number"
                            placeholder="Age"
                            value={selectedPatient.age}
                            onChange={(e) => setSelectedPatient({ ...selectedPatient, age: e.target.value })}
                            required
                          />
                          <input
                            type="text"
                            placeholder="Gender"
                            value={selectedPatient.gender}
                            onChange={(e) => setSelectedPatient({ ...selectedPatient, gender: e.target.value })}
                            required
                          />
                          <input
                            type="text"
                            placeholder="Diagnostics"
                            value={selectedPatient.diagnostics}
                            onChange={(e) => setSelectedPatient({ ...selectedPatient, diagnostics: e.target.value })}
                            required
                          />
                          <input
                            type="text"
                            placeholder="Doctor ID"
                            value={selectedPatient.doctor_id}
                            onChange={(e) => setSelectedPatient({ ...selectedPatient, doctor_id: e.target.value })}
                            required
                          />
                          <input
                            type="text"
                            placeholder="Family Member"
                            value={selectedPatient.family_member_name}
                            onChange={(e) => setSelectedPatient({ ...selectedPatient, family_member_name: e.target.value })}
                            required
                          />
                          <input
                            type="text"
                            placeholder="Phone Number"
                            value={selectedPatient.family_member_phone}
                            onChange={(e) => setSelectedPatient({ ...selectedPatient, family_member_phone: e.target.value })}
                            required
                          />
                          <button type="submit" className="submit-button">Update</button>
                          <button type="button" onClick={() => setSelectedPatient(null)}>Cancel</button>
                        </form>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default ManagePatients;

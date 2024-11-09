import React, { useState, useEffect } from 'react';
import './DoctorPage.css';

const DoctorPage = () => {
    const [doctorId, setDoctorId] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [doctorDetails, setDoctorDetails] = useState(null);
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [healthData, setHealthData] = useState(null);
    const [note, setNote] = useState('');
    const [notes, setNotes] = useState([]);

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/doctors/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ doctorId })
            });
            if (response.ok) {
                const doctor = await response.json();
                setDoctorDetails(doctor);
                fetchPatients(doctor.doctor_id); // Fetch patients assigned to the logged-in doctor
                setLoggedIn(true);
            } else {
                alert("Invalid Doctor ID");
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const fetchPatients = async (doctorId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/patientss/${doctorId}`);
            const data = await response.json();
            setPatients(data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const selectPatient = async (patientId) => {
        try {
            console.log("input:",patientId)
            const response = await fetch(`http://localhost:5000/api/patients/${patientId}`);
            const data = await response.json();
            
            console.log("Selected patient data:", data);  // Log patient data to verify it contains patient_id
            setSelectedPatient(data);
            // console.log("Selected Patient ID:", selectedPatient); // add this line in the selectPatient function
    
            // Fetch health data for the selected patient
            const healthResponse = await fetch('http://localhost:5000/health-data');
            const healthData = await healthResponse.json();
            setHealthData(healthData);
    
            // Fetch notes for the selected patient
            const notesResponse = await fetch(`http://localhost:5000/api/patient/${patientId}/notes`);
            const notesData = await notesResponse.json();
            setNotes(notesData);
        } catch (error) {
            console.error('Error fetching patient details:', error);
        }
    };
    
    
    const handleAddNote = async () => {
        if (note.trim() === '' || !selectedPatient || !selectedPatient.patient_id) {
            console.log("No note to add or patient ID is undefined.");
            return;
        }
        try {
            console.log("Sending note to server:", note);
            const response = await fetch(`http://localhost:5000/api/patient/${selectedPatient.patient_id}/addNote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ doctorId , note })
            });
            
            if (response.ok) {
                const newNote = await response.json();
                console.log("Note added successfully:", newNote);
                setNotes([...notes, newNote]); // Add the new note to the list
                setNote(''); // Clear the input field
            } else {
                console.error('Failed to add note:', await response.text());
            }
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };
    
    

    return (
        <div className="doctor-container">
            <h2>Doctor Page</h2>
            {!loggedIn ? (
                <div className="login-form">
                    <label>Enter Doctor ID:</label>
                    <input
                        type="text"
                        value={doctorId}
                        onChange={(e) => setDoctorId(e.target.value)}
                        placeholder="Doctor ID"
                    />
                    <button onClick={handleLogin}>Login</button>
                </div>
            ) : (
                <div className="doctor-dashboard">
                    <h3>Welcome, Dr. {doctorDetails.name}</h3>
                    <div className="patients-list">
                        <h4>Patient List</h4>
                        {patients.map(patient => (
                            <div
                                key={patient.patient_id}
                                className="patient-card"
                                onClick={() => {console.log(patient); selectPatient(patient.patient_id);}}
                            >
                                <p><strong>Name:</strong> {patient.name}</p>
                                <p><strong>Age:</strong> {patient.age}</p>
                                <p><strong>Diagnostics:</strong> {patient.diagnostics}</p>
                            </div>
                        ))}
                    </div>

                    {selectedPatient && (
                        <div className="patient-details">
                            <h4>Selected Patient Details</h4>
                            <p><strong>Name:</strong> {selectedPatient.name}</p>
                            <p><strong>Age:</strong> {selectedPatient.age}</p>
                            <p><strong>Diagnostics:</strong> {selectedPatient.diagnostics}</p>
                            <p><strong>Family Member:</strong> {selectedPatient.family_member_name}</p>

                            <div className="health-metrics">
                                {healthData ? (
                                    <>
                                        <p><strong>Heart Rate:</strong> {healthData.heartRate} BPM</p>
                                        <p><strong>Blood Pressure:</strong> {healthData.bloodPressure}</p>
                                        <p><strong>Body Temperature:</strong> {healthData.bodyTemperature} °C</p>
                                        <p><strong>Oxygen Saturation:</strong> {healthData.oxygenSaturation}%</p>
                                        <p><strong>Respiratory Rate:</strong> {healthData.respiratoryRate} breaths/min</p>
                                    </>
                                ) : (
                                    <p>Loading health data...</p>
                                )}
                            </div>

                            <div className="notes-section">
                                <h5>Doctor's Notes</h5>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Add a note..."
                                />
                                <button onClick={handleAddNote}>Add Note</button>
                                
                                <div className="notes-history">
                                    <h6>Notes History</h6>
                                    {notes.map((note, index) => (
                                        <div key={index} className="note">
                                            <p>{note.content}</p>
                                            <span>{new Date(note.created_at).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button onClick={() => setSelectedPatient(null)}>Back to Patient List</button>
                        </div>
                    )}

                    <button onClick={() => setLoggedIn(false)}>Logout</button>
                </div>
            )}
        </div>
    );
};

export default DoctorPage;

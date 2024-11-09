import React, { useState, useEffect } from 'react';
import './PatientPage.css';

const Patient = () => {
    const [patientData, setPatientData] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [patientId, setPatientId] = useState('');
    const [healthData, setHealthData] = useState([]);
    const [currentHealth, setCurrentHealth] = useState({
        heartRate: 98,
        bloodPressure: "120/80",
        oxygenSaturation: 98,
        bodyTemperature: 37.0, // Adding initial value for body temperature
        respiratoryRate: 16 // Adding initial value for respiratory rate
    });
    const [notes, setNotes] = useState([]);  // State to hold doctor notes

    useEffect(() => {
        if (loggedIn) {
            const interval = setInterval(fetchHealthData, 10000);
            return () => clearInterval(interval);
        }
    }, [loggedIn]);

    const fetchHealthData = async () => {
        try {
            const response = await fetch('http://localhost:5000/health-data');
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setHealthData(prev => [...prev, data]);
                setCurrentHealth({
                    heartRate: data.heartRate || currentHealth.heartRate,
                    bloodPressure: data.bloodPressure || "120/80",
                    oxygenSaturation: data.oxygenSaturation || 98,
                    bodyTemperature: data.bodyTemperature || currentHealth.bodyTemperature,
                    respiratoryRate: data.respiratoryRate || currentHealth.respiratoryRate,
                });
            }
        } catch (error) {
            console.error('Error fetching health data:', error);
        }
    };

    const fetchNotes = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/patient/${patientId}/notes`);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setNotes(data);
            } else {
                console.error('Error fetching notes');
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const handleLogin = async () => {
        if (patientId) {
            try {
                const response = await fetch(`http://localhost:5000/api/patient/${patientId}`);
                if (response.ok) {
                    const data = await response.json();
                    setPatientData(data);
                    setLoggedIn(true);
                    fetchNotes();  // Fetch notes after login
                } else {
                    console.error('Patient not found');
                    setPatientData(null);
                }
            } catch (error) {
                console.error('Error fetching patient data:', error);
                setPatientData(null);
            }
        }
    };

    return (
        <div className="patient-container">
            <h2>Patient / Family Page</h2>
            {!loggedIn ? (
                <div className="login-form">
                    <label>Enter Patient ID:</label>
                    <input
                        type="text"
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                        placeholder="Patient ID"
                    />
                    <button onClick={handleLogin}>Login</button>
                </div>
            ) : (
                <div className="patient-details">
                    {patientData ? (
                        <>
                            <h3>Patient Details</h3>
                            <p><strong>Name:</strong> {patientData.name}</p>
                            <p><strong>Age:</strong> {patientData.age}</p>
                            <p><strong>Diagnostics:</strong> {patientData.diagnostics}</p>
                            <p><strong>Family Member:</strong> {patientData.family_member_name}</p>
                            <p><strong>Doctor:</strong> {patientData.doctor_id}</p>

                            <div className="health-metrics">
                                <div className="heart-rate-indicator">
                                    <div className="heart-rate-circle">
                                        <span>{currentHealth.heartRate} BPM</span>
                                    </div>
                                    <p>Heart Rate</p>
                                </div>
                                <div className="other-metrics">
                                    <p><strong>Blood Pressure:</strong> {currentHealth.bloodPressure}</p>
                                    <p><strong>Oxygen Saturation:</strong> {currentHealth.oxygenSaturation}%</p>
                                    <p><strong>Body Temperature:</strong> {currentHealth.bodyTemperature} °C</p>
                                    <p><strong>Respiratory Rate:</strong> {currentHealth.respiratoryRate} breaths/min</p>
                                </div>
                            </div>

                            <h4>Doctor's Notes</h4>
                            <div className="notes-section">
                                {notes.length > 0 ? (
                                    <ul>
                                        {notes.map((note, index) => (
                                            <li key={index}>
                                                <p>{note.content}</p>
                                                <p><strong>By:</strong> Dr.{note.doctorName}</p>
                                                <p><small>Notes created at:{new Date(note.createdAt).toLocaleString()}</small></p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No notes available.</p>
                                )}
                            </div>

                            <button onClick={() => setLoggedIn(false)}>Logout</button>
                        </>
                    ) : (
                        <p>Patient not found</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Patient;

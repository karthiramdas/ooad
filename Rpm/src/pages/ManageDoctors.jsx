import React, { useState, useEffect } from 'react';
import './ManageDoctors.css';

const ManageDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newDoctor, setNewDoctor] = useState({ doctor_id: '', name: '', specialization: '', contact_info: '' });
    const [editDoctor, setEditDoctor] = useState(null);

    // Fetch doctors from the API
    const fetchDoctors = async () => {
        const response = await fetch('http://localhost:5000/api/doctors');
        const data = await response.json();
        setDoctors(data);
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    // Handle adding a new doctor
    const handleAddDoctor = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/doctors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newDoctor),
        });
        if (response.ok) {
            // Re-fetch the list of doctors after adding a new doctor
            fetchDoctors();
            setNewDoctor({ doctor_id: '', name: '', specialization: '', contact_info: '' });
            setShowAddForm(false);
        } else {
            console.error('Failed to add doctor');
        }
    };

    // Handle editing a doctor
    const handleEditDoctor = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/doctors/${editDoctor.doctor_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editDoctor),
        });
        if (response.ok) {
            // Re-fetch the list of doctors after updating a doctor
            fetchDoctors();
            setEditDoctor(null);
        } else {
            console.error('Failed to update doctor');
        }
    };

    return (
        <div className="manage-doctors-container">
            <h2>Manage Doctors</h2>

            {/* Add Doctor Button */}
            <button onClick={() => setShowAddForm(!showAddForm)} className="add-doctor-button">
                {showAddForm ? 'Close Form' : 'Add Doctor'}
            </button>

            {/* Add Doctor Form */}
            {showAddForm && (
                <form onSubmit={handleAddDoctor} className="add-doctor-form">
                    <h3>Add Doctor</h3>
                    <input
                        type="text"
                        placeholder="Doctor ID"
                        value={newDoctor.doctor_id}
                        onChange={(e) => setNewDoctor({ ...newDoctor, doctor_id: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Name"
                        value={newDoctor.name}
                        onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Specialization"
                        value={newDoctor.specialization}
                        onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Contact Info"
                        value={newDoctor.contact_info}
                        onChange={(e) => setNewDoctor({ ...newDoctor, contact_info: e.target.value })}
                    />
                    <button type="submit" className="submit-button">Add Doctor</button>
                </form>
            )}

            {/* Doctors List */}
            <h3>Doctors List</h3>
            <table className="doctors-table">
                <thead>
                    <tr>
                        <th>Doctor ID</th>
                        <th>Name</th>
                        <th>Specialization</th>
                        <th>Contact Info</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {doctors.map(doctor => (
                        <React.Fragment key={doctor.doctor_id}>
                            <tr>
                                <td>{doctor.doctor_id}</td>
                                <td>{doctor.name}</td>
                                <td>{doctor.specialization}</td>
                                <td>{doctor.contact_info}</td>
                                <td>
                                    <button onClick={() => setEditDoctor(doctor)} className="edit-button">Edit</button>
                                </td>
                            </tr>

                            {/* Edit Doctor Form (appears only for the selected doctor) */}
                            {editDoctor && editDoctor.doctor_id === doctor.doctor_id && (
                                <tr>
                                    <td colSpan="5">
                                        <form onSubmit={handleEditDoctor} className="edit-doctor-form">
                                            <h3>Edit Doctor</h3>
                                            <input
                                                type="text"
                                                placeholder="Doctor ID"
                                                value={editDoctor.doctor_id}
                                                onChange={(e) => setEditDoctor({ ...editDoctor, doctor_id: e.target.value })}
                                                required
                                            />
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                value={editDoctor.name}
                                                onChange={(e) => setEditDoctor({ ...editDoctor, name: e.target.value })}
                                                required
                                            />
                                            <input
                                                type="text"
                                                placeholder="Specialization"
                                                value={editDoctor.specialization}
                                                onChange={(e) => setEditDoctor({ ...editDoctor, specialization: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Contact Info"
                                                value={editDoctor.contact_info}
                                                onChange={(e) => setEditDoctor({ ...editDoctor, contact_info: e.target.value })}
                                            />
                                            <button type="submit" className="submit-button">Update Doctor</button>
                                            <button type="button" onClick={() => setEditDoctor(null)}>Cancel</button>
                                        </form>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageDoctors;

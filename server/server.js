const express = require('express');
const cors = require('cors');
const db = require('./db'); // Import the database connection
const app = express();
const PORT = 5000;

app.use(cors()); // Enable CORS
app.use(express.json()); // Middleware to parse JSON bodies
const { faker } = require('@faker-js/faker');


// Endpoint for health data (mocked with faker)
app.get('/health-data', (req, res) => {
    const healthData = {
        heartRate: faker.number.int({ min: 60, max: 100 }), // beats per minute
        bloodPressure: `${faker.number.int({ min: 90, max: 120 })}/${faker.number.int({ min: 60, max: 80 })}`, // mmHg
        bodyTemperature: faker.number.int({ min: 36, max: 38, precision: 0.1 }),
        // Celsius
        oxygenSaturation: faker.number.int({ min: 95, max: 100 }), // percentage
        respiratoryRate: faker.number.int({ min: 12, max: 20 }) // breaths per minute
    };
    res.json(healthData);
});

// Endpoint for login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // SQL query to check if a user with the given username and password exists
    const query = `SELECT * FROM login WHERE username = ? AND password = ?`;

    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error querying database:', err.message);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length === 1) {
            // Successful login
            res.json({ success: true, message: 'Login successful' });
        } else {
            // No matching user found
            res.json({ success: false, message: 'Invalid username or password' });
        }
    });
});

// Endpoint to get all patients
app.get('/api/patients', (req, res) => {
    console.log("heyy drownnnnn...");
    db.query('SELECT * FROM patients', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        console.log(results);
        res.json(results); // Return the list of patients
    });
});

// Endpoint to add a new patient
app.post('/api/patients', (req, res) => {
    const { name, age, gender, diagnostics, doctorId, familyMemberName, familyMemberPhone } = req.body;
    const query = `INSERT INTO patients (name, age, gender, diagnostics, doctor_id, family_member_name, family_member_phone)
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(query, [name, age, gender, diagnostics, doctorId, familyMemberName, familyMemberPhone], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ ...req.body, patient_id: results.insertId });
    });
});

app.put('/api/patients/:id', (req, res) => {
    const { patient_id} = req.params;
    const updatedPatient = req.body;

    const sql = 'UPDATE patients SET name = ?, age = ?, gender = ?, diagnostics = ?, doctor_id = ?, family_member_name = ?,family_member_phone = ? WHERE patient_id = ?';
    const values = [
        updatedPatient.name,
        updatedPatient.age,
        updatedPatient.gender,
        updatedPatient.diagnostics,
        updatedPatient.doctor_id,
        updatedPatient.family_member_name,
        updatedPatient.family_member_phone,
        patient_id,
    ];

    db.query(sql, values, (err, results) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: 'Database update failed.' });
        }
        res.json({ patient_id, ...updatedPatient }); // Return the updated patient data
    });
});

app.get('/api/patient/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'SELECT * FROM patients WHERE patient_id = ?';
    
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query failed.' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Patient not found.' });
        }

        res.json(results[0]); // Return the patient's information
    });
});
// ADD A DOCTOR
// Add a new doctor
app.post('/api/doctors', (req, res) => {
    const { doctor_id, name, specialization, contact_info } = req.body;
    
    const sql = 'INSERT INTO doctors (doctor_id, name, specialization, contact_info) VALUES (?, ?, ?, ?)';
    const values = [doctor_id, name, specialization, contact_info];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error adding doctor:', err);
            return res.status(500).json({ error: 'Database insertion failed.' });
        }
        res.status(201).json({ message: 'Doctor added successfully', doctor_id });
    });
});
// Retrieve all doctors
app.get('/api/doctors', (req, res) => {
    const sql = 'SELECT * FROM doctors';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error retrieving doctors:', err);
            return res.status(500).json({ error: 'Database retrieval failed.' });
        }
        res.json(results);
    });
});
// Update doctor information
app.put('/api/doctors/:id', (req, res) => {
    const { id } = req.params;
    const { name, specialization, contact_info } = req.body;

    const sql = 'UPDATE doctors SET name = ?, specialization = ?, contact_info = ? WHERE doctor_id = ?';
    const values = [name, specialization, contact_info, id];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating doctor:', err);
            return res.status(500).json({ error: 'Database update failed.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Doctor not found.' });
        }
        res.json({ message: 'Doctor updated successfully', doctor_id: id });
    });
});
// Retrieve a doctor by ID
app.get('/api/doctors/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM doctors WHERE doctor_id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error retrieving doctor:', err);
            return res.status(500).json({ error: 'Database retrieval failed.' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Doctor not found.' });
        }
        res.json(result[0]);
    });
});
app.post('/api/doctors/login', (req, res) => {
    const { doctorId } = req.body;

    const query = 'SELECT * FROM doctors WHERE doctor_id = ?';
    db.query(query, [doctorId], (err, results) => {
        if (err) {
            console.error('Error fetching doctor:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Doctor ID not found' });
        } else {
            res.json(results[0]); // Send doctor details if found
        }
    });
});

// Endpoint to fetch patients by doctor_id
app.get('/api/patientss/:doctorId', (req, res) => {
    const { doctorId } = req.params;

    const query = 'SELECT * FROM patients WHERE doctor_id = ?';
    db.query(query, [doctorId], (err, results) => {
        if (err) {
            console.error('Error fetching patients:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(results); // Send patients associated with doctor
        }
    });
});

// Endpoint to fetch a specific patient by patient_id
app.get('/api/patients/:patientId', (req, res) => {
    const { patientId } = req.params;
    console.log("Received patientId:", patientId); // Log the received patientId

    const query = 'SELECT * FROM patients WHERE patient_id = ?';
    db.query(query, [patientId], (err, results) => {
        if (err) {
            console.error('Error fetching patient:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Patient not found' });
        } else {
            console.log("Patient data fetched:", results[0]); // Log patient data if found
            res.json(results[0]); // Send patient details if found
        }
    });
});

// get notes for specific patient
// app.get('/api/patient/:patientId/notes', (req, res) => {
//     const { patientId } = req.params;
//     db.query('SELECT * FROM notes WHERE patient_id = ?', [patientId], (error, results) => {
//         if (error) return res.status(500).json({ error: "Database error" });
//         res.json(results);
//     });
// });

app.get('/api/patient/:patientId/notes', (req, res) => {
    const patientId = req.params.patientId;

    // SQL query to get notes along with doctor names
    const query = `
        SELECT notes.content, notes.created_at, doctors.name AS doctor_name
        FROM notes
        JOIN doctors ON notes.doctor_id = doctors.doctor_id
        WHERE notes.patient_id = ?
        ORDER BY notes.created_at DESC
    `;

    db.query(query, [patientId], (err, results) => {
        if (err) {
            console.error('Error fetching notes:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // If no notes found, return an empty array
        if (results.length === 0) {
            return res.json([]);
        }

        // Map the results to a structured format
        const notes = results.map(note => ({
            content: note.content,
            doctorName: note.doctor_name,
            createdAt: note.created_at,
        }));

        // Send the notes data with doctor names
        res.json(notes);
    });
});


// Add a new note for a specific patient
app.post('/api/patient/:patientId/addNote', (req, res) => {
    const { patientId } = req.params;
    const { doctorId, note } = req.body;
    const createdAt = new Date();
    console.log(note);
    db.query('INSERT INTO notes (patient_id, doctor_id, content, created_at) VALUES (?, ?, ?, ?)', 
             [patientId, doctorId, note, createdAt], (error, results) => {
        if (error) return res.status(500).json({ error: "Database error" });
        res.json({ content: note, created_at: createdAt });
    });
});


//delete a patient in manage patients
app.delete('/api/patients/:id', (req, res) => {
    const patientId = req.params.id;
  
    // SQL query to delete the patient by patient_id
    const query = 'DELETE FROM patients WHERE patient_id = ?';
    
    db.query(query, [patientId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to delete patient', error: err });
      }
  
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Patient deleted successfully' });
      } else {
        res.status(404).json({ message: 'Patient not found' });
      }
    });
  });

  // insert into abnormal data


// Threshold values for abnormal data detection
// Threshold values







// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

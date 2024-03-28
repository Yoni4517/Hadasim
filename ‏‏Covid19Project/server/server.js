const express = require("express");
const DB = require('./createDB');
const CRUD = require('./CRUD');
const cors = require('cors');
require('dotenv').config();
const server = express();
const port = 2025
server.listen(port, () => console.log(`listening on port ${port}...`));

server.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
    credentials: true
}));

server.use(express.json());

server.get('/patients', (req, res) => {
    CRUD.getAllPatients()
        .then((results) => {
            console.log("All patients retrieved:", results);
            res.status(200).json(results);
        })
        .catch((err) => {
            console.error("Error retrieving all patients:", err);
            res.status(404).json({ error: "An error occurred while retrieving patients" });
        });
});

server.get('/patients/:id', (req, res) => {
    const patientId = req.params.id;
    CRUD.getPatientById(patientId)
        .then((patient) => {
            if (patient) {
                console.log("Patient found:", patient);
                res.status(200).json(patient);
            } else {
                console.log("Patient not found with ID:", patientId);
                res.status(404).json({ error: "Patient not found" });
            }
        })
        .catch((err) => {
            console.error("Error retrieving patient by ID:", err);
            res.status(500).json({ error: "An error occurred while retrieving patient" });
        });
});

server.post('/patients', (req, res) => {
    const newPatientData = req.body;
    console.log(newPatientData);
    CRUD.createNewPatient(newPatientData)
        .then((result) => {
            console.log(result);
            res.status(200).json({ message: 'New patient created successfully' });
        })
        .catch((err) => {
            console.error('Error creating new patient:', err);
            res.status(500).json({ error: 'An error occurred while creating a new patient' });
        });
});

server.put('/patients/:id', (req, res) => {
    const updatedPatientData = req.body;
    const patientId = req.params.id;
    CRUD.updatePatient(updatedPatientData)
        .then(() => {
            res.status(200).json({ message: `Patient with ID ${patientId} updated successfully` });
        })
        .catch((err) => {
            console.error('Error updating patient:', err);
            res.status(500).json({ error: 'An error occurred while updating the patient' });
        });
});

server.delete('/patients/:id', (req, res) => {
    const patientId = req.params.id;
    CRUD.deletePatient(patientId)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((error) => {
            res.status(500).send(error.message);
        });
});


DB.createDB();
DB.createPatientsTable();
DB.createVaccinesTable();
//DB.resetDB();



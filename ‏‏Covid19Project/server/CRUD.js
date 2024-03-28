const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.HOST_NAME,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT
});


exports.getPatientById = (patientId) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            }

            connection.query(`SELECT * FROM Patients WHERE id = ${patientId}`, (error, results) => {
                if (error) {
                    connection.release();
                    reject(error);
                } else {
                    const patientData = results[0];
                    connection.query(`SELECT * FROM vaccines WHERE personId = ${patientId}`, (error, vaccineResults) => {
                        connection.release();
                        if (error) {
                            reject(error);
                        } else {
                            const vaccines = {};
                            vaccineResults.forEach((vaccine, index) => {
                                vaccines[`vac${index + 1}`] = {
                                    date: vaccine.date,
                                    manufacturer: vaccine.manufacture
                                };
                            });
                            const formattedData = {
                                id: patientData.id,
                                firstName: patientData.firstName,
                                lastName: patientData.lastName,
                                birthDate: patientData.birthDate,
                                phone: patientData.phoneNumber,
                                cellphone: patientData.cellphoneNumber,
                                street: patientData.street,
                                city: patientData.city,
                                houseNumber: patientData.houseNumber,
                                positiveResultDate: patientData.positiveResultDate,
                                recoveryDate: patientData.recoveryDate,
                                vaccines: vaccines
                            };
                            resolve(formattedData);
                        }
                    });
                }
            });
        });
    })
}
exports.getAllPatients = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                const query = 'SELECT id, firstName, lastName FROM PATIENTS';
                connection.query(query, (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        connection.release();
                        resolve(results);
                    }
                });
            }
        });
    });
}

exports.updatePatient = (patientDetails) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                connection.release();
                reject(err);
            }

            const { id, firstName, lastName, birthDate, phoneNumber, cellphoneNumber, street, city, houseNumber, positiveResultDate, recoveryDate, vaccines } = patientDetails;

            connection.query('INSERT INTO Patients (id, firstName, lastName, birthDate, phoneNumber, cellphoneNumber, street, city, houseNumber, positiveResultDate, recoveryDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE firstName=VALUES(firstName), lastName=VALUES(lastName), birthDate=VALUES(birthDate), phoneNumber=VALUES(phoneNumber), cellphoneNumber=VALUES(cellphoneNumber), street=VALUES(street), city=VALUES(city), houseNumber=VALUES(houseNumber), positiveResultDate=VALUES(positiveResultDate), recoveryDate=VALUES(recoveryDate)',
                [id, firstName, lastName, birthDate, phoneNumber, cellphoneNumber, street, city, houseNumber, positiveResultDate, recoveryDate],
                (err, result) => {
                    if (err) {
                        connection.release();
                        reject(err);
                    }

                    const promises = Object.values(vaccines).map((vaccine, index) => {
                        if (!vaccine) {
                            return new Promise((resolve, reject) => {
                                connection.query('DELETE FROM vaccines (personId, number) VALUES (?, ?)',
                                    [id, index + 1],
                                    (err, result) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve();
                                        }
                                    });
                            });
                        }
                        const { date, manufacturer } = vaccine;
                        return new Promise((resolve, reject) => {
                            connection.query('REPLACE INTO vaccines (personId, number, date, manufacture) VALUES (?, ?, ?, ?)',
                                [id, index + 1, date, manufacturer],
                                (err, result) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve();
                                    }
                                });
                        });
                    });

                    Promise.all(promises)
                        .then(() => {
                            connection.release();
                            resolve();
                        })
                        .catch((err) => {
                            connection.release();
                            reject(err);
                        });
                });
        });
    });
}

exports.createNewPatient = (newPatientData) => {
    return new Promise((resolve, reject) => {
        const validation = validatePatientDetails(newPatientData);
        if (!validation[0]) {
            reject(new Error(validation[1]));
            return;
        }

        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                console.log(newPatientData);
                const { id, firstName, lastName, birthDate, phoneNumber, cellphoneNumber, street, city, houseNumber, positiveResultDate, recoveryDate, vaccines } = newPatientData;
                const { vac1, vac2, vac3, vac4 } = vaccines;

                const insertPatientQuery = 'INSERT INTO Patients (id, firstName, lastName, birthDate, phoneNumber, cellphoneNumber, city, street, houseNumber, positiveResultDate, recoveryDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

                connection.query(insertPatientQuery, [id, firstName, lastName, birthDate, phoneNumber, cellphoneNumber, city, street, houseNumber, positiveResultDate, recoveryDate], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        const vaccines = [vac1, vac2, vac3, vac4];
                        // Insert vaccine data for each pair of dateVac and manufactureVac if they are not NULL
                        for (let i = 1; i <= 4; i++) {
                            const vac = vaccines[i - 1];
                            if (vac && vac.date && vac.manufacturer) {
                                const insertVaccineQuery = 'INSERT INTO Vaccines (personId, date, manufacture, number) VALUES (?, ?, ?, ?)';
                                connection.query(insertVaccineQuery, [id, vac.date, vac.manufacturer, i], (err, result) => {
                                    if (err) {
                                        reject(err);
                                    }
                                });
                            }
                        }
                        resolve('New patient data and vaccine information inserted successfully.');
                    }
                    connection.release();
                });
            }
        });
    });
};

exports.deletePatient = (patientId) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                const deleteQueries = [
                    'DELETE FROM Vaccines WHERE personId = ?',
                    'DELETE FROM Patients WHERE id = ?'
                ];

                connection.query('START TRANSACTION', (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        connection.query(deleteQueries[0], [patientId], (err, result) => {
                            if (err) {
                                connection.query('ROLLBACK', () => {
                                    connection.release(); // Release connection on error
                                    reject(err);
                                });
                            } else {
                                connection.query(deleteQueries[1], [patientId], (err, result) => {
                                    if (err) {
                                        connection.query('ROLLBACK', () => {
                                            connection.release(); // Release connection on error
                                            reject(err);
                                        });
                                    } else {
                                        connection.query('COMMIT', (err) => {
                                            if (err) {
                                                connection.query('ROLLBACK', () => {
                                                    connection.release(); // Release connection on error
                                                    reject(err);
                                                });
                                            } else {
                                                connection.release(); // Release connection after successful deletion
                                                resolve('Patient data deleted successfully.');
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });
};

function validatePatientDetails(patientDetails) {
    // Check if id length is between 7 to 9 digits
    if (patientDetails.id.length < 7 || patientDetails.id.length > 9) {
        return [false, "Error: ID length must be between 7 to 9 digits"];
    }

    // Iterate over each vaccine date and manufacturer to check the order and date validity
    let vaccines = [patientDetails.vaccines.vac1, patientDetails.vaccines.vac2, patientDetails.vaccines.vac3, patientDetails.vaccines.vac4];
    for (let i = 0; i < vaccines.length - 1; i++) {
        if (vaccines[i] && vaccines[i + 1]) {
            if (new Date(vaccines[i].date) >= new Date(vaccines[i + 1].date)) {
                return [false, "Error: Vaccine dates are not in chronological order"];
            }
        }
        else if (vaccines[i + 1] && !vaccines[i]) {
            return [false, "Error: Vaccine dates are not in chronological order"];
        }
    }

    // Check if the last vaccine date is not greater than the current date
    let lastNonNullDate = null;
    for (let i = vaccines.length - 1; i >= 0; i--) {
        if (vaccines[i]) {
            lastNonNullDate = new Date(vaccines[i]);
            break;
        }
    }

    let currentDate = new Date();
    if (lastNonNullDate && lastNonNullDate > currentDate) {
        return [false, "Error: Last vaccine date cannot be greater than current date"];
    }

    // All checks passed
    return [true, "Patient details are valid"];
}

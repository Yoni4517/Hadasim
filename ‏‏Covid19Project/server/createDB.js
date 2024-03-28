const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.HOST_NAME,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT
});

exports.createDB = () => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'CovidDB'", (err, rows) => {
      if (err) throw err;
      if (rows.length > 0) {
        console.log("Database already exists");
        connection.release();
        console.log('Connection released');
      } else {
        connection.query("CREATE DATABASE CovidDB", (err) => {
          if (err) throw err;
          console.log("Database created");
          connection.release();
          console.log('Connection released');
        });
      }
    });
  });
}

exports.createPatientsTable = () => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    const createTableQuery = `
          CREATE TABLE IF NOT EXISTS Patients (
              id INT PRIMARY KEY,
              firstName VARCHAR(255) NOT NULL,
              lastName VARCHAR(255) NOT NULL,
              birthDate DATE NOT NULL,
              phoneNumber VARCHAR(255),
              cellphoneNumber VARCHAR(255),
              city VARCHAR(255) NOT NULL,
              street VARCHAR(255) NOT NULL,
              houseNumber INT NOT NULL,
              positiveResultDate DATE,
              recoveryDate DATE
          )
      `;

    connection.query('SHOW TABLES LIKE "Patients"', (err, result) => {
      if (err) throw err;

      if (result.length > 0) {
        console.log("Table Patients already exists");
        connection.release();
      } else {
        connection.query(createTableQuery, (err) => {
          if (err) throw err;
          console.log("Table Patients created");
          connection.release();
        });
      }
    });
  });
}

exports.createVaccinesTable = () => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    const createTableQuery = `
          CREATE TABLE IF NOT EXISTS vaccines (
              personId INT,
              number INT,
              date DATE,
              manufacture VARCHAR(255),
              PRIMARY KEY(personId, number),
              FOREIGN KEY (personId) REFERENCES Patients(id)
          )
      `;

    connection.query('SHOW TABLES LIKE "vaccines"', (err, result) => {
      if (err) throw err;

      if (result.length > 0) {
        console.log("Table vaccines already exists");
        connection.release();
      } else {
        connection.query(createTableQuery, (err) => {
          if (err) throw err;
          console.log("Table vaccines created");
          connection.release();
        });
      }
    });
  });
}

exports.resetDB = () => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query('SHOW DATABASES LIKE ?', [connection.config.database], (err, result) => {
      if (err) {
        console.error('Error checking database existence:', err);
        connection.release();
        return;
      }

      if (result.length === 0) {
        console.log('Database does not exist');
        connection.release();
      } else {
        deleteTables(connection);
      }
    });
  });
  function deleteTables(connection) {
    const disableForeignKeyCheckQuery = 'SET FOREIGN_KEY_CHECKS = 0';
    const enableForeignKeyCheckQuery = 'SET FOREIGN_KEY_CHECKS = 1';
    const tablesQuery = 'SHOW TABLES';

    connection.query(disableForeignKeyCheckQuery, (err) => {
        if (err) {
            console.error('Error disabling foreign key checks:', err);
            connection.release();
            return;
        }

        connection.query(tablesQuery, (err, tables) => {
            if (err) {
                console.error('Error fetching tables:', err);
                connection.release();
                return;
            }

            tables.forEach((table) => {
                const tableName = Object.values(table)[0];
                const dropTableQuery = `DROP TABLE IF EXISTS \`${tableName}\``;

                connection.query(dropTableQuery, (err) => {
                    if (err) {
                        console.error(`Error dropping table ${tableName}:`, err);
                        return;
                    }
                    console.log(`Dropped table: ${tableName}`);
                });
            });

            connection.query(enableForeignKeyCheckQuery, (err) => {
                if (err) {
                    console.error('Error enabling foreign key checks:', err);
                }
                connection.release();
            });
        });
    });
}
}



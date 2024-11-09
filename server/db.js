// db.js
const mysql = require('mysql2');

// Create the connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',      // XAMPP runs MySQL on localhost by default
  user: 'root',           // MySQL username (default is "root" in XAMPP)
  password: '',           // MySQL password (default is an empty string for XAMPP)
  database: 'rpm'         // The name of your database
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('Connected to MySQL!');
});

module.exports = connection;

import mysql from "mysql";
import "dotenv/config";

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) console.error("Database connection error: " + err.message);
    else console.log("Connected to the database");
});

export default db;

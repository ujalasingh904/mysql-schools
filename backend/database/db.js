import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.log("Datbase connection failed:", err);
        process.exit(1);
    } else {
        console.log('Database connected');
    }
});

export default db;

import db from "../database/db.js"; // Import the database connection 

export const addSchool = (req, res) => {
    const { name, address, latitude, longitude } = req.body; 

    if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ message: "Invalid input data" });
    }

    // Query to create table if not exists
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS schools (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            address VARCHAR(255) NOT NULL,
            latitude FLOAT NOT NULL,
            longitude FLOAT NOT NULL
        )
    `;

    // First, create the table if it doesn't exist
    db.query(createTableQuery, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database error while creating table" });
        }

        // Insert data into the table after creating it (if needed)
        const insertQuery = 'INSERT INTO schools (name, address, latitude, longitude) VALUES(?,?,?,?)';
        db.query(insertQuery, [name, address, latitude, longitude], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Database error while inserting data" });
            }

            return res.status(201).json({ message: "School added successfully" });
        });
    });
};


const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const listSchools = (req, res) => {
    const { latitude, longitude } = req.body;
    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ message: "Invalid query parameters" });
    }

    const query = 'SELECT * FROM schools';
    db.query(query, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database error" });
        }

        const sortedSchools = results.map(school => ({
            ...school,
            distance: calculateDistance(latitude, longitude, school.latitude, school.longitude)
        })).sort((a, b) => a.distance - b.distance);

        return res.status(200).json(sortedSchools);
    })

}
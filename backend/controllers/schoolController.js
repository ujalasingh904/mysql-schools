import db from "../database/db.js"; // Import the database connection 


// Add School
export const addSchool = (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ message: 'Invalid input data.' });
    }

    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    db.query(query, [name, address, latitude, longitude], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.' });
        }
        res.status(201).json({ message: 'School added successfully.' });
    });
};

// Calculate Distance 
const calculateDistance = (lat1, lon1, lat2, lon2) => { 
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

// List Schools
export const listSchools = (req, res) => {
    const { latitude, longitude } = req.body;

    // Convert latitude and longitude to numbers
    const lat = parseFloat(latitude);
    const long = parseFloat(longitude);

    // if (isNaN(lat) || isNaN(long)) {
    //     return res.status(400).json({ message: 'Invalid query parameters.' });
    // }

    const query = 'SELECT * FROM schools';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.' });
        }

        const sortedSchools = results.map(school => ({
            ...school,
            distance: calculateDistance(lat, long, school.latitude, school.longitude)
        })).sort((a, b) => a.distance - b.distance);

        res.status(200).json(sortedSchools);
    });
};


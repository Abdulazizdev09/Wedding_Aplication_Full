const bcryptjs = require("bcryptjs");
const pool = require("../../config/db");

exports.createOwner = async (req, res) => {
    try {
        // - getting infos from body
        const { first_name, last_name, username, password, phone_number } = req.body;
        const hashedPassword = await bcryptjs.hash(password, 10);

        const existingUser = await pool.query(`SELECT * FROM USERS WHERE username = $1`, [username]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: `User with this username already exist`
            });
        }

        const query = `INSERT INTO USERS (first_name, last_name, username, password, phone_number, role) VALUES($1,$2,$3,$4,$5,'hall_owner') returning *`;
        const values = [first_name, last_name, username, hashedPassword, phone_number];
        const result = await pool.query(query, values);
        const newUser = result.rows[0];
        res.status(201).json({
            message: "Owner created successfully",
            user: {
                id: newUser.id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                username: newUser.username,
                phone_number: newUser.phone_number,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error("Error creating hall_owner:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

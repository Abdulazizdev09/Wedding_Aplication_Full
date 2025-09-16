// - get all owners 
const pool = require("../../config/db")

exports.getOwners = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                u.id, 
                u.first_name,
                u.phone_number,
                COUNT(h.id) AS hall_count,
                COALESCE(STRING_AGG(h.name, ', '), 'No halls') AS halls_info
            FROM USERS u
            LEFT JOIN wedding_halls h ON u.id = h.owner_id
            WHERE u.role = 'hall_owner'
            GROUP BY u.id, u.first_name;

            `)

        if (result.rows.length === 0) {
            return res.status(404).json({ message: `Hall Owners not found` })
        }
        res.status(200).json(result.rows)

    } catch (error) {
        console.error("Cannot get owners:", error.message);
        res.status(500).json({ message: `❌❌Internal Server Error❌❌` })
    }
}
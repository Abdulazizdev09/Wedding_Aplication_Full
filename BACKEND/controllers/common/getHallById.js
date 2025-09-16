// ✅ This function is already correct - no changes needed
const pool = require("../../config/db");

exports.getHallById = async (req, res) => {
    const hallId = req.params.hall_id;

    try {
        const hallQuery = await pool.query(
            `SELECT wh.*, u.phone_number as contact_number, u.first_name, u.last_name
             FROM wedding_halls wh
             LEFT JOIN users u ON wh.owner_id = u.id
             WHERE wh.id = $1`, 
            [hallId]
        );

        if (hallQuery.rows.length === 0) {
            return res.status(404).json({ message: "Hall not found" });
        }

        const hall = hallQuery.rows[0];

        // Get images
        const imageQuery = await pool.query(
            `SELECT id, image_path, is_main FROM hall_images WHERE hall_id = $1 ORDER BY is_main DESC`,
            [hallId]
        );
        hall.images = imageQuery.rows;

        // Get booked dates for calendar
        const bookedDatesQuery = await pool.query(
            `SELECT DISTINCT event_date FROM bookings 
             WHERE hall_id = $1 AND status != 'canceled'
             ORDER BY event_date`,
            [hallId]
        );
        hall.booked_dates = bookedDatesQuery.rows.map(row => row.event_date);

        return res.status(200).json({
            success: true,
            data: hall
        });
    } catch (error) {
        console.error("getHallById error:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
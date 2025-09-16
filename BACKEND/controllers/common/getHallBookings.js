const pool = require("../../config/db");

exports.getHallBookings = async (req, res) => {
    const hallId = req.params.hall_id;

    try {
        // Check if hall exists
        const hallExists = await pool.query(
            `SELECT id FROM wedding_halls WHERE id = $1`, 
            [hallId]
        );

        if (hallExists.rows.length === 0) {
            return res.status(404).json({ message: "Hall not found" });
        }

        // 🔄 FIXED: Add 'as booking_date' for frontend compatibility
        const bookingsQuery = await pool.query(
            `SELECT DISTINCT event_date as booking_date
             FROM bookings 
             WHERE hall_id = $1 
             AND status != 'canceled'
             ORDER BY event_date ASC`,
            [hallId]
        );

        // 🔄 FIXED: Return in format frontend expects
        return res.status(200).json({
            data: bookingsQuery.rows
        });

    } catch (error) {
        console.error("getHallBookings error:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
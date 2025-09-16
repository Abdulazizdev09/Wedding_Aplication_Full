const pool = require("../../config/db");

exports.getBookings = async (req, res) => {
    try {
        const owner_id = req.user.id;
        const result = await pool.query(`
            SELECT 
                b.id as booking_id,
                b.booked_date,
                b.event_date,
                b.booked_seats,
                b.status,
                wh.name as hall_name,
                wh.region,
                wh.id as hall_id,
                wh.capacity as hall_capacity,
                wh.price_per_seat,
                client.first_name as booker_name,
                client.last_name as booker_surname,
                client.phone_number as booker_phone_number,
                client.username as booker_username
            FROM bookings b
            INNER JOIN wedding_halls wh ON b.hall_id = wh.id
            LEFT JOIN users client ON b.client_id = client.id AND client.role = 'client'
            WHERE wh.owner_id = $1
            ORDER BY b.event_date DESC, b.booked_date DESC
        `, [owner_id]);
        
        if (result.rows.length === 0) {
            return res.status(200).json({ 
                message: "No bookings found for your halls",
                bookings: [],
                total: 0
            });
        }
        
        res.status(200).json({
            message: "Your hall bookings retrieved successfully",
            bookings: result.rows,
            total: result.rows.length
        });
    } catch (error) {
        console.error("Error getting owner bookings:", error.message);
        res.status(500).json({ 
            message: "Internal Server Error",
            error: error.message 
        });
    }
};
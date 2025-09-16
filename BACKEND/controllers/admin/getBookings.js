const pool = require("../../config/db");

exports.getBookings = async (req, res) => {
    try {
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
                client.username as booker_username,
                owner.first_name as owner_name,
                owner.last_name as owner_surname,
                owner.phone_number as owner_phone_number
            FROM bookings b
            LEFT JOIN wedding_halls wh ON b.hall_id = wh.id
            LEFT JOIN users client ON b.client_id = client.id AND client.role = 'client'
            LEFT JOIN users owner ON wh.owner_id = owner.id AND owner.role = 'hall_owner'
            ORDER BY b.event_date DESC, b.booked_date DESC
        `);
        
        if (result.rows.length === 0) {
            return res.status(200).json({ 
                message: "No bookings found",
                bookings: [],
                total: 0
            });
        }
        
        res.status(200).json({
            message: "Bookings retrieved successfully",
            bookings: result.rows,
            total: result.rows.length
        });
    } catch (error) {
        console.error("Error getting bookings:", error.message);
        res.status(500).json({ 
            message: "Internal Server Error",
            error: error.message 
        });
    }
};

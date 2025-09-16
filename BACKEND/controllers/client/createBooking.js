// Secure createBooking.js - Get client_id from JWT token (NOT from frontend)
const pool = require("../../config/db");

exports.createBookings = async (req, res) => {
    try {
        // 🔒 SECURITY: Get client_id from JWT token (NOT from request body)
        const client_id = req.user.id;  // From authentication middleware
        
        // Get data from frontend (NO client_id)
        const { event_date, number_of_seats, hall_id } = req.body;
        
        console.log('🎯 Creating booking:', {
            client_id,
            hall_id,
            event_date,
            number_of_seats
        });

        // Validate required fields
        if (!event_date || !number_of_seats || !hall_id) {
            return res.status(400).json({ 
                message: "Missing required fields: event_date, number_of_seats, hall_id" 
            });
        }

        if (!client_id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // Validate hall exists and get capacity
        const hallResult = await pool.query(
            `SELECT id, name, capacity FROM wedding_halls WHERE id = $1`, 
            [hall_id]
        );

        if (hallResult.rows.length === 0) {
            return res.status(404).json({ message: "Hall not found" });
        }

        const hall = hallResult.rows[0];

        // Check capacity
        if (number_of_seats > hall.capacity) {
            return res.status(400).json({ 
                message: `Requested seats (${number_of_seats}) exceed hall capacity (${hall.capacity})` 
            });
        }

        // Check if date is already booked
        const existingBooking = await pool.query(
            `SELECT id FROM bookings 
             WHERE hall_id = $1 AND event_date = $2 AND status != 'canceled'`,
            [hall_id, event_date]
        );

        if (existingBooking.rows.length > 0) {
            return res.status(400).json({ 
                message: "This hall is already booked for the selected date" 
            });
        }

        // 🔄 FIXED: Correct SQL with 5 placeholders for 5 values
        const query = `
            INSERT INTO bookings(event_date, booked_seats, status, client_id, hall_id, booked_date)
            VALUES($1, $2, $3, $4, $5, NOW())
            RETURNING *
        `;
        
        const values = [event_date, number_of_seats, "will_happen", client_id, hall_id];
        const result = await pool.query(query, values);

        console.log('🎯 Booking created successfully:', result.rows[0]);

        res.status(201).json({ 
            message: "✅✅ Booked Successfully ✅✅", 
            booking: result.rows[0],
            hall: hall
        });

    } catch (error) {
        console.error("❌ Error creating booking:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
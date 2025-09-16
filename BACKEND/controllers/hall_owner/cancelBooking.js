const pool = require("../../config/db");

exports.cancelBooking = async (req, res) => {
    try {
        const { booking_id } = req.params;
        const owner_id = req.user.id;

        // First, verify that this booking belongs to a hall owned by this owner
        const verifyResult = await pool.query(`
            SELECT b.id, b.status, b.event_date, b.hall_id, wh.name as hall_name, wh.owner_id
            FROM bookings b
            INNER JOIN wedding_halls wh ON b.hall_id = wh.id
            WHERE b.id = $1 AND wh.owner_id = $2
        `, [booking_id, owner_id]);

        if (verifyResult.rows.length === 0) {
            return res.status(404).json({ 
                message: "Booking not found or you don't have permission to cancel this booking" 
            });
        }

        const booking = verifyResult.rows[0];

        // Check if booking is already canceled
        if (booking.status === 'canceled') {
            return res.status(400).json({ 
                message: "Booking is already canceled" 
            });
        }

        // Check if booking has already happened
        if (booking.status === 'happened') {
            return res.status(400).json({ 
                message: "Cannot cancel a booking that has already happened" 
            });
        }

        // Check if the event date has passed
        const eventDate = new Date(booking.event_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (eventDate < today) {
            return res.status(400).json({ 
                message: "Cannot cancel a booking for a past date" 
            });
        }

        // Update booking status to canceled
        const updateResult = await pool.query(`
            UPDATE bookings 
            SET status = 'canceled'
            WHERE id = $1
            RETURNING *
        `, [booking_id]);

        // Update calendar day status back to free (if you're using calendar_days table)
        await pool.query(`
            UPDATE calendar_days 
            SET status = 'free'
            WHERE hall_id = $1 AND date = $2
        `, [booking.hall_id, booking.event_date]);

        res.status(200).json({
            message: `Booking #${booking_id} for ${booking.hall_name} has been canceled successfully`,
            booking: updateResult.rows[0]
        });

    } catch (error) {
        console.error("Error canceling booking:", error.message);
        res.status(500).json({ 
            message: "Internal Server Error",
            error: error.message 
        });
    }
};
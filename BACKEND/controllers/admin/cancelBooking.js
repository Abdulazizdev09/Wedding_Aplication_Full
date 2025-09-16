
const pool = require("../../config/db");
exports.cancelBooking = async (req, res) => {
    try {
        const { booking_id } = req.params;
        
        // First check if booking exists
        const checkBooking = await pool.query(
            'SELECT * FROM bookings WHERE id = $1',
            [booking_id]
        );
        
        if (checkBooking.rows.length === 0) {
            return res.status(404).json({ 
                message: "Booking not found" 
            });
        }
        
        // Cancel the booking (you can either DELETE or UPDATE status)
        // Option 1: Delete the booking
        await pool.query('DELETE FROM bookings WHERE id = $1', [booking_id]);
        
        // Option 2: Update status to 'cancelled' (recommended)
        // await pool.query(
        //     'UPDATE bookings SET status = $1 WHERE id = $2',
        //     ['cancelled', booking_id]
        // );
        
        res.status(200).json({ 
            message: "Booking cancelled successfully" 
        });
        
    } catch (error) {
        console.error("Error cancelling booking:", error.message);
        res.status(500).json({ 
            message: "Internal Server Error",
            error: error.message 
        });
    }
};
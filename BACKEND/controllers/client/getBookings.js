// Truly Fixed getBookings.js - Remove ALL created_at references
const pool = require("../../config/db")

exports.getBookings = async (req, res) => {
    try {
        const client_id = req.user.id
        console.log('🎯 DEBUG: Looking for bookings for client_id:', client_id);
        console.log('🎯 DEBUG: client_id type:', typeof client_id);
        
        // 🔍 STEP 1: Check if ANY bookings exist for this client (without JOIN)
        const simpleCheck = await pool.query(`
            SELECT * FROM bookings 
            WHERE client_id = $1
        `, [client_id]);
        
        console.log('🎯 DEBUG: Simple bookings for this client:', simpleCheck.rows.length);
        console.log('🎯 DEBUG: Simple bookings data:', simpleCheck.rows);
        
        // 🔍 STEP 2: Check ALL bookings in database
        const allBookings = await pool.query(`SELECT client_id, hall_id, status FROM bookings LIMIT 10`);
        console.log('🎯 DEBUG: All bookings in database:', allBookings.rows);
        console.log('🎯 DEBUG: All client_ids in database:', [...new Set(allBookings.rows.map(b => b.client_id))]);
        
        // 🔍 STEP 3: Check if wedding_halls table exists and has data
        const hallsCheck = await pool.query(`SELECT id, name FROM wedding_halls LIMIT 5`);
        console.log('🎯 DEBUG: Wedding halls exist:', hallsCheck.rows.length);
        
        // 🔄 FIXED: Remove wh.address since column doesn't exist
        const result = await pool.query(`
            SELECT 
                b.*,
                b.event_date as booking_date,
                b.booked_seats as number_of_seats,
                wh.name as hall_name,
                wh.region as hall_region,
                wh.price_per_seat as hall_price_per_seat,
                wh.phone_number as hall_phone,
                wh.capacity as hall_capacity,
                wh.status as hall_status,
                wh.owner_id as hall_owner_id
            FROM bookings b
            LEFT JOIN wedding_halls wh ON b.hall_id = wh.id
            WHERE b.client_id = $1 
            ORDER BY b.booked_date DESC
        `, [client_id]);
        
        console.log('🎯 DEBUG: Final query result:', result.rows.length);
        console.log('🎯 DEBUG: Final query data:', result.rows);

        res.status(200).json(result.rows)
        
    } catch (error) {
        console.error("❌ Error getting bookings:", error.message);
        console.error("❌ Full error:", error);
        res.status(500).json({ message: `Internal Server Error: ${error.message}` })
    }
}
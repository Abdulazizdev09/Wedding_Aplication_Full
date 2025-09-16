// - cancel booking that made by him/herself
const pool = require("../../config/db");

exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.booking_id;
    const clientId = req.user.id;

    const booking = await pool.query(`SELECT * FROM BOOKINGS WHERE id = $1`, [bookingId]);
    if (booking.rows.length === 0 || booking.rows[0].client_id !== clientId) {
      return res.status(403).json({ message: "❌ Not allowed to cancel this booking ❌" });
    }

    await pool.query(`DELETE FROM BOOKINGS WHERE id = $1`, [bookingId]);
    res.status(200).json({ message: "✅ Booking cancelled by client ✅" });

  } catch (error) {
    console.error("Client Cancel Error:", error.message);
    res.status(500).json({ message: "❌ Internal Server Error ❌" });
  }
};


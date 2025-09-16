const express = require("express");
const { register } = require("../controllers/auth/register");
const { createBookings } = require("../controllers/client/createBooking");
const { getHalls } = require("../controllers/client/getHalls");
const { getBookings } = require("../controllers/client/getBookings");
const { cancelBooking } = require("../controllers/client/cancelBooking");
const { checkRole } = require("../middleware/checkRole");
const router = express.Router();




// - CHECKING FOR ROLE
router.use(checkRole(["client"]))


// - GET
router.get("/my-bookings", getBookings)

// - POST
router.post("/create-booking", createBookings)

// - DELETE
router.delete("/cancel-booking/:booking_id", cancelBooking)

module.exports = router
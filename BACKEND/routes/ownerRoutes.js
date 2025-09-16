const express = require("express")
const { createHall } = require("../controllers/hall_owner/createHall")
const { getHalls } = require("../controllers/hall_owner/getHalls")
const { getBookings } = require("../controllers/hall_owner/getBookings")
const { cancelBooking } = require("../controllers/hall_owner/cancelBooking")
const { deleteHall } = require("../controllers/hall_owner/deleteHall")
const { editHall } = require("../controllers/hall_owner/editHall")
const { checkRole } = require("../middleware/checkRole")
const { uploadMany } = require("../middleware/uploadMiddleWare")
const router = express.Router()


// - CHECKING FOR ROLE
router.use(checkRole(["hall_owner"]))

// - GET
router.get("/my-halls", getHalls)
router.get("/get-bookings", getBookings)

// - POST
router.post("/create-hall", uploadMany, createHall)


// - PUT
router.put("/edit-hall/:hall_id", editHall)

// - DELETE
router.delete("/cancel-booking/:booking_id", cancelBooking)
router.delete("/delete-hall/:hall_id", deleteHall)


module.exports = router
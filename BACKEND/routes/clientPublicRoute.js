const express = require("express")
const { getHalls } = require("../controllers/client/getHalls")
const { getHallById } = require("../controllers/common/getHallById")
const { getHallBookings } = require("../controllers/common/getHallBookings")

const router = express.Router()

// - it is not protected because client should able  to watch all wedding halls without registration
router.get("/get-halls", getHalls)
router.get("/get-hall/:hall_id", getHallById)
router.get("/hall-bookings/:hall_id",getHallBookings)

module.exports = router
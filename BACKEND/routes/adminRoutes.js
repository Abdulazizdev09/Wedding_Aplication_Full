const express = require("express");
const { createOwner } = require("../controllers/admin/createOwner");
const { createHall } = require("../controllers/admin/createHall");
const { getHalls } = require("../controllers/admin/getHalls");
const { getBookings } = require("../controllers/admin/getBookings");
const { getOwners } = require("../controllers/admin/getOwners");
const { cancelBooking } = require("../controllers/admin/cancelBooking");
const { deleteHall } = require("../controllers/admin/deleteHall");
const { editHall } = require("../controllers/admin/editHall");
const { checkRole } = require("../middleware/checkRole");
const { uploadMany } = require("../middleware/uploadMiddleWare");
const { getHallById } = require("../controllers/common/getHallById");
const router = express.Router();

// - CHECKING FOR ROLE
router.use(checkRole(["admin"]))

// - GET
router.get("/get-halls", getHalls)
router.get("/get-bookings", getBookings)
router.get("/get-owners", getOwners)

// - POST
router.post("/create-owner", createOwner);
router.post("/create-hall", uploadMany, createHall)

// - PUT
router.put("/edit-hall/:hall_id", editHall)

// - DELETE
router.delete("/cancel-booking/:booking_id", cancelBooking)
router.delete("/delete-hall/:hall_id", deleteHall)



module.exports = router;

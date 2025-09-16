const express = require("express");
const cors = require("cors");
const app = express()
require("dotenv").config();


const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const clientRoutes = require("./routes/clientRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const clientPublicRoute = require("./routes/clientPublicRoute");

const { authentication } = require("./middleware/authentication");


app.use(cors());
app.use(express.json());




// - Auth routes
app.use("/auth", authRoutes);

// - Public Router for client 
app.use("/public", clientPublicRoute)


app.use("/uploads", express.static("uploads"))


// - Check for token
app.use(authentication)

// - Role routes (admin,hall_owner,client);
app.use("/admin", adminRoutes);
app.use("/hall-owner", ownerRoutes)
app.use("/client", clientRoutes)

// - Image upload


const PORT = process.env.PORT || 9000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

const pool = require("../../config/db")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config();

exports.logIn = async (req, res) => {
    try {
        const { username, password } = req.body
        // - cheking if user exists
        const result = await pool.query(
            `
                select * from users where username=$1 limit 1
            `, [username]
        )
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "User does not exist" })
        }

        const user = result.rows[0]
        // - cheking is password correct
        const isValidPassword = await bcryptjs.compare(password, user.password)

        if (!isValidPassword) {
            return res.status(401).json({ message: "Incorrect username or password" })
        }

        // - giving values to token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: "2h" }
        )

        res.status(200).json({
            message: "✅✅✅Successfully login in✅✅✅",
            token, user: { id: user.id, username: user.username, role: user.role }
        })

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
}
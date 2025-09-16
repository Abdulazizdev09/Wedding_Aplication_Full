// - adding new hall
const pool = require("../../config/db")


exports.createHall = async (req, res) => {
    try {
        const { name, region, capacity, price_per_seat, owner_id, phone_number } = req.body;
        const files = req.files;

        const query =
            `   INSERT INTO WEDDING_HALLS(name, region, capacity, price_per_seat, status, owner_id, phone_number)
            VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *
        `
        const capacityInt = parseInt(capacity, 10);
        const priceNum = parseFloat(price_per_seat);
        const owner = owner_id ? owner_id : null;
        if (isNaN(capacityInt) || capacityInt <= 0) {
            return res.status(400).json({ message: "Invalid capacity" });
        }

        if (isNaN(priceNum) || priceNum < 0) {
            return res.status(400).json({ message: "Invalid price_per_seat" });
        }
        const values = [name, region, capacityInt, priceNum, "confirmed", owner, phone_number || null]
        const hallResult = await pool.query(query, values)

        const hallId = hallResult.rows[0].id

        // - Save each image with is_main true for the first one
        for (let i = 0; i < files.length; i++) {
            await pool.query(
                `INSERT INTO hall_images (image_path, is_main, hall_id)
                 VALUES($1,$2,$3)
                `,
                [files[i].path, i === 0, hallId]
            )
        }

        res.status(201).json({ message: "✅✅Wedding Hall  created successfully✅✅", data: hallResult.rows[0] })

    } catch (error) {
        console.error("Error creating hall:", error.message);
        res.status(500).json({ message: `❌❌Internal Server Error❌❌` })
    }
}
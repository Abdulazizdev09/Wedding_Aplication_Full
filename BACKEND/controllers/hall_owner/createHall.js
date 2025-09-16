const pool = require("../../config/db");

exports.createHall = async (req, res) => {
  try {
    const owner_id = req.user.id;
    const files = req.files;
    const { name, region, capacity, price_per_seat, phone_number } = req.body;

    // Validate capacity and price_per_seat
    const capacityInt = parseInt(capacity, 10);
    const priceNum = parseFloat(price_per_seat);

    if (isNaN(capacityInt) || capacityInt <= 0) {
      return res.status(400).json({ message: "Invalid capacity" });
    }

    if (isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({ message: "Invalid price_per_seat" });
    }

    // Insert hall with "unconfirmed" status and owner_id from authenticated user
    const query = `
      INSERT INTO WEDDING_HALLS(name, region, capacity, price_per_seat, status, owner_id, phone_number)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `;
    const values = [name, region, capacityInt, priceNum, "unconfirmed", owner_id, phone_number];
    const result = await pool.query(query, values);

    const hallId = result.rows[0].id;

    // Save images, mark first as main
    for (let i = 0; i < files.length; i++) {
      await pool.query(
        `INSERT INTO hall_images(image_path, is_main, hall_id) VALUES ($1, $2, $3)`,
        [files[i].path, i === 0, hallId]
      );
    }

    res.status(201).json({
      message: "✅✅Wedding Hall Successfully created (pending approval)✅✅",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating hall:", error.stack);
    res.status(500).json({ message: "Internal server error" });
  }
};
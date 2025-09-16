const pool = require("../../config/db");

exports.deleteHall = async (req, res) => {
    try {
        const hallId = req.params.hall_id;
        const ownerId = req.user.id;

        const hall = await pool.query(`SELECT * FROM WEDDING_HALLS WHERE id = $1 AND owner_id = $2`, [hallId, ownerId]);
        if (hall.rows.length === 0) {
            return res.status(403).json({ message: "❌ You can't delete this hall ❌" });
        }

        await pool.query(`DELETE FROM WEDDING_HALLS WHERE id = $1`, [hallId]);
        res.status(200).json({ message: "✅ Hall deleted by owner ✅" });
    } catch (error) {
        console.error("Owner Delete Error:", error.message);
        res.status(500).json({ message: "❌ Internal Server Error ❌" });
    }
};

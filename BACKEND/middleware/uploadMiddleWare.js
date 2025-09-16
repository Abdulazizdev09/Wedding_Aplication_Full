// - Images upload
const multer = require("multer")
const path = require("path")


const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, "uploads/")
    },
    filename: (_, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`
        cb(null, uniqueName);
    },
});

const fileFilter = (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (ext === ".jpg" || ext === ".jpeg" || ext === ".png" || ext === ".webp") {
        cb(null, true)
    } else {
        cb(new Error("Only images are allowed"))
    }
};

const upload = multer({ storage, fileFilter })
exports.uploadMany = upload.array("images", 10); // max 10 images, field name: "images"


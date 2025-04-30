const express = require("express");
const db = require("../db");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../public/img");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

router.get("/profil-perusahaan", (req, res) => {
  db.query("SELECT * FROM profil_perusahaan", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


router.put("/profil-perusahaan/:id", upload.single("image"), (req, res) => {
  const { title, description } = req.body;
  let imagePath;

  if (req.file) {
    imagePath = `/img/${req.file.filename}`;
  }

  if (!imagePath) {
    db.query(
      "SELECT image FROM profil_perusahaan WHERE id = ?",
      [req.params.id],
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: "Profil Perusahaan not found" });

        imagePath = results[0].image;

        // Lanjut update title dan tetap pakai image lama
        db.query(
          "UPDATE profil_perusahaan SET title = ?, description = ?, image = ? WHERE id = ?",
          [title, description, imagePath, req.params.id],
          (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Profil Perusahaan updated", image: imagePath });
          }
        );
      }
    );
  } else {
    db.query(
      "UPDATE profil_perusahaan SET  title = ?, description = ?, image = ? WHERE id = ?",
      [title, description, imagePath, req.params.id],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Perusahaan updated", image: imagePath });
      }
    );
  }
});


module.exports = router;

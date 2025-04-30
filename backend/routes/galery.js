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

router.get("/galery", (req, res) => {
  db.query("SELECT * FROM galery", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get("/galery/:id", (req, res) => {
  db.query("SELECT * FROM galery WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Gallery not found" });
    res.json(results[0]);
  });
});

router.post("/galery", upload.single("image"), (req, res) => {
  const { title, description } = req.body;
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const imagePath = `/img/${req.file.filename}`;

  db.query(
    "INSERT INTO galery (title, image) VALUES (?, ?)",
    [title, imagePath],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, title, image: imagePath });
    }
  );
});

router.put("/galery/:id", upload.single("image"), (req, res) => {
  const { title } = req.body;
  let imagePath;

  if (req.file) {
    imagePath = `/img/${req.file.filename}`;
  }

  if (!imagePath) {
    db.query(
      "SELECT image FROM galery WHERE id = ?",
      [req.params.id],
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: "Gallery not found" });

        imagePath = results[0].image;

        // Lanjut update title dan tetap pakai image lama
        db.query(
          "UPDATE galery SET title = ?, image = ? WHERE id = ?",
          [title, imagePath, req.params.id],
          (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Gallery updated", image: imagePath });
          }
        );
      }
    );
  } else {
    db.query(
      "UPDATE galery SET title = ?, image = ? WHERE id = ?",
      [title, imagePath, req.params.id],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Gallery updated", image: imagePath });
      }
    );
  }
});


router.delete("/galery/:id", (req, res) => {
  db.query("DELETE FROM galery WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Gallery deleted" });
  });
});

module.exports = router;

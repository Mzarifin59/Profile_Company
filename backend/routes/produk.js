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

router.get("/produk", (req, res) => {
  db.query("SELECT * FROM produk", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get("/produk/:id", (req, res) => {
  db.query("SELECT * FROM produk WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Produk not found" });
    res.json(results[0]);
  });
});

router.post("/produk", upload.single("image"), (req, res) => {
  const { title, description } = req.body;
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const imagePath = `/img/${req.file.filename}`;

  db.query(
    "INSERT INTO produk (title, description, image) VALUES (?, ?, ?)",
    [title, description, imagePath],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, title, description, image: imagePath });
    }
  );
});

router.put("/produk/:id", upload.single("image"), (req, res) => {
  const { title, description } = req.body;
  let imagePath;

  if (req.file) {
    imagePath = `/img/${req.file.filename}`;
  }

  if (!imagePath) {
    db.query(
      "SELECT image FROM produk WHERE id = ?",
      [req.params.id],
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: "Produk not found" });

        imagePath = results[0].image;

        // Lanjut update title dan tetap pakai image lama
        db.query(
          "UPDATE produk SET title = ?, description = ?, image = ? WHERE id = ?",
          [title, description, imagePath, req.params.id],
          (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Produk updated", image: imagePath });
          }
        );
      }
    );
  } else {
    db.query(
      "UPDATE produk SET  title = ?, description = ?, image = ? WHERE id = ?",
      [title, description, imagePath, req.params.id],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Produk updated", image: imagePath });
      }
    );
  }
});

router.delete("/produk/:id", (req, res) => {
  db.query("DELETE FROM produk WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Produk deleted" });
  });
});

module.exports = router;

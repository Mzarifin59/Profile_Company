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

router.get("/artikel", (req, res) => {
  db.query("SELECT * FROM artikel", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get("/artikel/:id", (req, res) => {
  db.query("SELECT * FROM artikel WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Artikel not found" });
    res.json(results[0]);
  });
});

router.post("/artikel", upload.single("image"), (req, res) => {
  const { title, slug, description, date, content } = req.body;
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const imagePath = `/img/${req.file.filename}`;

  db.query(
    "INSERT INTO artikel (title, slug, description, date, content, image) VALUES (?, ?, ?, ?, ?, ?)",
    [title,  slug, description, date, content, imagePath],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, title, image: imagePath });
    }
  );
});

router.put("/artikel/:id", upload.single("image"), (req, res) => {
  const { title, slug, description, date, content } = req.body;
  let imagePath = req.body.image;

  if (req.file) {
    imagePath = `/img/${req.file.filename}`;
  }

  db.query(
    "UPDATE artikel SET title = ?, slug= ?, description = ?, date = ?, content = ?, image = ? WHERE id = ?",
    [title, slug, description, date, content, imagePath, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Artikel updated", image: imagePath });
    }
  );
});

router.delete("/artikel/:id", (req, res) => {
  db.query("DELETE FROM artikel WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Artikel deleted" });
  });
});

module.exports = router;

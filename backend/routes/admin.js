const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/admin', (req, res) => {
    db.query('SELECT * FROM admin', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

module.exports = router;

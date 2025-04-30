const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/tags', (req, res) => {
    db.query('SELECT * FROM tags', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.get('/tags/:id', (req, res) => {
    db.query('SELECT * FROM tags WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(results[0]);
    });
});

router.post('/tags', (req, res) => {
    const { name } = req.body;
    db.query('INSERT INTO tags (name) VALUES (?)', [name], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, name});
    });
});

router.put('/tags/:id', (req, res) => {
    const {name} = req.body;
    db.query('UPDATE tags SET name = ? WHERE id = ?', [name, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'User updated' });
    });
});

router.delete('/tags/:id', (req, res) => {
    db.query('DELETE FROM tags WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'User deleted' });
    });
});

module.exports = router;

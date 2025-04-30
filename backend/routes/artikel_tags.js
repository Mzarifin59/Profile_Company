const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/artikel-tags', (req, res) => {
    const query = `
        SELECT 
            a.id AS artikel_id,
            a.title,
            a.slug,
            a.description,
            a.date,
            a.image,
            a.content,
            t.id AS tag_id,
            t.name AS tag_name
        FROM artikel a
        LEFT JOIN artikel_tags at ON a.id = at.artikel_id
        LEFT JOIN tags t ON at.tag_id = t.id
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const articlesMap = {};
        results.forEach(row => {
            if (!articlesMap[row.artikel_id]) {
                articlesMap[row.artikel_id] = {
                    id: row.artikel_id,
                    title: row.title,
                    slug: row.slug,
                    description: row.description,
                    date: row.date,
                    image: row.image,
                    content: row.content,
                    tags: []
                };
            }
            if (row.tag_id) {
                articlesMap[row.artikel_id].tags.push({
                    id: row.tag_id,
                    name: row.tag_name
                });
            }
        });

        const formattedResults = Object.values(articlesMap);
        res.json(formattedResults);
    });
});

// GET artikel dengan tags berdasarkan slug
router.get('/artikel-tags/:slug', (req, res) => {
    const slug = req.params.slug;
    const query = `
        SELECT 
            a.id AS artikel_id,
            a.title,
            a.slug,
            a.description,
            a.date,
            a.image,
            a.content,
            t.id AS tag_id,
            t.name AS tag_name
        FROM artikel a
        LEFT JOIN artikel_tags at ON a.id = at.artikel_id
        LEFT JOIN tags t ON at.tag_id = t.id
        WHERE a.slug = ?
    `;

    db.query(query, [slug], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Artikel tidak ditemukan' });

        const artikel = {
            id: results[0].artikel_id,
            title: results[0].title,
            slug: results[0].slug,
            description: results[0].description,
            date: results[0].date,
            image: results[0].image,
            content: results[0].content,
            tags: []
        };

        results.forEach(row => {
            if (row.tag_id) {
                artikel.tags.push({ id: row.tag_id, name: row.tag_name });
            }
        });

        res.json(artikel);
    });
});


// POST: Tambahkan tag ke artikel tertentu
router.post('/artikel-tags', (req, res) => {
    const { artikel_id, tag_ids } = req.body; 

    if (!artikel_id || !Array.isArray(tag_ids)) {
        return res.status(400).json({ error: 'artikel_id dan tag_ids (array) wajib diisi' });
    }

    const values = tag_ids.map(tag_id => [artikel_id, tag_id]);
    db.query('INSERT INTO artikel_tags (artikel_id, tag_id) VALUES ?', [values], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Relasi artikel-tag berhasil ditambahkan' });
    });
});

// PUT: Replace semua tag dari artikel tertentu
router.put('/artikel-tags/:id', (req, res) => {
    const artikel_id = req.params.id;
    const { tag_ids } = req.body;

    if (!Array.isArray(tag_ids)) {
        return res.status(400).json({ error: 'tag_ids harus berupa array' });
    }

    db.query('DELETE FROM artikel_tags WHERE artikel_id = ?', [artikel_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        if (tag_ids.length === 0) {
            return res.json({ message: 'Semua tag dihapus dari artikel' });
        }

        const values = tag_ids.map(tag_id => [artikel_id, tag_id]);
        db.query('INSERT INTO artikel_tags (artikel_id, tag_id) VALUES ?', [values], (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ message: 'Tag artikel berhasil diperbarui' });
        });
    });
});

router.delete('/artikel-tags/:artikelId/:tagId', (req, res) => {
    const { artikelId, tagId } = req.params;

    db.query('DELETE FROM artikel_tags WHERE artikel_id = ? AND tag_id = ?', [artikelId, tagId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Tag dari artikel berhasil dihapus' });
    });
});

router.get('/artikel-pivot', (req, res) => {
    db.query('SELECT * FROM artikel_tags', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/artikel-pivot', (req, res) => {
    const { artikel_id, tag_id } = req.body;
    db.query('INSERT INTO artikel_tags (artikel_id, tag_id) VALUES (?, ?)', [artikel_id, tag_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ artikel_id, tag_id});
    });
});

router.put('/artikel-pivot/:artikel_id', (req, res) => {
    const { tag_id} = req.body;
    db.query('UPDATE tags SET tag_id = ? WHERE artikel_id = ?', [ tag_id, req.params.artikel_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'User updated' });
    });
});

// DELETE /api/artikel-pivot/:artikelId
router.delete('/artikel-pivot/:artikelId', (req, res) => {
    const { artikelId } = req.params;
  
    try {
      db.query('DELETE FROM artikel_tags WHERE artikel_id = ?', [artikelId]);
      res.status(200).json({ message: 'Relasi artikel-tag dihapus' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

module.exports = router;

const express = require('express');
const router = express.Router();
const Comentario = require('../controllers/comentarios');

// Route to fetch comments by post type and ID
router.get('/:tipo/:id', async (req, res) => {
    try {
        const comments = await Comentario.findByPost(req.params.tipo, req.params.id);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// Route to create a new comment
router.post('/:tipo/:id', async (req, res) => {
    try {
        const newComentario = {
            post_type: req.params.tipo,
            post: req.params.id,
            responding_to: null,
            user: req.body.user || 'anonymous', // Default to 'anonymous' if user data is not provided
            comment: req.body.comentario || '', // Default to an empty string if comment data is not provided
            timestamp: req.body.timestamp || new Date().toISOString().substring(0, 19) // Default to current timestamp if not provided
        };

        const createdComentario = await Comentario.insert(newComentario);
        res.status(201).json(createdComentario);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create comment' });
    }
});

module.exports = router;
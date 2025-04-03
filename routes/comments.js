const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { auth } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// Get comments for a recipe
router.get('/recipe/:recipeId', async (req, res) => {
    try {
        const comments = await Comment.find({ recipe: req.params.recipeId })
            .populate('author', 'name avatar')
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add comment
router.post('/', [auth, [
    check('content', 'Content is required').not().isEmpty(),
    check('recipe', 'Recipe ID is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newComment = new Comment({
            content: req.body.content,
            recipe: req.body.recipe,
            author: req.user.id
        });

        const comment = await newComment.save();
        await comment.populate('author', 'name avatar');
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update comment
router.put('/:id', auth, async (req, res) => {
    try {
        let comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Check user
        if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ error: 'User not authorized' });
        }

        comment = await Comment.findByIdAndUpdate(
            req.params.id,
            { $set: { content: req.body.content } },
            { new: true }
        ).populate('author', 'name avatar');

        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Check user
        if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ error: 'User not authorized' });
        }

        await comment.remove();
        res.json({ msg: 'Comment removed' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

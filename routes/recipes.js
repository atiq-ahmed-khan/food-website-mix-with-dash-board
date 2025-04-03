const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Recipe = require('../models/Recipe');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Set up multer for file upload
const storage = multer.diskStorage({
    destination: './public/uploads/recipes',
    filename: function(req, file, cb) {
        cb(null, 'recipe-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
});

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Get all recipes
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find()
            .populate('author', 'name')
            .sort({ createdAt: -1 });
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single recipe
router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
            .populate('author', 'name')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'name avatar' }
            });
        
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create recipe
router.post('/', [auth, upload.single('image')], [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('ingredients', 'Ingredients are required').not().isEmpty(),
    check('instructions', 'Instructions are required').not().isEmpty(),
    check('cookingTime', 'Cooking time is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('cuisine', 'Cuisine is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newRecipe = new Recipe({
            ...req.body,
            image: `/uploads/recipes/${req.file.filename}`,
            author: req.user.id
        });

        const recipe = await newRecipe.save();
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update recipe
router.put('/:id', [auth, upload.single('image')], async (req, res) => {
    try {
        let recipe = await Recipe.findById(req.params.id);
        
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        // Check user
        if (recipe.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ error: 'User not authorized' });
        }

        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = `/uploads/recipes/${req.file.filename}`;
        }

        recipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        res.json(recipe);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete recipe
router.delete('/:id', auth, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        // Check user
        if (recipe.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ error: 'User not authorized' });
        }

        await recipe.remove();
        res.json({ msg: 'Recipe removed' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Rate recipe
router.post('/:id/rate', auth, [
    check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const recipe = await Recipe.findById(req.params.id);
        
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        // Check if user already rated
        const ratingIndex = recipe.ratings.findIndex(
            rating => rating.user.toString() === req.user.id
        );

        if (ratingIndex > -1) {
            recipe.ratings[ratingIndex].value = req.body.rating;
        } else {
            recipe.ratings.push({ user: req.user.id, value: req.body.rating });
        }

        await recipe.save();
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

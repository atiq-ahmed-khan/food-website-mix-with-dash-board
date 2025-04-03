const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    ingredients: [{
        name: {
            type: String,
            required: true
        },
        amount: {
            type: String,
            required: true
        },
        unit: {
            type: String,
            required: true
        }
    }],
    instructions: [{
        step: {
            type: Number,
            required: true
        },
        text: {
            type: String,
            required: true
        }
    }],
    cookingTime: {
        type: Number,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard', 'expert'],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    cuisine: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: '/images/default-recipe.jpg'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ratings: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        value: {
            type: Number,
            min: 1,
            max: 5
        }
    }],
    averageRating: {
        type: Number,
        default: 0
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
recipeSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Calculate average rating before saving
recipeSchema.pre('save', function(next) {
    if (this.ratings.length > 0) {
        this.averageRating = this.ratings.reduce((acc, curr) => acc + curr.value, 0) / this.ratings.length;
    }
    next();
});

module.exports = mongoose.model('Recipe', recipeSchema);

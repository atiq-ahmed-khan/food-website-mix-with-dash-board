const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const config = require('../config/config');

const createAdminUser = async () => {
    try {
        const adminExists = await User.findOne({ email: config.ADMIN_EMAIL });
        if (!adminExists) {
            const admin = new User({
                name: 'Atiq Ahmed',
                email: config.ADMIN_EMAIL,
                password: config.ADMIN_PASSWORD,
                role: 'admin'
            });
            await admin.save();
            console.log('Admin user created successfully');
            return admin;
        }
        return adminExists;
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};

const createSampleRecipes = async (admin) => {
    try {
        if (!admin) return;

        const recipes = [
            {
                title: 'Special Chicken Biryani',
                description: 'A fragrant Indian rice dish with tender chicken, aromatic spices, and garnished with fresh herbs',
                ingredients: [
                    { name: 'Basmati Rice', amount: '500', unit: 'g' },
                    { name: 'Chicken', amount: '800', unit: 'g' },
                    { name: 'Onions', amount: '300', unit: 'g' },
                    { name: 'Yogurt', amount: '200', unit: 'ml' },
                    { name: 'Biryani Spices', amount: '50', unit: 'g' }
                ],
                instructions: [
                    { step: 1, text: 'Marinate chicken with yogurt and spices' },
                    { step: 2, text: 'Cook rice until 70% done' },
                    { step: 3, text: 'Layer rice and chicken' },
                    { step: 4, text: 'Steam cook for perfect results' }
                ],
                cookingTime: 60,
                difficulty: 'medium',
                category: 'Main Course',
                cuisine: 'Indian',
                image: '/images/biryani.jpg',
                author: admin._id
            },
            {
                title: 'Gourmet Sev Puri',
                description: 'Crispy Indian street food appetizers topped with spiced potatoes, chutneys, and garnishes',
                ingredients: [
                    { name: 'Puri Shells', amount: '24', unit: 'pieces' },
                    { name: 'Potato Mixture', amount: '300', unit: 'g' },
                    { name: 'Sev', amount: '100', unit: 'g' },
                    { name: 'Chutneys', amount: '200', unit: 'ml' }
                ],
                instructions: [
                    { step: 1, text: 'Prepare spiced potato mixture' },
                    { step: 2, text: 'Fill puri shells' },
                    { step: 3, text: 'Add chutneys and toppings' },
                    { step: 4, text: 'Garnish with sev and herbs' }
                ],
                cookingTime: 30,
                difficulty: 'easy',
                category: 'Appetizer',
                cuisine: 'Indian',
                image: '/images/sevpuri.jpg',
                author: admin._id
            },
            {
                title: 'Grilled Seafood Platter',
                description: 'A luxurious assortment of grilled seafood served with fresh herbs and dipping sauces',
                ingredients: [
                    { name: 'Salmon', amount: '300', unit: 'g' },
                    { name: 'Mixed Herbs', amount: '50', unit: 'g' },
                    { name: 'Pineapple', amount: '200', unit: 'g' },
                    { name: 'Dipping Sauce', amount: '200', unit: 'ml' }
                ],
                instructions: [
                    { step: 1, text: 'Marinate seafood' },
                    { step: 2, text: 'Grill each item perfectly' },
                    { step: 3, text: 'Prepare accompaniments' },
                    { step: 4, text: 'Plate with garnishes' }
                ],
                cookingTime: 45,
                difficulty: 'hard',
                category: 'Main Course',
                cuisine: 'International',
                image: '/images/seafood-platter.jpg',
                author: admin._id
            },
            {
                title: 'Flambéed Scallops',
                description: 'Perfectly seared scallops with a dramatic flambé finish, served with seasonal vegetables',
                ingredients: [
                    { name: 'Large Scallops', amount: '6', unit: 'pieces' },
                    { name: 'Butter', amount: '50', unit: 'g' },
                    { name: 'Cognac', amount: '30', unit: 'ml' },
                    { name: 'Micro Greens', amount: '20', unit: 'g' }
                ],
                instructions: [
                    { step: 1, text: 'Pat scallops dry thoroughly' },
                    { step: 2, text: 'Sear in very hot pan' },
                    { step: 3, text: 'Add cognac and flambé' },
                    { step: 4, text: 'Plate with garnishes' }
                ],
                cookingTime: 20,
                difficulty: 'expert',
                category: 'Main Course',
                cuisine: 'French',
                image: '/images/flambeed-scallops.jpg',
                author: admin._id
            }
        ];

        await Recipe.insertMany(recipes);
        console.log('Sample recipes created successfully');
    } catch (error) {
        console.error('Error creating sample recipes:', error);
    }
};

const initializeDatabase = async () => {
    try {
        await mongoose.connect(config.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        const admin = await createAdminUser();
        await createSampleRecipes(admin);

        console.log('Database initialization completed');
        process.exit();
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
};

initializeDatabase();

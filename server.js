const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Basic memory storage for development
const users = [
    {
        id: 1,
        name: 'Admin User',
        email: 'katiq376@gmail.com',
        password: '11223344',
        role: 'admin'
    }
];

const recipes = [];

// Simple auth middleware
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        res.json({ success: true, user: { ...user, password: undefined } });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    const newUser = {
        id: users.length + 1,
        name,
        email,
        password,
        role: 'user'
    };
    users.push(newUser);
    res.json({ success: true, user: { ...newUser, password: undefined } });
});

// Recipe routes
app.get('/api/recipes', (req, res) => {
    res.json(recipes);
});

app.post('/api/recipes', (req, res) => {
    const newRecipe = {
        id: recipes.length + 1,
        ...req.body,
        createdAt: new Date()
    };
    recipes.push(newRecipe);
    res.json(newRecipe);
});

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Handle 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Function to find available port
const findAvailablePort = async (startPort) => {
    const net = require('net');
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        server.unref();
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(findAvailablePort(startPort + 1));
            } else {
                reject(err);
            }
        });
        server.listen(startPort, () => {
            server.close(() => {
                resolve(startPort);
            });
        });
    });
};

// Start server with dynamic port
const startServer = async () => {
    try {
        const port = await findAvailablePort(5000);
        app.listen(port, () => {
            console.log('----------------------------------------');
            console.log(`🚀 Server is running on port ${port}`);
            console.log(`📱 Open your browser and visit: http://localhost:${port}`);
            console.log('----------------------------------------');
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();

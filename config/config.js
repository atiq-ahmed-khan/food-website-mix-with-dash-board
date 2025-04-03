require('dotenv').config();

module.exports = {
    // Server Configuration
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // Database Configuration
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/food-fun',
    
    // JWT Configuration
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    JWT_EXPIRE: '7d',
    
    // Email Configuration
    EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail',
    EMAIL_USERNAME: process.env.EMAIL_USER || 'katiq376@gmail.com',
    EMAIL_PASSWORD: process.env.EMAIL_PASS,
    
    // File Upload Configuration
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
    
    // Admin Configuration
    ADMIN_EMAIL: 'katiq376@gmail.com',
    ADMIN_PASSWORD: '11223344',
    
    // API Configuration
    API_URL: process.env.API_URL || 'http://localhost:5000',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5000',
    
    // Cache Configuration
    CACHE_TTL: 60 * 60 * 1000, // 1 hour
    
    // Security Configuration
    BCRYPT_SALT_ROUNDS: 10,
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
    
    // Pagination Configuration
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100
};

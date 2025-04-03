# Atiq Ahmed Food Fun

A modern food recipe sharing platform built with Node.js, Express, MongoDB, and Material Design Lite.

## Features

- User authentication (login/register)
- Recipe management (create, read, update, delete)
- Recipe rating and commenting system
- Admin dashboard
- Responsive design
- Image upload functionality
- Search and filtering
- User profiles

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd food-website
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/food-fun
JWT_SECRET=your_jwt_secret_key_here
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
NODE_ENV=development
PORT=5000
```

4. Create required directories:
```bash
mkdir -p public/uploads/recipes
```

5. Start the development server:
```bash
npm run dev
```

## Admin Account

Default admin credentials:
- Email: katiq376@gmail.com
- Password: 11223344

## Directory Structure

```
food-website/
├── models/
│   ├── User.js
│   ├── Recipe.js
│   └── Comment.js
├── routes/
│   ├── auth.js
│   ├── recipes.js
│   └── comments.js
├── middleware/
│   └── auth.js
├── public/
│   ├── uploads/
│   └── images/
├── css/
│   ├── style.css
│   └── admin-style.css
├── server.js
├── package.json
└── .env
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Recipes
- GET /api/recipes - Get all recipes
- GET /api/recipes/:id - Get single recipe
- POST /api/recipes - Create recipe
- PUT /api/recipes/:id - Update recipe
- DELETE /api/recipes/:id - Delete recipe
- POST /api/recipes/:id/rate - Rate recipe

### Users
- GET /api/users - Get all users (admin only)
- GET /api/users/:id - Get user profile
- PUT /api/users/:id - Update user profile
- DELETE /api/users/:id - Delete user (admin only)

## Security Features

- JWT authentication
- Password hashing
- Input validation
- File upload validation
- XSS protection
- CSRF protection
- Rate limiting

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email katiq376@gmail.com

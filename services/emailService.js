const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
    service: config.EMAIL_SERVICE,
    auth: {
        user: config.EMAIL_USERNAME,
        pass: config.EMAIL_PASSWORD
    }
});

class EmailService {
    static async sendWelcomeEmail(user) {
        try {
            await transporter.sendMail({
                from: config.EMAIL_USERNAME,
                to: user.email,
                subject: 'Welcome to Atiq Ahmed Food Fun!',
                html: `
                    <h1>Welcome to Atiq Ahmed Food Fun!</h1>
                    <p>Dear ${user.name},</p>
                    <p>Thank you for joining our community! We're excited to have you on board.</p>
                    <p>Start exploring delicious recipes and sharing your culinary creations with our community.</p>
                    <p>Best regards,<br>The Atiq Ahmed Food Fun Team</p>
                `
            });
        } catch (error) {
            console.error('Error sending welcome email:', error);
        }
    }

    static async sendPasswordResetEmail(user, resetToken) {
        try {
            const resetUrl = `${config.CLIENT_URL}/reset-password/${resetToken}`;
            
            await transporter.sendMail({
                from: config.EMAIL_USERNAME,
                to: user.email,
                subject: 'Password Reset Request',
                html: `
                    <h1>Password Reset Request</h1>
                    <p>Dear ${user.name},</p>
                    <p>You requested to reset your password. Click the link below to reset it:</p>
                    <a href="${resetUrl}">Reset Password</a>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <p>Best regards,<br>The Atiq Ahmed Food Fun Team</p>
                `
            });
        } catch (error) {
            console.error('Error sending password reset email:', error);
        }
    }

    static async sendNewRecipeNotification(recipe, subscribers) {
        try {
            const emailPromises = subscribers.map(subscriber => {
                return transporter.sendMail({
                    from: config.EMAIL_USERNAME,
                    to: subscriber.email,
                    subject: 'New Recipe Alert!',
                    html: `
                        <h1>New Recipe: ${recipe.title}</h1>
                        <p>Dear ${subscriber.name},</p>
                        <p>A new recipe has been added that you might enjoy!</p>
                        <h2>${recipe.title}</h2>
                        <p>${recipe.description}</p>
                        <a href="${config.CLIENT_URL}/recipes/${recipe._id}">View Recipe</a>
                        <p>Happy cooking!<br>The Atiq Ahmed Food Fun Team</p>
                    `
                });
            });

            await Promise.all(emailPromises);
        } catch (error) {
            console.error('Error sending new recipe notifications:', error);
        }
    }

    static async sendCommentNotification(recipe, comment) {
        try {
            await transporter.sendMail({
                from: config.EMAIL_USERNAME,
                to: recipe.author.email,
                subject: 'New Comment on Your Recipe',
                html: `
                    <h1>New Comment on ${recipe.title}</h1>
                    <p>Dear ${recipe.author.name},</p>
                    <p>Someone commented on your recipe "${recipe.title}":</p>
                    <p><strong>${comment.author.name}:</strong> ${comment.content}</p>
                    <a href="${config.CLIENT_URL}/recipes/${recipe._id}">View Comment</a>
                    <p>Best regards,<br>The Atiq Ahmed Food Fun Team</p>
                `
            });
        } catch (error) {
            console.error('Error sending comment notification:', error);
        }
    }
}

module.exports = EmailService;

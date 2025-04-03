const sharp = require('sharp');
const path = require('path');

const optimizeImage = async (req, res, next) => {
    if (!req.file) return next();

    try {
        const optimizedImage = await sharp(req.file.buffer)
            .resize(800, 600, { // Standard size for recipe images
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({ quality: 85, progressive: true }) // Good balance of quality and size
            .toBuffer();

        req.file.buffer = optimizedImage;
        next();
    } catch (error) {
        next(error);
    }
};

const createThumbnail = async (req, res, next) => {
    if (!req.file) return next();

    try {
        const thumbnail = await sharp(req.file.buffer)
            .resize(300, 200, { // Thumbnail size
                fit: 'cover',
                position: 'center'
            })
            .jpeg({ quality: 70 })
            .toBuffer();

        req.thumbnail = thumbnail;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { optimizeImage, createThumbnail };

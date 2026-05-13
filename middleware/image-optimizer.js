const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { env } = require('process');

module.exports = (req, res, next) => {
  if (!req.file) return next(); // pas de fichier à traiter

  const inputPath = req.file.path;
  const outputFilename = req.file.filename.replace(/\.[^.]+$/, '.webp');
  const outputPath = path.join('images', outputFilename);

  sharp(inputPath)
    .resize(env.IMAGE_MAX_WIDTH || 463, env.IMAGE_MAX_HEIGHT || 595, { fit: 'inside', withoutEnlargement: true }) 
    .webp({ quality: env.IMAGE_QUALITY || 80 }) // qualité de compression   
    .toFile(outputPath)
    .then(() => {
        fs.unlink(inputPath, () => {}); // supprimer le fichier original
        req.file.filename = outputFilename; // mettre à jour le nom pour le contrôleur
        req.file.path = outputPath;
        next();
    })
    .catch(error => {
        error.source = 'sharp';
        next(error);
    });
};
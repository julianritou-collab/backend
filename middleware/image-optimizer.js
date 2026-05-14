const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { env } = require('process');

module.exports = (req, res, next) => {
    if (!req.file) return next(); // pas de fichier à traiter

    const inputPath = req.file.path;
    const outputFilename = req.file.filename.replace(/_tmp\.[^.]+$/, '.webp');
    const outputPath = path.join('images', outputFilename);

    // Lire en mémoire d'abord
    fs.readFile(inputPath, (err, buffer) => {
        if (err) {
            err.source = 'fs.readFile';
            return next(err);
        }
        // Supprimer le fichier tmp immédiatement pour éviter d'encombrer le serveur, même en cas d'erreur Sharp
        fs.unlink(inputPath, () => {});

        sharp(buffer)
            .rotate() // corriger l'orientation selon les métadonnées EXIF
            .resize(env.IMAGE_MAX_WIDTH || 463, env.IMAGE_MAX_HEIGHT || 595, { fit: 'inside', withoutEnlargement: true }) 
            .webp({ quality: env.IMAGE_QUALITY || 80 }) // qualité de compression   
            .toFile(outputPath)
            .then(() => {      
                req.file.filename = outputFilename; // mettre à jour le nom pour le contrôleur
                req.file.path = outputPath;
                next();
            })
            .catch(error => {
                error.source = 'sharp';
                next(error);
            });
    })
};
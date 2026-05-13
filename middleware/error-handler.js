module.exports = (err, req, res, next) => {
  if (err.message === "Format d'image non supporté") {
    return res.status(415).json({ error: err.message });
  }
  if (err.source === 'sharp') {
    return res.status(422).json({ error: 'Erreur Sharp lors de l\'optimisation de l\'image' });
  }
  res.status(500).json({ error: 'Erreur serveur' });
};
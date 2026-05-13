module.exports = (err, req, res, next) => {
  if (err.message === "Format d'image non supporté") {
    return res.status(415).json({ error: err.message });
  }
  res.status(500).json({ error: 'Erreur serveur' });
};
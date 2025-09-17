export const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} introuvable` });
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  const message = err.message || 'Erreur interne du serveur';
  res.status(status).json({ success: false, message });
};

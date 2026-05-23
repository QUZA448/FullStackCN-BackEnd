const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.errors.map(e => ({ field: e.path, message: e.message }))
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      message: 'Resource already exists',
      errors: err.errors.map(e => ({ field: e.path, message: `${e.path} already exists` }))
    });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal server error'
  });
};

module.exports = errorHandler;

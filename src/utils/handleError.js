exports.handleError = (res, e, message) => {
  let statusCode = e.code === 11000 ? 400 : 500;
  return res.status(statusCode).json({
    success: false,
    message,
    errors: [{ msg: e.message }],
  });
};

const errorHandlerMiddleware = (err, req, res, next) => {
  const defaultError = {
    statusCode: err.statusCode || 500,
    msg: err.message || "Something went wrong, try again later",
  };

  if (err.name === "ValidationError") {
    defaultError.statusCode = 400;
    defaultError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
  }
  if (err.code && err.code === 11000) {
    defaultError.statusCode = 400;
    defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`;
  }
  //multer error for more than 5 file upload
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    defaultError.msg = `Please upload only 10 images`;
    defaultError.statusCode = 400;
  }
  //multer error for file size
  if (err.code === "LIMIT_FILE_SIZE") {
    defaultError.msg = `File size is too large, please select image less than 3.5MB`;
    defaultError.statusCode = 400;
  }
  res.status(defaultError.statusCode).json({ msg: defaultError.msg });
};

export default errorHandlerMiddleware;

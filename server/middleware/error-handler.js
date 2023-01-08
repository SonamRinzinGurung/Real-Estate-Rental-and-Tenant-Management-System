const errorHandlerMiddleware = (err, req, res, next) => {
  const defaultError = {
    statusCode: err.statusCode || 500,
    msg: err.message || "Something went wrong, try again later",
  };

  //validation error from mongoose for required fields
  if (err.name === "ValidationError") {
    defaultError.statusCode = 400;
    defaultError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
  }

  //validation error from mongoose for unique fields
  if (err.code && err.code === 11000) {
    defaultError.statusCode = 400;
    defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`;
  }

  //cast error in job id
  if (err.name === "CastError") {
    defaultError.msg = `No item found with id ${err.value}`;
    defaultError.statusCode = 404;
  }

  //multer error for more than 10 file upload
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

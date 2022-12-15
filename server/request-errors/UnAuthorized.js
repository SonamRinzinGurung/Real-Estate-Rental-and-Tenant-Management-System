import { CustomError } from "./custom-error.js";

class UnAuthorizedError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

export default UnAuthorizedError;

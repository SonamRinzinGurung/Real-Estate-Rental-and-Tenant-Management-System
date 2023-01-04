import { CustomError } from "./custom-error.js";

class ForbiddenRequestError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

export default ForbiddenRequestError;

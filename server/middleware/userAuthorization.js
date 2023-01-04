import jwt from "jsonwebtoken";
import {
  ForbiddenRequestError,
  UnAuthorizedError,
} from "../request-errors/index.js";

// Authenticate Owner User using JWT Token and add userId to req.user object for further use
const authorizeOwnerUser = async (req, res, next) => {
  const authHeader = req.headers.authorization; // Get Authorization Header from request

  // If Authorization Header is not present or does not start with Bearer
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnAuthorizedError("User is not Authorized"); // Throw UnAuthorizedError
  }

  const token = authHeader.split(" ")[1]; // Get JWT Token from Authorization Header
  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_OWNER); // Verify JWT Token
    req.user = { userId: payload.userId }; // Add userId to req.user object
    next(); // Call next middleware
  } catch (error) {
    throw new UnAuthorizedError("Access Token is not valid");
  }
};

// Authenticate Tenant User using JWT Token and add userId to req.user object for further use
const authorizeTenantUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnAuthorizedError("User is not Authorized");
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_TENANT);
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    throw new UnAuthorizedError("Access Token is not valid");
  }
};

export { authorizeOwnerUser, authorizeTenantUser };

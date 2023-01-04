import OwnerUser from "../models/OwnerUser.js";
import TenantUser from "../models/TenantUser.js";
import {
  BadRequestError,
  ForbiddenRequestError,
  UnAuthorizedError,
} from "../request-errors/index.js";
import { isEmailValid } from "../utils/validateEmail.js";
import jwt from "jsonwebtoken";

/**
 * @description Login a user
 * @route POST /auth/login
 * @returns {object} user
 * @returns {string} token
 */
const login = async (req, res) => {
  const { role, email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Provide email and password");
  }
  if (role === "owner") {
    const owner = await OwnerUser.findOne({ email }).select("+password");
    if (!owner) {
      throw new UnAuthorizedError("Email not found!");
    }
    const isMatch = await owner.matchPassword(password);
    if (!isMatch) {
      throw new UnAuthorizedError("Incorrect Password!");
    }
    const accessToken = owner.createAccessToken();
    const refreshToken = owner.createRefreshToken();

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match refresh token expiry
    });
    owner.password = undefined;
    res.status(200).json({ owner, accessToken, userType: "owner" });
  } else if (role === "tenant") {
    const tenant = await TenantUser.findOne({ email }).select("+password");
    if (!tenant) {
      throw new UnAuthorizedError("Email not found!");
    }
    const isMatch = await tenant.matchPassword(password);
    if (!isMatch) {
      throw new UnAuthorizedError("Incorrect Password!");
    }
    const accessToken = tenant.createAccessToken();
    const refreshToken = tenant.createRefreshToken();

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match refresh token expiry
    });
    tenant.password = undefined;
    res.status(200).json({ tenant, accessToken, userType: "tenant" });
  } else {
    throw new BadRequestError("Invalid Role");
  }
};

/**
 * @description Register a user
 * @route POST /auth/register
 * @returns {object} user
 * @returns {string} token
 */
const register = async (req, res) => {
  const { role, email } = req.body;
  const { valid, reason, validators } = await isEmailValid(email);
  if (!valid) {
    throw new BadRequestError(validators[reason].reason);
  }
  if (role === "owner") {
    const owner = await OwnerUser.create(req.body);

    const accessToken = owner.createAccessToken();
    const refreshToken = owner.createRefreshToken();

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match refresh token expiry
    });
    owner.password = undefined;
    res.status(201).json({ owner, accessToken, userType: "owner" });
  } else if (role === "tenant") {
    const tenant = await TenantUser.create(req.body);

    const accessToken = tenant.createAccessToken();
    const refreshToken = tenant.createRefreshToken();

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match refresh token expiry
    });
    tenant.password = undefined;

    res.status(201).json({ tenant, accessToken, userType: "tenant" });
  } else {
    throw new BadRequestError("Invalid Role");
  }
};

/**
 * @description generate new access token
 * @route POST /auth/refresh
 * @returns {string} access token
 */
const refreshOwner = async (req, res) => {
  const cookie = req.cookies;

  if (!cookie?.jwt) {
    throw new UnAuthorizedError("Refresh token not found");
  }

  const refreshToken = cookie.jwt;
  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_OWNER
    );

    const user = await OwnerUser.findOne({ _id: payload.userId });

    if (!user) {
      throw new UnAuthorizedError("User not found");
    }
    const accessToken = user.createAccessToken();
    res.json({ accessToken });
  } catch (error) {
    throw new UnAuthorizedError("Invalid refresh token");
  }
};

/**
 * @description generate new access token
 * @route POST /auth/refresh
 * @returns {string} access token
 */
const refreshTenant = async (req, res) => {
  const cookie = req.cookies;

  if (!cookie?.jwt) {
    throw new UnAuthorizedError("Refresh token not found");
  }

  const refreshToken = cookie.jwt;
  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_TENANT
    );

    const user = await TenantUser.findOne({ _id: payload.userId });

    if (!user) {
      throw new UnAuthorizedError("User not found");
    }
    const accessToken = user.createAccessToken();
    res.json({ accessToken });
  } catch (error) {
    throw new UnAuthorizedError("Invalid refresh token");
  }
};

/**
 * @description Logout a user
 * @route POST /auth/logout
 */
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204); //No content
  }
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

export { login, register, refreshOwner, refreshTenant, logout };

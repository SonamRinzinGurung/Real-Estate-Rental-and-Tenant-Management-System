import OwnerUser from "../models/OwnerUser.js";
import TenantUser from "../models/TenantUser.js";
import { BadRequestError, UnAuthorizedError } from "../request-errors/index.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/emailSender.js";

/**
 * @description Login a user
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

    // check if account's email is verified
    if (!owner.accountStatus) {
      return res.status(200).json({
        message: "Account not verified",
        email: owner.email,
        accountStatus: owner.accountStatus,
        userType: "owner",
      });
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
    res.status(200).json({
      owner,
      accessToken,
      userType: "owner",
      accountStatus: owner.accountStatus,
    });
  } else if (role === "tenant") {
    const tenant = await TenantUser.findOne({ email }).select("+password");
    if (!tenant) {
      throw new UnAuthorizedError("Email not found!");
    }
    const isMatch = await tenant.matchPassword(password);
    if (!isMatch) {
      throw new UnAuthorizedError("Incorrect Password!");
    }

    // check if account's email is verified
    if (!tenant.accountStatus) {
      return res.status(200).json({
        message: "Account not verified",
        email: tenant.email,
        accountStatus: tenant.accountStatus,
        userType: "tenant",
      });
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
    res.status(200).json({
      tenant,
      accessToken,
      userType: "tenant",
      accountStatus: tenant.accountStatus,
    });
  } else {
    throw new BadRequestError("Invalid Role");
  }
};

/**
 * @description Register a user
 * @returns {object} user
 * @returns {string} token
 */
const register = async (req, res) => {
  const { role, email } = req.body;

  if (role === "owner") {
    //generate token
    const verificationToken = jwt.sign(
      { email: email },
      process.env.EMAIL_VERIFICATION_KEY,
      {
        expiresIn: "1d",
      }
    );

    // add token to req.body
    req.body.accountVerificationToken = verificationToken;

    // create owner
    const owner = await OwnerUser.create(req.body);

    // remove password and token from response object
    owner.password = undefined;
    owner.accountVerificationToken = undefined;

    // send email with token link
    const to = email;
    const from = process.env.EMAIL_USER;
    const subject = "Email Verification Link";
    const body = `
    <p> Hello ${owner.firstName} ${owner.lastName},</p>
    <p>Please click on the link below to verify your account on Property Plus</p>
    <a href="${process.env.CLIENT_URL}/verify-account/owner/${verificationToken}">Verify Account</a>
    <p>Regards,</p>
    <p>Team Property Plus</p>
    `;
    await sendEmail(to, from, subject, body);

    res
      .status(201)
      .json({ success: true, userType: "owner", email: owner.email });
  } else if (role === "tenant") {
    //generate token
    const verificationToken = jwt.sign(
      { email: email },
      process.env.EMAIL_VERIFICATION_KEY,
      {
        expiresIn: "1d",
      }
    );

    // add token to req.body
    req.body.accountVerificationToken = verificationToken;

    const tenant = await TenantUser.create(req.body); // create tenant

    // remove password and token from response object
    tenant.password = undefined;
    tenant.accountVerificationToken = undefined;

    // send email with token link
    const to = email;
    const from = process.env.EMAIL_USER;
    const subject = "Email Verification Link";
    const body = `
    <p> Hello ${tenant.firstName} ${tenant.lastName},</p>
    <p>Please click on the link below to verify your account on Property Plus</p>
    <a href="${process.env.CLIENT_URL}/verify-account/tenant/${verificationToken}">Verify Account</a>
    <p>Regards,</p>
    <p>Team Property Plus</p>
    `;
    await sendEmail(to, from, subject, body);

    res
      .status(201)
      .json({ success: true, userType: "tenant", email: tenant.email });
  } else {
    throw new BadRequestError("Invalid Role");
  }
};

/**
 * @description Verify user account
 */
const verifyAccount = (req, res) => {
  const { role, token } = req.body;

  if (!token) {
    throw new BadRequestError("Token not found");
  }
  if (role === "owner") {
    //verify token
    jwt.verify(
      token,
      process.env.EMAIL_VERIFICATION_KEY,
      async (error, payload) => {
        if (error) {
          return res.status(400).json({ msg: "Invalid or expired token" });
        }
        //find user with token and email
        const user = await OwnerUser.findOne({
          accountVerificationToken: token,
          email: payload.email,
        });
        if (!user) {
          return res
            .status(400)
            .json({ msg: "User with this token was not found" });
        }

        // update user account status
        user.accountStatus = true;
        user.accountVerificationToken = "";

        user.save((err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ msg: "Error occurred while updating user status" });
          } else {
            return res.json({ msg: "User successfully verified" });
          }
        });
      }
    );
  } else if (role === "tenant") {
    //verify token
    jwt.verify(
      token,
      process.env.EMAIL_VERIFICATION_KEY,
      async (error, payload) => {
        if (error) {
          return res.status(400).json({ msg: "Invalid or expired token" });
        }
        //find user with token and email
        const user = await TenantUser.findOne({
          accountVerificationToken: token,
          email: payload.email,
        });
        if (!user) {
          return res
            .status(400)
            .json({ msg: "User with this token was not found" });
        }

        // update user account status
        user.accountStatus = true;
        user.accountVerificationToken = "";

        user.save((err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ msg: "Error occurred while updating user status" });
          } else {
            return res.json({ msg: "User successfully verified" });
          }
        });
      }
    );
  } else {
    throw new BadRequestError("Invalid Role");
  }
};

/**
 * @description Resend the verification email
 */
const resendVerificationEmail = async (req, res) => {
  const { email, role } = req.body;

  if (role === "owner") {
    //generate token
    const verificationToken = jwt.sign(
      { email: email },
      process.env.EMAIL_VERIFICATION_KEY,
      {
        expiresIn: "1d",
      }
    );

    // find user with email
    const owner = await OwnerUser.findOne({ email: email });

    if (!owner) {
      throw new BadRequestError("User not found");
    }

    // update the token in db
    owner.accountVerificationToken = verificationToken;
    await owner.save();

    // send email with token code
    const to = email;
    const from = process.env.EMAIL_USER;
    const subject = "Email Verification Link";
    const body = `
    <p> Hello ${owner.firstName} ${owner.lastName},</p>
    <p>Please click on the link below to verify your account on Property Plus</p>
    <a href="${process.env.CLIENT_URL}/verify-account/owner/${verificationToken}">Verify Account</a>
    <p>Regards,</p>
    <p>Team Property Plus</p>
    `;

    // send email with token link
    await sendEmail(to, from, subject, body);

    res
      .status(200)
      .json({ success: true, msg: "Token reset and sent successfully" });
  } else if (role === "tenant") {
    //generate token
    const verificationToken = jwt.sign(
      { email: email },
      process.env.EMAIL_VERIFICATION_KEY,
      {
        expiresIn: "1d",
      }
    );

    const tenant = await TenantUser.findOne({ email: email });

    if (!tenant) {
      throw new BadRequestError("User not found");
    }

    // update the token in db
    tenant.accountVerificationToken = verificationToken;
    await tenant.save();

    // send email with token code
    const to = email;
    const from = process.env.EMAIL_USER;
    const subject = "Email Verification Link";
    const body = `
    <p> Hello ${tenant.firstName} ${tenant.lastName},</p>
    <p>Please click on the link below to verify your account on Property Plus</p>
    <a href="${process.env.CLIENT_URL}/verify-account/tenant/${verificationToken}">Verify Account</a>
    <p>Regards,</p>
    <p>Team Property Plus</p>
    `;
    await sendEmail(to, from, subject, body);

    res
      .status(200)
      .json({ success: true, msg: "Token reset and sent successfully" });
  } else {
    throw new BadRequestError("Invalid Role");
  }
};

/**
 * @description generate new access token
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
 * @description Forgot Password - send email
 * @route POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res) => {
  const { email, role } = req.body;

  if (role === "owner") {
    const user = await OwnerUser.findOne({ email }); //check if user exists
    if (!user) {
      throw new BadRequestError("User with this email was not found");
    }

    //generate token
    const token = jwt.sign({ _id: user._id }, process.env.RESET_PASSWORD_KEY, {
      expiresIn: "5m",
    });

    // send email with token
    const to = email;
    const from = process.env.EMAIL_USER;
    const subject = "Reset Account Password Link";
    const body = `
  <h3>Please click the link below to reset your password</h3>
  <a href="${process.env.CLIENT_URL}/reset-password/owner/${token}">Reset Password</a>`;

    //update the user and add the token
    user.passwordResetToken = token;
    user.save(async (err, result) => {
      if (err) {
        return res
          .status(400)
          .json({ msg: "Error occurred while saving the token in database" });
      } else {
        //if no error
        //send email
        await sendEmail(to, from, subject, body);
        return res.json({ msg: `Token has been sent to ${email}` });
      }
    });
  } else if (role === "tenant") {
    const user = await TenantUser.findOne({ email });
    if (!user) {
      throw new BadRequestError("User with this email was not found");
    }

    const token = jwt.sign({ _id: user._id }, process.env.RESET_PASSWORD_KEY, {
      expiresIn: "5m",
    });

    const to = email;
    const from = process.env.EMAIL_USER;
    const subject = "Reset Account Password Link";
    const body = `
  <h3>Please click the link below to reset your password</h3>
  <a href="${process.env.CLIENT_URL}/reset-password/tenant/${token}">Reset Password</a>`;

    //update the user and add the token
    user.passwordResetToken = token;
    user.save(async (err, result) => {
      if (err) {
        return res
          .status(400)
          .json({ msg: "Error occurred while saving the token in database" });
      } else {
        //if no error
        //send email
        await sendEmail(to, from, subject, body);
        return res.json({ msg: `Token has been sent to ${email}` });
      }
    });
  } else {
    throw new BadRequestError("Invalid Role");
  }
};

/**
 * @description Reset Password
 * @route POST /api/auth/reset-password
 */
const resetPassword = async (req, res) => {
  const { token, newPassword, passwordRepeated, role } = req.body;
  if (!token) {
    throw new BadRequestError("Token not found");
  }
  if (!newPassword || !passwordRepeated) {
    throw new BadRequestError("Password is required");
  }

  if (newPassword !== passwordRepeated) {
    throw new BadRequestError("Passwords do not match");
  }

  if (role === "owner") {
    //verify token
    jwt.verify(
      token,
      process.env.RESET_PASSWORD_KEY,
      async (error, payload) => {
        if (error) {
          return res.status(400).json({ msg: "Invalid or expired token" });
        }
        //find user with token
        const user = await OwnerUser.findOne({ passwordResetToken: token });
        if (!user) {
          return res
            .status(400)
            .json({ msg: "User with this token was not found" });
        }

        //update password
        user.password = newPassword;
        user.passwordResetToken = "";
        user.save((err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ msg: "Error occurred while resetting password" });
          } else {
            return res.json({ msg: "Password successfully changed" });
          }
        });
      }
    );
  } else if (role === "tenant") {
    jwt.verify(
      token,
      process.env.RESET_PASSWORD_KEY,
      async (error, payload) => {
        if (error) {
          return res.status(400).json({ msg: "Invalid or expired token" });
        }
        const user = await TenantUser.findOne({ passwordResetToken: token });
        if (!user) {
          return res
            .status(400)
            .json({ msg: "User with this token was not found" });
        }

        user.password = newPassword;
        user.passwordResetToken = "";
        user.save((err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ msg: "Error occurred while resetting password" });
          } else {
            return res.json({ msg: "Password successfully changed" });
          }
        });
      }
    );
  } else {
    throw new BadRequestError("Invalid Role");
  }
};

/**
 * @description Logout a user
 */
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204); //No content
  }
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

export {
  login,
  register,
  verifyAccount,
  refreshOwner,
  refreshTenant,
  forgotPassword,
  resetPassword,
  logout,
  resendVerificationEmail,
};

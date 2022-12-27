import OwnerUser from "../models/OwnerUser.js";
import TenantUser from "../models/TenantUser.js";
import { BadRequestError, UnAuthorizedError } from "../request-errors/index.js";
import { isEmailValid } from "../utils/validateEmail.js";

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
    const token = owner.createJWT();
    owner.password = undefined;
    res.status(200).json({ owner, token });
  } else if (role === "tenant") {
    const tenant = await TenantUser.findOne({ email }).select("+password");
    if (!tenant) {
      throw new UnAuthorizedError("Email not found!");
    }
    const isMatch = await tenant.matchPassword(password);
    if (!isMatch) {
      throw new UnAuthorizedError("Incorrect Password!");
    }
    const token = tenant.createJWT();
    tenant.password = undefined;
    res.status(200).json({ tenant, token });
  } else {
    throw new BadRequestError("Invalid Role");
  }
};

const register = async (req, res) => {
  const { role, email } = req.body;
  const { valid, reason, validators } = await isEmailValid(email);
  if (!valid) {
    throw new BadRequestError(validators[reason].reason);
  }
  if (role === "owner") {
    const owner = await OwnerUser.create(req.body);
    owner.password = undefined;
    const token = owner.createJWT();
    res.status(201).json({ owner, token });
  } else if (role === "tenant") {
    const tenant = await TenantUser.create(req.body);
    tenant.password = undefined;
    const token = tenant.createJWT();

    res.status(201).json({ tenant, token });
  } else {
    throw new BadRequestError("Invalid Role");
  }
};

export { login, register };

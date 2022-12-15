import OwnerUser from "../models/OwnerUser.js";
import TenantUser from "../models/TenantUser.js";
import { BadRequestError, UnAuthorizedError } from "../request-errors/index.js";

const login = async (req, res) => {
  const { role, email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Provide email and password");
  }
  if (role === "owner") {
    const owner = await OwnerUser.findOne({ email }).select("+password");
    if (!owner) {
      throw new UnAuthorizedError("Invalid Email");
    }
    const isMatch = await owner.matchPassword(password);
    if (!isMatch) {
      throw new UnAuthorizedError("Invalid Credentials");
    }
    owner.password = undefined;
    res.status(200).json({ owner });
  } else if (role === "tenant") {
    const tenant = await TenantUser.findOne({ email }).select("+password");
    if (!tenant) {
      throw new UnAuthorizedError("Invalid Email");
    }
    const isMatch = await tenant.matchPassword(password);
    if (!isMatch) {
      throw new UnAuthorizedError("Invalid Credentials");
    }
    tenant.password = undefined;
    res.status(200).json({ tenant });
  } else {
    throw new BadRequestError("Invalid Role");
  }
};

const register = async (req, res) => {
  const { role } = req.body;
  if (role === "owner") {
    const owner = await OwnerUser.create(req.body);
    owner.password = undefined;
    res.status(201).json({ owner });
  } else if (role === "tenant") {
    const tenant = await TenantUser.create(req.body);
    tenant.password = undefined;
    res.status(201).json({ tenant });
  } else {
    throw new BadRequestError("Invalid Role");
  }
};

export { login, register };

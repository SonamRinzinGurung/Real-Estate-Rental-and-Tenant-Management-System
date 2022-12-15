import OwnerUser from "../models/OwnerUser.js";
import TenantUser from "../models/TenantUser.js";

const login = async (req, res) => {
  const { role } = req.body;
  if (role === "owner") {
    const owner = await OwnerUser.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!owner) {
      res.status(404).json({ message: "User not found" });
    }
    const isMatch = await owner.matchPassword(req.body.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid password" });
    }
    owner.password = undefined;
    res.status(200).json({ owner });
  } else if (role === "tenant") {
    const tenant = await TenantUser.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!tenant) {
      res.status(404).json({ message: "User not found" });
    }
    const isMatch = await tenant.matchPassword(req.body.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid password" });
    }
    tenant.password = undefined;
    res.status(200).json({ tenant });
  } else {
    res.status(400).json({ message: "Invalid role" });
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
    res.status(400).json({ message: "Invalid role" });
  }
};

export { login, register };

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const TenantUserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide a first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide a last name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Please provide an address"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please provide a phone number"],
      unique: true,
    },
    age: {
      type: String,
      required: [true, "Please provide an age"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not supported",
      },
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 5,
      select: false,
    },
  },
  { timestamps: true }
);

TenantUserSchema.pre("save", async function () {
  if (!this.isModified("password")) return; //avoid re-hashing of password

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

TenantUserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

TenantUserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

export default mongoose.model("TenantUser", TenantUserSchema);

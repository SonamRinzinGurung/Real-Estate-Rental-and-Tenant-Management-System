import mongoose from "mongoose";

const TenantUserSchema = new mongoose.Schema({
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
});

export default mongoose.model("TenantUser", TenantUserSchema);

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import slug from "mongoose-slug-generator";
mongoose.plugin(slug);

const TenantUserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide a first name"],
      maxLength: 20,
    },
    lastName: {
      type: String,
      required: [true, "Please provide a last name"],
      maxLength: 20,
    },
    slug: {
      type: String,
      slug: ["firstName", "lastName"],
      slug_padding_size: 4,
      unique: true,
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
    dateOfBirth: {
      type: String,
      required: [true, "Please provide a date of birth"],
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Other"],
        message: "{VALUE} is not supported",
      },
    },
    profileImage: {
      type: String,
      required: [true, "Please provide a profile image"],
    },
    contacts: [
      {
        type: mongoose.Types.ObjectId,
        ref: "OwnerUser",
        default: [],
      },
    ],
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 5,
      select: false,
    },
    savedProperties: [
      {
        type: mongoose.Types.ObjectId,
        ref: "RealEstate",
        default: [],
      },
    ],
    passwordResetToken: {
      type: String,
      select: false,
    },
    accountStatus: {
      type: Boolean,
      default: false,
    },
    accountVerificationToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving to database
TenantUserSchema.pre("save", async function () {
  if (!this.isModified("password")) return; //avoid re-hashing of password

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password in database
TenantUserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// create JWT ACCESS token for tenant user authentication
TenantUserSchema.methods.createAccessToken = function () {
  // return JWT token with user id
  return jwt.sign(
    { userId: this._id, userType: "tenant" },
    process.env.ACCESS_TOKEN_SECRET_TENANT,
    {
      expiresIn: process.env.ACCESS_LIFETIME,
    }
  );
};

// create JWT Refresh token for tenant user authentication
TenantUserSchema.methods.createRefreshToken = function () {
  // return JWT token with user id
  return jwt.sign(
    { userId: this._id, userType: "tenant" },
    process.env.REFRESH_TOKEN_SECRET_TENANT,
    {
      expiresIn: process.env.REFRESH_LIFETIME,
    }
  );
};

export default mongoose.model("TenantUser", TenantUserSchema);

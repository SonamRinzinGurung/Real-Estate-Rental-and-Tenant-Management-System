import cloudinary from "cloudinary";
import { BadRequestError } from "../request-errors/index.js";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryProfileImageUpload = async (req, res, next) => {
  const file = req.file;
  if (!file) {
    throw new BadRequestError("Please upload an image.");
  }
  await cloudinary.v2.uploader.upload(
    file.path,
    {
      folder: "real-estate-system/profileImages",
      width: 500,
      height: 500,
      crop: "fill",
    },
    (err, result) => {
      if (err) {
        throw new BadRequestError("Error uploading image");
      }
      req.body.profileImage = result.secure_url;
    }
  );
  next();
};

export const cloudinaryMultipleUpload = async (req, res, next) => {
  const files = req.files;
  req.body.realEstateImages = [];
  if (!files) {
    throw new BadRequestError("Please upload at least one image.");
  }
  for (const file of files) {
    await cloudinary.v2.uploader.upload(
      file.path,
      {
        folder: "real-estate-system/realEstateImages",
      },
      (err, result) => {
        if (err) {
          throw new BadRequestError("Error uploading image");
        }
        req.body.realEstateImages.push(result.secure_url);
      }
    );
  }

  next();
};

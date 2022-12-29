import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: "ddr8aveca",
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

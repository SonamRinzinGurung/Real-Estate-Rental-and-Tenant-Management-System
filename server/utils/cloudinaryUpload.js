import cloudinary from "cloudinary";
import { BadRequestError } from "../request-errors/index.js";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinarySingleImageUpload = async (file, path) => {
    let imageUrl;
    if (!file) {
        throw new BadRequestError("Please upload an image.");
    }
    await cloudinary.v2.uploader.upload(
        file.path,
        {
            folder: "real-estate-system/" + path,
            width: 500,
            height: 500,
            crop: "fill",
        },
        (err, result) => {
            if (err) {
                throw new BadRequestError("Error uploading image");
            }
            imageUrl = result.secure_url;
        }
    );
    return imageUrl;
};

export const cloudinaryMultipleUpload = async (files, path) => {
    let imageUrls = [];
    if (!files || files.length === 0) {
        throw new BadRequestError("Please upload at least one image.");
    }
    for (const file of files) {
        await cloudinary.v2.uploader.upload(
            file.path,
            {
                folder: "real-estate-system/" + path,
            },
            (err, result) => {
                if (err) {
                    throw new BadRequestError("Error uploading image");
                }
                imageUrls.push(result.secure_url);
            }
        );
    }

    return imageUrls;
};

export const cloudinaryDeleteImage = async (publicId) => {
    await cloudinary.v2.uploader.destroy(publicId, { resource_type: "image" }, (err, result) => {
        if (err) {
            throw new BadRequestError("Error deleting image");
        }
    });
    return true;
}
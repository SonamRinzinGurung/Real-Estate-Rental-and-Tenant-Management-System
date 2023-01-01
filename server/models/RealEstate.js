import mongoose from "mongoose";

const RealEstateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for the property"],
      trim: true,
      maxLength: [100, "Title cannot be more than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price for the property"],
      min: [1000, "Price cannot be less than 1000"],
    },
    address: {
      location: {
        type: String,
        required: [true, "Please provide the location of the property"],
      },
      streetName: {
        type: String,
        required: [
          true,
          "Please provide a street name or landmark for the property",
        ],
      },
    },
    description: {
      type: String,
      required: [true, "Please provide a description for the property"],
      trim: true,
      maxLength: [3000, "Description cannot be more than 3000 characters"],
    },
    area: {
      type: Number,
      required: [true, "Please provide the area of the property"],
      min: [100, "Area cannot be less than 100"],
    },
    category: {
      type: String,
      enum: {
        values: ["House", "Apartment", "Room", "Shop Space", "Office Space"],
        message: "{VALUE} is not in the category list",
      },
    },
    googleIframe: {
      type: String,
    },

    rating: {
      type: Number,
      enum: {
        values: [1, 2, 3, 4, 5],
        message: "{VALUE} is not a valid rating",
      },
      default: null,
    },

    realEstateImages: [Object],

    propertyOwner: {
      type: mongoose.Types.ObjectId,
      ref: "OwnerUser",
      required: [true, "Please provide a property owner"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("RealEstate", RealEstateSchema);

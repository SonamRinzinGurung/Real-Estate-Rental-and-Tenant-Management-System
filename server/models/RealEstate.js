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
    },
    address: {
      location: {
        type: String,
        required: [true, "Please provide an address for the property"],
      },
      streetName: {
        type: String,
        required: [true, "Please provide a street name for the property"],
      },
    },
    description: {
      type: String,
      required: [true, "Please provide a description for the property"],
      trim: true,
      maxLength: [500, "Description cannot be more than 500 characters"],
    },
    category: {
      type: String,
      enum: {
        values: ["house", "apartment", "room", "shop", "office"],
        message: "{VALUE} is not in the category list",
      },
    },
    rating: {
      type: Number,
      enum: {
        values: [1, 2, 3, 4, 5],
        message: "{VALUE} is not a valid rating",
      },
      default: null,
    },

    // image: [Object],

    propertyOwner: {
      type: mongoose.Types.ObjectId,
      ref: "OwnerUser",
      required: [true, "Please provide a property owner"],
    },
  },
  { timestamps: true }
);

export default mongoose.models("RealEstate", RealEstateSchema);

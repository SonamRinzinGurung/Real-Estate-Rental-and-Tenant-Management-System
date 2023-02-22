import mongoose from "mongoose";

const PaymentHistorySchema = new mongoose.Schema(
  {
    rentDetail: {
      type: mongoose.Types.ObjectId,
      ref: "RentDetail",
      required: true,
    },
    currentRentDate: {
      from: {
        type: String,
        required: [true, "Please provide a start date"],
      },
      to: {
        type: String,
        required: [true, "Please provide an end date"],
      },
    },
    amountPaid: {
      type: Number,
      required: [true, "Please provide an amount paid"],
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ["Cash", "Cheque", "Bank Transfer", "Online"],
        message: "{VALUE} is not supported",
      },
      required: [true, "Please provide a payment method"],
      default: "Cash",
    },
  },
  { timestamps: true }
);

export default mongoose.model("PaymentHistory", PaymentHistorySchema);

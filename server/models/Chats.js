import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    chatUsers: {
      type: Array,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", ChatSchema);

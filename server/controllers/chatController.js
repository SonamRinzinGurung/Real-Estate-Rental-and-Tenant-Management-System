import Chat from "../models/Chats.js";

/**
 * @description Start Chat
 * @returns {object} chat
 */
const startChat = async (req, res) => {
  const {
    user: { userId: senderId },
  } = req;
  const { receiverId } = req.body;

  // Check if chat already exists
  const chatExists = await Chat.findOne({
    chatUsers: { $all: [senderId, receiverId] },
  });
  if (chatExists) {
    return res
      .status(200)
      .json({ chat: chatExists, msg: "Chat already exists" });
  }

  const chat = await Chat.create({
    chatUsers: [senderId, receiverId],
  });
  res.status(201).json({ chat });
};

/**
 * @description Get chat
 * @returns {object} chat
 */
const getChat = async (req, res) => {
  const { userId } = req.user;
  const chat = await Chat.find({
    chatUsers: { $in: [userId] },
  });
  res.status(200).json({ chat });
};
export { startChat, getChat };

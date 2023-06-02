import Chat from "../models/Chats.js";
import Messages from "../models/Messages.js";
import { BadRequestError } from "../request-errors/index.js";

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
      .status(400)
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

/**
 * @description Send message
 * @returns {object} message
 */
const sendMessage = async (req, res) => {
  const { chatId, message } = req.body;
  const { userId: senderId } = req.user;

  //check if chat exists
  const chatExists = await Chat.findById(chatId);

  if (!chatExists) throw new BadRequestError("Chat does not exists");

  //check if user is part of the chat
  const userInChat = chatExists.chatUsers.includes(senderId);

  if (!userInChat) throw new BadRequestError("User not part of the chat");

  const messageSent = await Messages.create({
    chatId,
    senderId,
    message,
  });
  res.status(201).json({ messageSent });
};

/**
 * @description Get all messages for a chat
 * @returns {object} message
 */
const getMessages = async (req, res) => {
  const { chatId } = req.params;

  const messages = await Messages.find({ chatId });

  res.status(200).json({ messages });
};

export { startChat, getChat, sendMessage, getMessages };

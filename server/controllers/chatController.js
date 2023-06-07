import Chat from "../models/Chats.js";

/**
 * @description Send message
 * @returns {object} message
 */
const sendMessage = async (req, res) => {
  const { to, message } = req.body;
  const { userId: from } = req.user;
  const newMessage = await Chat.create({
    chatUsers: [from, to],
    message,
    sender: from,
  });
  res.status(201).json({ newMessage, msg: "Message sent successfully" });
};

/**
 * @description Get all messages for a chat
 * @returns {object} message
 */
const getMessages = async (req, res) => {
  const { to } = req.body;
  const { userId: from } = req.user;

  const msgs = await Chat.find({
    chatUsers: { $all: [from, to] },
  }).sort({ createdAt: 1 });

  const messages = msgs.map((msg) => {
    return {
      fromSelf: msg.sender === from,
      message: msg.message,
    };
  });
  return res.status(200).json({ messages });
};

export { sendMessage, getMessages };

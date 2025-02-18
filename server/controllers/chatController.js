import Chat from "../models/Chats.js";
import OwnerUser from "../models/OwnerUser.js";
import TenantUser from "../models/TenantUser.js";
import BadRequestError from "../request-errors/BadRequest.js";

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
      isRead: msg.isRead,
      createdAt: msg.createdAt,
    };
  });
  return res.status(200).json({ messages });
};

/**
 * @description Get all chats for a user
 * @returns {object} message
 */
const getChats = async (req, res) => {
  const { userId } = req.user;
  let contacts = [];
  let user;

  if (req.path.includes("tenant")) {
    user = await TenantUser.findById(userId).populate({
      path: "contacts",
      select:
        "-savedProperties -contacts -accountVerificationToken -createdAt -updatedAt -__v",
    });
  } else if (req.path.includes("owner")) {
    user = await OwnerUser.findById(userId).populate({
      path: "contacts",
      select:
        "-savedProperties -contacts -accountVerificationToken -createdAt -updatedAt -__v",
    });
  } else {
    throw new BadRequestError("Invalid role");
  }

  if (!user) {
    throw new BadRequestError("User not found");
  }

  if (user.contacts.length === 0) {
    return res.status(200).json({ chats: [] });
  }

  contacts = user?.contacts.map((contact) => ({
    ...contact._doc,
    _id: contact._id.toString(),
    chatUsers: [userId, contact._id.toString()].sort(),
    message: null,
  }));
  // console.log(contacts)
  const lastMessages = await Chat.aggregate([
    {
      $match: {
        chatUsers: { $in: [userId] },
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $addFields: {
        sortedChatUsers: { $sortArray: { input: "$chatUsers", sortBy: 1 } },
      },
    },
    {
      $group: {
        _id: "$sortedChatUsers",
        lastMessage: { $first: "$$ROOT" },
      },
    },
    {
      $replaceRoot: { newRoot: "$lastMessage" },
    }
  ]);

  // console.log(lastMessages)

  const chats = lastMessages.map((lastMessage) => {
    const contact = contacts.find(
      (contact) =>
        JSON.stringify(contact.chatUsers) ===
        JSON.stringify(lastMessage.sortedChatUsers)
    );
    return contact
      ? {
        ...lastMessage,
        ...contact,
        message: lastMessage.message,
      }
      : {
        ...lastMessage,
        chatUsers: lastMessage.sortedChatUsers,
        message: lastMessage.message,
        _id: lastMessage.chatUsers.find(id => id !== userId),
        profileImage: "http://www.gravatar.com/avatar/?d=mp",
        firstName: "User",
        lastName: null,
      };
  }).sort((a, b) => {
    // Sort by createdAt if messages exist, otherwise push empty chats to bottom
    if (a.message && b.message) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (a.message) return -1; // Chats with messages come first
    if (b.message) return 1;
    return 0; // Keep empty chats in original order
  });

  return res.status(200).json({ chats });
};

export { sendMessage, getMessages, getChats };

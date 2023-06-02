import express from "express";
const router = express.Router();
import {
  authorizeOwnerUser,
  authorizeTenantUser,
} from "../middleware/userAuthorization.js";

import {
  startChat,
  getChat,
  sendMessage,
  getMessages,
} from "../controllers/chatController.js";

/**
 * @description start new chat for owner
 * @route POST /api/chat/owner/start-chat
 */
router.post("/owner/start-chat", authorizeOwnerUser, startChat);

/**
 * @description get all chats for owner user
 * @route GET /api/chat/owner/get-chat
 */
router.get("/owner/get-chat", authorizeOwnerUser, getChat);

/**
 * @description send message route for owner user
 * @route POST /api/chat/owner/send-message
 */
router.post("/owner/send-message", authorizeOwnerUser, sendMessage);

/**
 * @description get all messages route for owner user
 * @route GET /api/chat/owner/get-messages/:chatId
 */
router.get("/owner/get-messages/:chatId", authorizeOwnerUser, getMessages);

/**
 * @description start new chat for tenant user
 * @route POST /api/chat/tenant/start-chat
 */
router.post("/tenant/start-chat", authorizeTenantUser, startChat);
/**
 * @description get all chats for tenant user
 * @route GET /api/chat/tenant/get-chat
 */
router.get("/tenant/get-chat", authorizeTenantUser, getChat);

/**
 * @description send message route for tenant user
 * @route POST /api/chat/tenant/send-message
 */
router.post("/tenant/send-message", authorizeTenantUser, sendMessage);

/**
 * @description get all messages route for tenant user
 * @route GET /api/chat/tenant/get-messages/:chatId
 */
router.get("/tenant/get-messages/:chatId", authorizeTenantUser, getMessages);

export default router;

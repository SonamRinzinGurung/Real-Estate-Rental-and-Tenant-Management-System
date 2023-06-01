import express from "express";
const router = express.Router();
import {
  authorizeOwnerUser,
  authorizeTenantUser,
} from "../middleware/userAuthorization.js";

import { startChat, getChat } from "../controllers/chatController.js";

/**
 * @description start new chat for owner
 * @route POST /api/chat/owner/start-chat
 */
router.post("/owner/start-chat", authorizeOwnerUser, startChat);

/**
 * @description start new chat for tenant
 * @route POST /api/chat/tenant/start-chat
 */
router.post("/tenant/start-chat", authorizeTenantUser, startChat);

/**
 * @description get all chats
 * @route GET /api/chat/owner/get-chat
 */
router.get("/owner/get-chat", authorizeOwnerUser, getChat);

/**
 * @description get all chats
 * @route GET /api/chat/tenant/get-chat
 */
router.get("/tenant/get-chat", authorizeTenantUser, getChat);

export default router;

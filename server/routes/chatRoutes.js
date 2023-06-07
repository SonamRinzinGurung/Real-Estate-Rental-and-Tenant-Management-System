import express from "express";
const router = express.Router();
import {
  authorizeOwnerUser,
  authorizeTenantUser,
} from "../middleware/userAuthorization.js";

import { sendMessage, getMessages } from "../controllers/chatController.js";

/**
 * @description send message route for owner user
 * @route POST /api/chat/owner/send-message
 */
router.post("/owner/send-message", authorizeOwnerUser, sendMessage);

/**
 * @description get all messages route for owner user
 * @route POST /api/chat/owner/get-messages
 */
router.post("/owner/get-messages", authorizeOwnerUser, getMessages);

/**
 * @description send message route for tenant user
 * @route POST /api/chat/tenant/send-message
 */
router.post("/tenant/send-message", authorizeTenantUser, sendMessage);

/**
 * @description get all messages route for tenant user
 * @route POST /api/chat/tenant/get-messages
 */
router.post("/tenant/get-messages", authorizeTenantUser, getMessages);

export default router;

import express from "express";
const router = express.Router();
import { sendEmail } from "../utils/emailSender.js";
import he from "he";

/**
 * @description Send email
 * @route POST /api/sendEmail
 */
router.post("/", async (req, res) => {
  try {
    const { to, from, subject, body } = req.body;

    const decodedBody = he.decode(body);

    await sendEmail(to, from, subject, decodedBody);
    res.send({ success: true, message: "Email sent" });
  } catch (error) {
    res.status(500).send("Error sending email");
  }
});

export default router;

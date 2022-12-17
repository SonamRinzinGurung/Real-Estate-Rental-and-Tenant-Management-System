import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Tenant Testing");
});

export default router;

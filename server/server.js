import express from "express";
const app = express();
import authRoutes from "./routes/authRoutes.js";

app.use(express.json());

app.use("/", authRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

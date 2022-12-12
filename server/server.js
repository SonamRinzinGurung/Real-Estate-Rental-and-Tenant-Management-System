import express from "express";
const app = express(); //create an express app
import dotenv from "dotenv"; //to use environment variables
dotenv.config();

import connectDB from "./database/connectDB.js"; //function to connect to the database
//routes
import authRoutes from "./routes/authRoutes.js";

app.use(express.json()); //to parse json data

app.use("/", authRoutes);

const PORT = process.env.PORT || 5000; //port number

//start the server and connect to the database
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();

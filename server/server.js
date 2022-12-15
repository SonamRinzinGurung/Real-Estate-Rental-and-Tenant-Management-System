import express from "express";
const app = express(); //create an express app
import dotenv from "dotenv"; //to use environment variables
dotenv.config();

import "express-async-errors";

import connectDB from "./database/connectDB.js"; //function to connect to the database
//routes
import authRoutes from "./routes/authRoutes.js";

import routeNotFoundMiddleware from "./middleware/route-not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

app.use(express.json()); //to parse json data

app.use("/auth", authRoutes);

app.use(routeNotFoundMiddleware);
app.use(errorHandlerMiddleware);

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

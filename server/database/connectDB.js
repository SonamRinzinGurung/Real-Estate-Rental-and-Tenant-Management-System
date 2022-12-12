import mongoose from "mongoose";

// function to connect to the database
const connectDB = (url) => {
  mongoose.set("strictQuery", true); //suppress mongoose 7 deprecation warning
  return mongoose
    .connect(url)
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log(err);
    });
};

export default connectDB;

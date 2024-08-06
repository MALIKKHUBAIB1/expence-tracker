import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
const connectToMongoDb = async () => {
  try {
    await mongoose.connect(process.env.URL);
  } catch (error) {
    console.log("failed to connect to  the database", error);
  }
};
export { connectToMongoDb };

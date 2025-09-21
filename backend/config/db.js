import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Connected to database");
  } catch (error) {
    console.error("An error occured while connecting to database: ", error);
  }
};

export default connectDatabase;

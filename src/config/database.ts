import mongoose from "mongoose";

const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Database Connection Failed");
    process.exit(1);
  }
};

export default connectDatabase;
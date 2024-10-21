import mongoose from "mongoose";

// export const ConnectDB = async () => {
//   await mongoose.connect('mongodb+srv://drvince00:someday00@cluster0.b8sfz.mongodb.net/gs-blog?retryWrites=true&w=majority&appName=Cluster0');
//   console.log("DB Connected");
// }

export const ConnectDB = async () => {
      try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB!");
      } catch (error) {
        console.error("MongoDB connection error :", error);
      }
};

// export default ConnectDB;

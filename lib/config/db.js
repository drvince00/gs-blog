import mongoose from "mongoose";

export const ConnectDB = async () => {
  // await mongoose.connect('mongodb+srv://drvince00:someday00@cluster0.b8sfz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
  await mongoose.connect('mongodb+srv://drvince00:someday00@cluster0.b8sfz.mongodb.net/gs-blog?retryWrites=true&w=majority&appName=Cluster0');
  console.log("DB Connected");
}
import mongoose from "mongoose";

const connectDB = async ()=> {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");
        return true;
    } catch (error) {
        console.error("Unable to connect to DB", error.message);
        throw error;
    }
}

export default connectDB;
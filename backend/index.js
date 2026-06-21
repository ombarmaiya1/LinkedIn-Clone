import express from "express";
import dotenv from "dotenv"
import connectDB from './config/db.js'
import dns from 'dns'
import cookieParser from "cookie-parser";
import cors from 'cors'
import authrouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";

dns.setServers(["8.8.8.8" ,"1.1.1.1"]);


dotenv.config()
const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));
app.use(express.json());
app.use(cookieParser());

app.use("/",authrouter);
app.use("/",userRouter);

const port = process.env.PORT;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server Started at ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

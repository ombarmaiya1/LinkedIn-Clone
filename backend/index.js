import express from "express";
import dotenv from "dotenv"
import connectDB from './config/db.js'
import dns from 'dns'
import cookieParser from "cookie-parser";
import cors from 'cors'
import http from "http";
import authrouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import { initSocket } from "./config/socket.js";

dns.setServers(["8.8.8.8" ,"1.1.1.1"]);


dotenv.config()
const app = express();
const server = http.createServer(app);
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "https://linkedin-clone-hibm.onrender.com",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback to allow connection
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/",authrouter);
app.use("/",userRouter);
app.use("/post",postRouter);
app.get("/health",()=>{
  return res.json("Success")
}); 

const port = process.env.PORT;

const startServer = async () => {
  try {
    await connectDB();
    initSocket(server);
    server.listen(port, () => {
      console.log(`Server Started at ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

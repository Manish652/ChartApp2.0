import express from 'express';
import cookieParser from 'cookie-parser';
import { app, server } from './lib/socket.js';
import path from 'path';
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from './lib/db.js';
import authRouter from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));

// 🔍 Add this route logger middleware
app.use((req, res, next) => {
  console.log("🧾 Incoming request:", req.method, req.url);
  next();
});

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(cors({
  origin: "http://localhost:5173",  // Use env var if deploying
  credentials: true,
}));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/messages", messageRoutes);

// Production static files
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port: ${PORT}`);
  connectDB();
});

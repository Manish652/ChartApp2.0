import express from 'express';
import cookieParser from 'cookie-parser';
import{app,server} from './lib/socket.js';

app.use(cookieParser());
import dotenv  from "dotenv";
import { connectDB } from './lib/db.js';
import authRouter from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
dotenv.config()
app.use(express.urlencoded({extended:true}));
app.use(express.json());
import path from 'path';

const PORT = process.env.PORT || 8000;

app.use(cors(
    {
        origin: process.env.NODE_ENV === 'production' 
            ? process.env.FRONTEND_URL 
            : "http://localhost:5173",
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
))

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.use("/api/auth",authRouter);
app.use("/api/messages",messageRoutes);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(process.cwd(), '../frontend/dist')));

    app.get("*",(req,res)=>{
        res.sendFile(path.join(process.cwd(), '../frontend/dist', 'index.html'));
    })
}

server.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
    connectDB();
});


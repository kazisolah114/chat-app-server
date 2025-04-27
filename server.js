import express from 'express';
import { configDotenv } from 'dotenv';
import connectDb from './config/connectDb.js';
import userRoute from './routes/userRoute.js';
import messageRoute from './routes/messageRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app, server } from './socket/socket.js'

// Middlewear
configDotenv();
app.use(cookieParser());
app.use(express.json());
const corsOption = {
    origin: 'http://localhost:3000',
    credentials: true
};
app.use(cors(corsOption));

const PORT = process.env.PORT || 8080;

app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);

server.listen(PORT, () => {
    connectDb();
    console.log(`The server is running on port http://localhost:${PORT}`)
})
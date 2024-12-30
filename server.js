import express from 'express';
import { configDotenv } from 'dotenv';
import connectDb from './config/connectDb.js';
import userRoute from './routes/userRoute.js';
import cookieParser from 'cookie-parser';
const app = express();

// Middlewear
configDotenv();
app.use(cookieParser());
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.use("/api/user", userRoute)

app.listen(PORT, () => {
    connectDb();
    console.log(`The server is running on port http://localhost:${PORT}`)
})
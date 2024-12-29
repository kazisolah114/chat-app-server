import express from 'express';
import { configDotenv } from 'dotenv';
import connectDb from './config/connectDb.js';
const app = express();

configDotenv();

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.send("Hello world!")
})

app.listen(PORT, () => {
    connectDb();
    console.log(`The server is running on port http://localhost:${PORT}`)
})
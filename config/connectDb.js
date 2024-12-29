import mongoose from "mongoose";

const connectDb = async () => {
    mongoose.connect(process.env.DB_URI)
    .then(console.log('Database connected successfully!'))
    .catch((error) => console.log(error))
}

export default connectDb;